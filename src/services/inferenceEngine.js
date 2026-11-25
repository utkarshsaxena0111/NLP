import { INTENT_TAXONOMY, getIntentById } from "../data/intentTaxonomy";

/**
 * Script detection heuristic
 */
export function detectScript(text) {
  if (!text) return "unknown";
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);

  if (hasDevanagari && hasLatin) return "Mixed Script (Hinglish)";
  if (hasDevanagari) return "Devanagari";
  if (hasLatin) return "Latin (Romanized / English)";
  return "Numeric / Symbolic";
}

/**
 * Extract character n-grams (n=2 to 5)
 */
export function extractCharNgrams(text, minN = 2, maxN = 5) {
  const clean = text.toLowerCase().replace(/[\s\p{P}]+/gu, " ");
  const ngrams = new Set();
  for (let n = minN; n <= maxN; n++) {
    for (let i = 0; i <= clean.length - n; i++) {
      ngrams.add(clean.substring(i, i + n));
    }
  }
  return Array.from(ngrams);
}

/**
 * Consonant skeleton transform for phonetic invariance
 */
export function toConsonantSkeleton(text) {
  let s = text.toLowerCase();
  // Transliteration normalizations
  s = s.replace(/sh/g, "s").replace(/kh/g, "k").replace(/gh/g, "g");
  s = s.replace(/ph/g, "f").replace(/bh/g, "b").replace(/th/g, "t");
  s = s.replace(/dh/g, "d").replace(/ch/g, "c").replace(/jh/g, "j");
  s = s.replace(/ee/g, "i").replace(/oo/g, "u").replace(/aa/g, "a");
  s = s.replace(/[aeiou]/g, ""); // strip vowels to extract skeleton
  s = s.replace(/(.)\1+/g, "$1"); // deduplicate consecutive consonants
  return s.trim();
}

/**
 * Multi-class lexical pattern index
 */
