"""Offline smoke tests for E65 guard. Run: python -m unittest ml.test_e65_reliability_guard"""
import unittest
from ml.e65_reliability_guard import assess_reliability

def fake(agreement=True, margin=1.0):
    return {"intent_id": 10, "out_of_scope": False,
            "scores": [0.0] * 56, "margin": margin,
            "expert_agreement": agreement, "top_intents": []}

class GuardTests(unittest.TestCase):
    def test_banking_english(self):
        r = assess_reliability("Transfer money from my bank account", fake(False, .01))
        self.assertEqual(r["status"], "POTENTIALLY_UNSUPPORTED")
        self.assertEqual(r["detected_domain"], "banking_transfer")

    def test_banking_hinglish(self):
        r = assess_reliability("Mujhe paise transfer karne hain", fake())
        self.assertEqual(r["status"], "POTENTIALLY_UNSUPPORTED")

    def test_supported_currency_exchange_not_flagged(self):
        r = assess_reliability("What is the USD to INR exchange rate?", fake())
        self.assertEqual(r["status"], "ACCEPTED")

    def test_supported_stock_quote_not_flagged(self):
        r = assess_reliability("What is the current share price of Reliance?", fake())
        self.assertEqual(r["status"], "ACCEPTED")

    def test_supported_email_not_flagged(self):
        r = assess_reliability("Send an email to Rahul about the meeting", fake())
        self.assertEqual(r["status"], "ACCEPTED")

    def test_supported_train_booking_not_flagged(self):
        r = assess_reliability("Book a train ticket from Delhi to Mumbai", fake())
        self.assertEqual(r["status"], "ACCEPTED")

    def test_disagreement_alone_review_not_oos(self):
        r = assess_reliability("Tell me a joke", fake(False, .8))
        self.assertEqual(r["status"], "REVIEW_REQUIRED")

    def test_low_margin_alone_review_not_oos(self):
        r = assess_reliability("What time is it?", fake(True, .02))
        self.assertEqual(r["status"], "REVIEW_REQUIRED")

    def test_prediction_not_mutated(self):
        original = fake()
        before = dict(original)
        assess_reliability("Send money to my bank account", original)
        self.assertEqual(original, before)

if __name__ == "__main__":
    unittest.main()
