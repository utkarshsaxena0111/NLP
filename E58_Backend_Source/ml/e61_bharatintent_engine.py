"""Frozen E58 live inference. No training, no network, no cached predictions used for inference."""
import argparse, json, re, unicodedata, time
from pathlib import Path
from contextlib import nullcontext
import numpy as np
import pandas as pd
import joblib
import torch
from torch import nn
from transformers import AutoModel, AutoTokenizer
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

ROOT=Path(__file__).resolve().parents[1]
DEV=re.compile(r'[\u0900-\u097f]'); LATIN=re.compile(r'[a-zA-Z]')
CLASSES=np.arange(56)
def normalize(t):
    t = unicodedata.normalize('NFKC', str(t)).lower()
    return ' '.join(re.sub(r'[^\w\s]', ' ', t).split())


def script(t):
    has_dev = bool(DEV.search(t))
    has_lat = bool(LATIN.search(t))
    return 'mixed' if has_dev and has_lat else 'devanagari' if has_dev else 'latin'


def roman_variants(t, transliterate, sanscript):
    """Up to three deterministic Latin representations; conservative not a translator.

    Transliteration may be imperfect and may yield unnatural words; measure this
    instead of assuming generated strings represent spoken Hindi accurately.
    """
    if not DEV.search(t):
        return []
    # ITRANS retains phoneme distinctions; case normalization loses some nuance.
    raw = transliterate(str(t), sanscript.DEVANAGARI, sanscript.ITRANS)
    a = normalize(raw)
    if not a or DEV.search(a):
        return []
    # Orthographic simplification common in informal Hindi romanization.
    b = a
    for before, after in [('aa', 'a'), ('ii', 'i'), ('ee', 'i'), ('uu', 'u'),
                          ('oo', 'u'), ('sh', 's'), ('w', 'v')]:
        b = b.replace(before, after)
    # Gentle SMS-like noise: drop some internal vowels in longer words only;
    # retain first/last letters and short words to prevent too much corruption.
    words = []
    for word in b.split():
        if len(word) >= 6 and word.isalpha():
            word = word[0] + re.sub(r'[aeiou]', '', word[1:-1]) + word[-1]
        words.append(word)
    c = ' '.join(words)
    result = []
    for s in (a, b, c):
        if len(s) >= 3 and s not in result and s != normalize(t):
            result.append(s)
    return result


class IntentModel(nn.Module):
    def __init__(self,encoder):
        super().__init__(); self.encoder=encoder; self.head=nn.Sequential(nn.LayerNorm(encoder.config.hidden_size),nn.Dropout(.1),nn.Linear(encoder.config.hidden_size,56))
    def forward(self,ids,mask):
        h=self.encoder(input_ids=ids,attention_mask=mask).last_hidden_state
        h=(h.float()*mask.unsqueeze(-1)).sum(1)/mask.sum(1,keepdim=True).clamp_min(1)
        return self.head(h)

def alternate(text):
    try: r=roman_variants(text,transliterate,sanscript)
    except Exception: r=[]
    alt=r[0] if r else ' '.join(unicodedata.normalize('NFKC',text).lower().split())
    return alt if alt and alt!=text else None

def norm(a,s): return (a-a.mean(axis=1,keepdims=True))/s

def fuse(z,alt,lex,zs,ls):
    return .4*norm(.85*z+.15*alt,zs)+.6*norm(lex,ls)