const CLASS_PATTERNS = {
  0: { // datetime_query
    tokens: ["samay", "time", "date", "tarikh", "tareekh", "baj", "maheena", "somvaar", "ghadi", "samay", "kitne baje", "समय", "तारीख", "बजे", "महीना", "घड़ी"],
    bonus: 2.8
  },
  1: { // iot_lighting_color
    tokens: ["rang", "color", "colour", "lal", "peela", "neela", "hara", "red", "blue", "yellow", "green", "गुलाबी", "लाल", "नीली", "पीले", "रंग"],
    bonus: 3.2
  },
  2: { // transport_ticket_book
    tokens: ["tikat", "ticket", "book", "tren", "train", "relgaari", "railgadi", "irctc", "seat", "chair car", "टिकट", "ट्रेन", "रेलगाड़ी", "बुक"],
    bonus: 3.0
  },
  3: { // food_order_status
    tokens: ["order status", "kab tak aayega", "delivery", "pahunch", "pahuchega", "swiggy status", "zomato order", "पहुँचने", "डिलीवरी", "ऑर्डर कहाँ"],
    bonus: 2.9
  },
  4: { // finance_stock_quote
    tokens: ["stock", "share", "reliance", "nifty", "sensex", "market", "bhav", "rate", "nivesh", "शेयर", "स्टॉक", "रिलायंस", "सेंसेक्स", "निफ्टी"],
    bonus: 3.1
  },
  5: { // conversational_greeting
    tokens: ["namaste", "namaskar", "hello", "hi", "hey", "kaise ho", "kaisa chal", "sun rahe", "kya haal", "नमस्ते", "हाय", "कैसे हैं", "सुप्रभात"],
    bonus: 2.6
  },
  6: { // events_cultural_discovery
    tokens: ["event", "festival", "carnival", "mela", "utsav", "chhutti", "holiday", "shehar me", "त्योहार", "उत्सव", "अवकाश", "मेला", "कार्निवाल"],
    bonus: 2.7
  },
  7: { // music_dislike_rating
    tokens: ["dislike", "hate", "nafrat", "bekaar", "pasand nahi", "skip", "mat bajao", "नफरत", "पसंद नहीं", "बेकार गाना", "हटाओ"],
    bonus: 3.0
  },
  8: { // iot_plug_off
    tokens: ["plug off", "socket band", "power plug band", "switch off plug", "wemo band", "सॉकेट बंद", "पावर प्लग बंद", "प्लग ऑफ"],
    bonus: 3.1
  },
  9: { // cooking_recipe_lookup
    tokens: ["recipe", "vidhi", "kaise banaye", "kaise pakaye", "tandoori chicken", "paneer butter", "ingredients", "विधि", "रेसिपी", "कैसे बनाएं", "पकाने"],
    bonus: 3.0
  },
  10: { // finance_currency_exchange
    tokens: ["exchange rate", "dollar", "rupee", "euro", "forex", "vinimay dar", "kitne rupaye", "डॉलर", "रुपये", "एक्सचेंज रेट", "विनिमय दर"],
    bonus: 3.2
  },
  11: { // transport_traffic_status
    tokens: ["traffic", "yataayat", "jam", "congestion", "road khali", "drive time", "यातायात", "ट्रैफिक", "जाम", "सड़क"],
    bonus: 3.0
  },
  12: { // device_chitchat_fallback
    tokens: ["chhutti le raha", "mera din", "biscuit", "dost", "olly suno", "tum kya", "ओली", "दिन कैसा", "छुट्टी", "बात सुनो"],
    bonus: 2.4
  },
  13: { // weather_forecast_query
    tokens: ["weather", "mausam", "barish", "rain", "temperature", "tapmaan", "forecast", "thand", "dhoop", "मौसम", "बारिश", "तापमान", "पूर्वानुमान"],
    bonus: 3.3
  },
  14: { // audio_volume_increase
    tokens: ["volume bada", "sound up", "zor se", "loud karo", "avaz bada", "aawaz badhao", "आवाज़ बढ़ाओ", "जोर से बोलो", "वॉल्यूम बढ़ा"],
    bonus: 3.4
  },
  15: { // contacts_add_edit
    tokens: ["contact save", "number add", "contact edit", "nayi email", "sampark list", "संपर्क सहेजें", "नंबर सेव", "कॉन्टैक्ट ऐड"],
    bonus: 2.9
  },
  16: { // food_order_create
    tokens: ["khana order", "pizza mangwa", "swiggy", "zomato", "biryani order", "order karo", "खाना लाओ", "पिज़्ज़ा खरीदो", "ऑर्डर करो"],
    bonus: 3.0
  },
  17: { // contacts_query
    tokens: ["contact info", "mobile number", "phone number batao", "pata kya hai", "sampark jankari", "मोबाइल नंबर", "फोन नंबर", "संपर्क जानकारी"],
    bonus: 3.1
  },
  18: { // iot_lighting_brightness_up
    tokens: ["roshni bada", "light tez karo", "brightness badha", "battiyan tez", "tez roshni", "अंधेरा है", "रोशनी बढ़ाएं", "लाइट तेज"],
    bonus: 3.2
  },
  19: { // places_local_search
    tokens: ["nearby", "paas me", "dukan", "market", "coffee shop", "store kahan", "krishi bazaar", "पास में दुकान", "बाज़ार खोजें", "स्टोर कहाँ"],
    bonus: 2.8
  },
  20: { // audio_playback_resume
    tokens: ["resume", "fir se chalu", "phir se bajao", "continue audio", "unpause", "फिर से चालू", "दोबारा चालू", "रिज्यूम"],
    bonus: 3.0
  },
  21: { // list_item_add
    tokens: ["list me add", "item jodo", "shopping list me", "notes me", "doodh likho", "सूची में जोड़ें", "लिस्ट में ऐड", "नोट्स खोलो"],
    bonus: 2.9
  },
  22: { // news_headlines_query
    tokens: ["news", "khabar", "samachar", "breaking news", "aaj ki khabar", "headline", "ताज़ा खबरें", "समाचार", "खबर", "न्यूज़"],
    bonus: 3.0
  },
  23: { // iot_plug_on
    tokens: ["plug on", "socket chalu", "power switch on", "wemo on", "सॉकेट चालू", "प्लग ऑन", "पावर ऑन"],
    bonus: 3.1
  },
  24: { // general_joke_query
    tokens: ["joke", "chutkula", "hasao", "comedy", "funny", "व्यंग्यात्मक", "चुटकुला सुनाओ", "मजाक", "हँसाओ"],
    bonus: 3.2
  },
  25: { // general_define_meaning
    tokens: ["meaning", "paribhasha", "arth kya", "define", "definition", "matlab", "अर्थ क्या है", "परिभाषा", "मतलब क्या"],
    bonus: 3.0
  },
  26: { // social_feed_query
    tokens: ["social media", "facebook", "twitter", "instagram message", "dm check", "notification", "सोशल मीडिया", "फेसबुक", "मैसेज"],
    bonus: 2.8
  },
  27: { // music_track_repeat
    tokens: ["repeat", "loop", "ek baar fir yahi", "dobara bajao", "fir bajao", "दोहराएं", "दोबारा चलाओ", "लूप पर"],
    bonus: 3.1
  },
  28: { // audio_preset_setting
    tokens: ["sound profile", "equalizer", "outdoor mode", "audio setting", "theater mode", "साउंड प्रोफ़ाइल", "ऑडियो सेटिंग", "मोड बदलें"],
    bonus: 3.0
  },
  29: { // calendar_event_remove
    tokens: ["calendar se hata", "event cancel", "meeting delete", "appointment hatao", "schedule se delete", "कैलेंडर से हटाएं", "इवेंट रद्द", "अपॉइंटमेंट हटा"],
    bonus: 3.3
  },
  30: { // iot_lighting_dim
    tokens: ["light dim", "roshni kam", "dheemi roshni", "ujjval kam", "dim lights", "रोशनी कम करें", "लाइट डिम", "मद्धम"],
    bonus: 3.2
  },
  31: { // calendar_schedule_query
    tokens: ["schedule", "meeting kab hai", "calendar check", "karyakram", "summit meeting", "अगले रविवार", "शेड्यूल", "बैठक कब है", "कैलेंडर"],
    bonus: 3.0
  },
  32: { // communication_email_send
    tokens: ["email bhej", "mail karo", "send email", "email compose", "imel bhejo", "ईमेल भेजें", "मेल करो", "ईमेल लिखो"],
    bonus: 3.2
  },
  33: { // iot_vacuum_start
    tokens: ["vacuum", "vaikyum", "roomba", "safai chalu", "floor saaf", "klinar", "वैक्यूम", "रूमबा", "सफाई शुरू", "झाड़ू"],
    bonus: 3.4
  },
  34: { // audio_volume_decrease
    tokens: ["volume kam", "sound down", "dheeme bolo", "quiet", "avaz kam", "धीमे", "आवाज़ कम", "वॉल्यूम कम", "धीमी आवाज"],
    bonus: 3.3
  },
  35: { // media_radio_stream
    tokens: ["radio", "akashvani", "fm", "mirchi", "vividh bharati", "रेडियो चलाओ", "आकाशवाणी", "रेडियो स्टेशन"],
    bonus: 3.2
  },
  36: { // cooking_tips_recipe
    tokens: ["crispy", "oil kam", "green color", "fry tips", "khana tips", "sokhana kam", "तेल सोखना", "पराठे कैसे", "कुरकुरा"],
    bonus: 2.9
  },
  37: { // time_convert_timezone
    tokens: ["ist", "timezone", "time difference", "antar kya hai", "new york samay", "समय अंतर", "मानक समय", "टाइमज़ोन"],
    bonus: 3.3
  },
  38: { // general_math_calculate
    tokens: ["guna", "multiply", "divide", "bhag", "calculate", "plus", "minus", "प्रतिशत", "गुणा करो", "विभाजित", "जोड़ो"],
    bonus: 3.2
  },
  39: { // iot_lighting_off
    tokens: ["light band", "battiyan band", "lights off", "switch off light", "lamp band", "बत्तियां बंद", "लाइट बंद", "स्विच ऑफ"],
    bonus: 3.3
  },
  40: { // iot_lighting_on
    tokens: ["light chalu", "battiyan on", "lamp on", "lights turn on", "roshni chalu", "लाइट चालू", "लैंप ऑन", "बत्तियाँ जलाओ"],
    bonus: 3.3
  },
  41: { // transport_train_schedule
    tokens: ["train time", "platform", "relgaari time", "arrival", "departure", "train schedule", "ट्रेन का समय", "प्लेटफॉर्म", "रेलगाड़ी कब"],
    bonus: 3.2
  },
  42: { // music_rating_save
    tokens: ["favorite save", "gana pasand", "playlist save", "music preference", "dhun note", "पसंद सहेजें", "राय सुरक्षित", "पसंदीदा गाना"],
    bonus: 3.0
  },
  43: { // communication_email_query
    tokens: ["inbox check", "unread email", "nae mail", "email list", "subject line", "इनबॉक्स", "नए ईमेल", "मेल पढ़ो"],
    bonus: 3.1
  },
  44: { // music_playback_start
    tokens: ["play song", "gana bajao", "chala do gana", "arijit singh", "music play", "track play", "गीत बजाओ", "गाना चलाओ", "संगीत बजाएं"],
    bonus: 3.2
  },
  45: { // assistant_silence_mute
    tokens: ["shant raho", "chup", "kuch mat bolo", "quiet mode", "stop speaking", "mute", "शांत रहो", "चुप रहो", "मत बोलो"],
    bonus: 3.2
  },
  46: { // social_post_tweet
    tokens: ["tweet karo", "post karo", "facebook post", "complaint tweet", "status update", "पोस्ट करें", "ट्वीट करें", "शिकायत भेजो"],
    bonus: 3.1
  },
  47: { // fact_qa_general
    tokens: ["capital of", "rajdhani", "sabse lamba", "height of", "president", "janm kab", "राजधानी", "सबसे अधिक", "ऊँचाई", "सामान्य ज्ञान"],
    bonus: 2.9
  },
  48: { // alarm_reminder_set
    tokens: ["alarm set", "alarm lagao", "wake up alarm", "morning alarm", "reminder daal", "yaad dilana", "अलार्म लगाओ", "अलार्म सेट", "याद दिलाना", "जगाना"],
    bonus: 3.4
  },
  49: { // alarm_reminder_remove
    tokens: ["alarm delete", "alarm hatao", "cancel alarm", "alarm band karo", "unset alarm", "अलार्म हटाएं", "अलार्म डिलीट", "अलार्म बंद"],
    bonus: 3.4
  },
  50: { // list_item_remove
    tokens: ["list se hatao", "item delete", "shopping list clear", "task complete", "हटा दो सूची", "लिस्ट से हटा", "डिलीट सूची"],
    bonus: 3.1
  },
  51: { // transport_taxi_book
    tokens: ["cab", "taxi", "uber", "ola", "ride book", "auto rickshaw", "टैक्सी बुलाओ", "कैब बुक", "ऊबर खोजो"],
    bonus: 3.3
  },
  52: { // media_movies_query
    tokens: ["movie", "film", "cinema", "showtime", "theatre", "release", "फ़िल्में", "सिनेमा", "मूवी", "थिएटर"],
    bonus: 3.1
  },
  53: { // music_identify_query
    tokens: ["kaunsa gana", "artist kaun", "singer name", "track identify", "what song", "कौन सा गीत", "कलाकार कौन", "गायक कौन"],
    bonus: 3.2
  },
  54: { // list_notes_view
    tokens: ["karyasoochi", "to-do list", "kya likha hai", "notes dikhao", "list read karo", "काम की सूची", "मेरी सूची", "नोट्स पढ़ो"],
    bonus: 3.0
  },
  55: { // out_of_scope_unsupported
    tokens: ["coffee bana", "mars par le jao", "spaceship", "car chala", "plane udao", "bhoot", "unsupported", "कॉफ़ी बनाओ", "उड़ान भरो"],
    bonus: 2.5
  }
};

/**
 * Predict Intent using Client-side Multilingual NLP Engine
 * (Simulates the verified E46 / E50 / Phonetic model pipeline)
 */
export function predictClient(query, modelId = "e46") {
  const startTime = performance.now();
  const text = (query || "").trim();
  const lower = text.toLowerCase();
  const script = detectScript(text);
  const skeleton = toConsonantSkeleton(text);
  const ngrams = extractCharNgrams(text, 2, 4);

  // Raw score accumulators for all 56 classes
  const rawScores = new Array(56).fill(0);

  // Baseline noise distribution to simulate decision hyperplane distance
  for (let i = 0; i < 56; i++) {
    rawScores[i] = -1.2 + (Math.sin(i * 1.3) * 0.15);
  }

  // Model-specific adjustments
  const isE46 = modelId === "e46";
  const isE50 = modelId === "e50";
  const isPhon = modelId === "phon";
  const isMuril = modelId === "muril";

  // Score accumulation
  for (let classId = 0; classId < 56; classId++) {
    const pat = CLASS_PATTERNS[classId];
    if (!pat) continue;

    let matchCount = 0;

    for (const tok of pat.tokens) {
      const tokLower = tok.toLowerCase();
      if (lower.includes(tokLower)) {
        matchCount += 2.0;
      } else {
        // Phonetic skeleton matching
        const tokSkel = toConsonantSkeleton(tok);
        if (tokSkel.length > 2 && skeleton.includes(tokSkel)) {
          matchCount += isPhon ? 2.5 : 1.2;
        }
      }
    }

    if (matchCount > 0) {
      let multiplier = pat.bonus;
      if (isE46) multiplier *= 1.25; // champion boost
      if (isE50 && script.includes("Devanagari") && /[ऀ-ॿ]/.test(pat.tokens.join(" "))) {
        multiplier *= 1.35; // script routed boost
      }
      if (isPhon && script.includes("Latin")) {
        multiplier *= 1.3;
      }
      if (isMuril) {
        multiplier *= 1.28;
      }
      rawScores[classId] = 0.5 + (matchCount * multiplier);
    }
  }

  // If no strong match, evaluate out-of-scope (class 55) or general chitchat (class 12)
  const maxScore = Math.max(...rawScores);
  if (maxScore < 0.2) {
    if (/coffee|fly|mars|alien|spaceship|doctor|drive/i.test(lower)) {
      rawScores[55] = 1.8;
    } else {
      rawScores[12] = 0.9; // fallback chitchat
      rawScores[55] = 0.7; // uncertainty
    }
  }

  // Softmax calibration
  const expScores = rawScores.map(s => Math.exp(s));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const probs = expScores.map(e => e / sumExp);

  // Ranked classes
  const ranked = probs
    .map((p, idx) => ({
      classId: idx,
      score: p,
      decisionScore: rawScores[idx],
      meta: getIntentById(idx)
    }))
    .sort((a, b) => b.score - a.score);

  const top1 = ranked[0];
  const top2 = ranked[1] || { score: 0 };
  const top5 = ranked.slice(0, 5);

  const margin = Number((top1.score - top2.score).toFixed(4));
  const confidence = Number(top1.score.toFixed(4));

  const endTime = performance.now();
  // Simulated hardware latency based on model
  let baseLatency = isPhon ? 9 : isE46 ? 14 : isE50 ? 22 : isMuril ? 115 : 68;
  const jitter = Math.floor(Math.random() * 4) - 2;
  const latencyMs = Math.max(5, baseLatency + jitter);

  return {
    query: text,
    intentId: top1.classId,
    intentName: top1.meta.name,
    displayName: top1.meta.displayName,
    category: top1.meta.category,
    confidence,
    margin,
    decisionScore: Number(top1.decisionScore.toFixed(3)),
    isOutOfScope: top1.classId === 55 || top1.meta.isOutOfScope,
    script,
    top5: top5.map(t => ({
      classId: t.classId,
      name: t.meta.name,
      displayName: t.meta.displayName,
      category: t.meta.category,
      score: Number(t.score.toFixed(4)),
      isOutOfScope: t.classId === 55
    })),
    modelUsed: modelId,
    latencyMs,
    preprocessing: {
      tokens: text.split(/\s+/).length,
      charNgramsCount: ngrams.length,
      consonantSkeleton: skeleton || "N/A",
      scriptHeuristic: script
    },
    isLiveBackend: false,
    timestamp: new Date().toISOString()
  };
}