class BharatIntentEngine:
    def __init__(self, champion=None, device='auto'):
        self.base=Path(champion or ROOT/'champions/E58_086085')
        self.device=torch.device(('cuda' if torch.cuda.is_available() else 'cpu') if device=='auto' else device)
        self.dtype=(torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16) if self.device.type=='cuda' else torch.float32
        meta=json.loads((self.base/'e57_checkpoint/metadata.json').read_text())
        selected=json.loads((self.base/'e58_final_attempt/selected.json').read_text())
        train=json.loads((self.base/'e53_fold0_aug/metadata.json').read_text())
        if selected['candidate']!='tta0.15_lex0.6_c3mix0.0' or meta['checkpoint']['epoch']!=7 or train['best']['epoch']!=7 or train['score_order']!=list(range(56)) or train['args']['max_length']!=64: raise ValueError('Wrong champion configuration')
        self.zs=float(meta['muril_scale']); self.ls=float(meta['lexical_scale'])
        if not np.isclose(self.zs,1.042497229227652,rtol=0,atol=1e-12) or not np.isclose(self.ls,.4132422346202284,rtol=0,atol=1e-12): raise ValueError('Wrong normalization constants')
        dest=self.base/'e53_fold0_aug/best_model'
        self.tok=AutoTokenizer.from_pretrained(dest/'encoder',local_files_only=True)
        self.model=IntentModel(AutoModel.from_pretrained(dest/'encoder',local_files_only=True))
        self.model.head.load_state_dict(torch.load(dest/'head.pt',map_location='cpu',weights_only=True)); self.model.to(self.device).eval()
        # Load only trusted local joblib artifacts, never arbitrary user files.
        self.lex=[joblib.load(self.base/f'e46/{n}_full.joblib') for n in ('char','char_wb')]
        for b in self.lex:
            if not np.array_equal(b['model'].classes_,CLASSES): raise ValueError('Wrong class order')
        self.params=sum(p.numel() for p in self.model.parameters())+sum(b['model'].coef_.size+b['model'].intercept_.size for b in self.lex)
        if self.params!=247005184: raise ValueError(f'Unexpected parameter count {self.params}')
    def neural(self,texts,batch_size):
        chunks=[]
        with torch.inference_mode():
            for i in range(0,len(texts),batch_size):
                e=self.tok(texts[i:i+batch_size],padding='max_length',truncation=True,max_length=64,return_tensors='pt')
                ctx=torch.autocast('cuda',dtype=self.dtype) if self.device.type=='cuda' else nullcontext()
                with ctx: z=self.model(e['input_ids'].to(self.device),e['attention_mask'].to(self.device))
                chunks.append(z.float().cpu().numpy())
        return np.concatenate(chunks).astype(np.float64)
    def score_batch(self,texts,original_batch=4,tta_batch=16):
        texts=list(texts)
        if not texts or any(not isinstance(t,str) for t in texts): raise ValueError('Expected nonempty sequence of strings')
        if min(original_batch,tta_batch)<1: raise ValueError('Invalid batch size')
        start=time.perf_counter(); z=self.neural(texts,original_batch); alts=[alternate(t) for t in texts]; ids=[i for i,a in enumerate(alts) if a is not None]; a=z.copy()
        if ids: a[ids]=self.neural([alts[i] for i in ids],tta_batch)
        c,w=[np.asarray(b['model'].decision_function(b['vectorizer'].transform(texts)),dtype=np.float32) for b in self.lex]
        l=(.6*c+.4*w).astype(np.float64)
        final=fuse(z,a,l,self.zs,self.ls)
        if final.shape!=(len(texts),56) or not np.isfinite(final).all(): raise ValueError('Invalid score matrix')
        return dict(original=z,alternate=a,lexical=l,char=c,char_wb=w,final=final,alternate_text=alts,elapsed_ms=(time.perf_counter()-start)*1000)
    def predict_batch(self,texts,top_k=5):
        texts=list(texts); r=self.score_batch(texts); k=max(1,min(56,int(top_k))); out=[]
        for i,t in enumerate(texts):
            s=r['final'][i]; order=np.argsort(-s,kind='stable'); p=int(order[0]); n=.85*r['original'][i]+.15*r['alternate'][i]; l=r['lexical'][i]
            out.append(dict(query=t,model_version='E58',script=script(t),intent_id=p,out_of_scope=p==55,alternate_text=r['alternate_text'][i],tta_applied=r['alternate_text'][i] is not None,score_type='normalized_decision_score_not_probability',top_intents=[dict(intent_id=int(j),score=float(s[j])) for j in order[:k]],scores=s.tolist(),margin=float(s[order[0]]-s[order[1]]),neural_intent=int(n.argmax()),lexical_intent=int(l.argmax()),expert_agreement=bool(n.argmax()==l.argmax()),neural_scores=n.tolist(),lexical_scores=l.tolist()))
        return dict(predictions=out,batch_latency_ms=r['elapsed_ms'],parameters=self.params,device=str(self.device))
    def predict(self,text,top_k=5):
        r=self.predict_batch([text],top_k); return dict(r['predictions'][0],latency_ms=r['batch_latency_ms'],parameters=self.params,device=r['device'])

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--champion',type=Path); ap.add_argument('--device',choices=['auto','cuda','cpu'],default='auto'); ap.add_argument('--query'); ap.add_argument('--verify',action='store_true'); args=ap.parse_args()
    if not args.verify and args.query is None: ap.error('Specify --verify or --query')
    engine=BharatIntentEngine(args.champion,args.device); print('Loaded',engine.params,'parameters on',engine.device,flush=True)
    if args.query is not None: print(json.dumps(engine.predict(args.query),ensure_ascii=False,indent=2))
    if args.verify:
        test=pd.read_csv(ROOT/'data/test.csv',dtype={'example_id':str}); expected=pd.read_csv(engine.base/'bharatintent_e58_final_attempt.csv',dtype={'example_id':str}); assert len(test)==4912 and test.example_id.is_unique and test.example_id.equals(expected.example_id)
        texts=test.query_text.astype(str).tolist(); r=engine.score_batch(texts); pred=r['final'].argmax(1); mism=pred!=expected.target.to_numpy()
        out=ROOT/'artifacts/e61_production_verify'; out.mkdir(parents=True,exist_ok=True)
        pd.DataFrame(dict(example_id=test.example_id,expected=expected.target,actual=pred)).loc[mism].to_csv(out/'mismatches.csv',index=False)
        # Cached scores used only for diagnostics after genuine inference.
        cache=engine.base/'e57_checkpoint/test_scores.npz'
        if cache.exists():
            with np.load(cache,allow_pickle=False) as old:
                idx=pd.Index(old['example_id'].astype(str)).get_indexer(test.example_id); assert (idx>=0).all() and np.array_equal(old['classes'],CLASSES)
                for key,ref in [('original','muril'),('lexical','e46_lexical')]:
                    d=r[key]-old[ref][idx]; print(key,'max absolute difference',float(np.abs(d).max()),'argmax mismatches',int((r[key].argmax(1)!=old[ref][idx].argmax(1)).sum()))
        # Compare actual independent single-query calls with batch inference on 12 fixed rows.
        indices=np.linspace(0,len(texts)-1,12,dtype=int); single=np.array([engine.predict(texts[i])['intent_id'] for i in indices]); sm=int((single!=pred[indices]).sum())
        report=dict(rows=len(test),mismatches=int(mism.sum()),single_batch_sample_rows=len(indices),single_batch_mismatches=sm,tta_queries=sum(x is not None for x in r['alternate_text']),device=str(engine.device),precision=str(engine.dtype),params=engine.params)
        (out/'report.json').write_text(json.dumps(report,indent=2)); print(json.dumps(report,indent=2)); print('REPRODUCTION PASS' if not mism.any() and sm==0 else 'REPRODUCTION NOT EXACT; investigate before deployment')
        if mism.any() or sm: raise SystemExit(1)

if __name__=='__main__': main()
