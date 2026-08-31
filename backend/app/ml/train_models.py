import os
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from backend.app.utils.logger import logger


def train_and_save_ml_models():
    """
    Trains scikit-learn Machine Learning pipelines for SMS scam classification
    and UPI VPA handle risk scoring, saving models to joblib files.
    """
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models"))
    os.makedirs(models_dir, exist_ok=True)

    logger.info("Building synthetic training datasets for scikit-learn ML models...")

    # --- 1. SMS Scam Classifier Dataset & Training ---
    sms_data = [
        # Legitimate SMS (label: 0)
        ("123456 is your secret OTP for login to SBI YONO. Do not share with anyone.", 0),
        ("Your account XX4819 has been credited with Rs 1,500 via UPI on 30 Aug.", 0),
        ("Rs 250 debited from SBI account XX1209 to Zomato Online.", 0),
        ("Your electric bill of Rs 840 for Aug has been successfully processed.", 0),
        ("Dear customer, your credit card statement for Aug is generated.", 0),
        ("Your booking for flight AI-102 is confirmed. PNR: ABC123.", 0),
        
        # Scam / Phishing SMS (label: 1)
        ("CONGRATS! Rs 25,000 credited to your GPay account. Enter your 6-digit UPI PIN to accept payment immediately.", 1),
        ("URGENT: CBI & Cyber Police issued Digital Arrest Warrant against your Aadhaar for illegal narcotics. Join video call.", 1),
        ("Dear customer, SBI account blocked in 24 hours. Update PAN card immediately at http://sbi-kyc-verify.top", 1),
        ("Work from home job offer! Earn Rs 5000 per day by simply liking YouTube videos. Join Telegram t.me/work_earn", 1),
        ("Congratulations! KBC Lucky Draw prize of Rs 25 Lakhs won. Contact Manager Ramesh Sharma on WhatsApp.", 1),
        ("Dear Customer, your 8500 SBI Reward Points worth Rs 4250 expire today. Redeem now at http://sbi-rewards.top", 1),
        ("Electricity connection will be disconnected tonight 9:30 PM due to unpaid bill. Call officer immediately.", 1),
    ]

    df_sms = pd.DataFrame(sms_data, columns=["text", "label"])
    
    sms_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=1000)),
        ("classifier", RandomForestClassifier(n_estimators=50, random_state=42)),
    ])

    sms_pipeline.fit(df_sms["text"], df_sms["label"])
    
    sms_model_path = os.path.join(models_dir, "sms_scam_model.joblib")
    joblib.dump(sms_pipeline, sms_model_path)
    logger.info(f"Saved trained SMS ML Model -> {sms_model_path}")

    # --- 2. UPI VPA Risk Predictor Dataset & Training ---
    upi_data = [
        ("merchant.zomato@icici", 0),
        ("swiggy@hdfcbank", 0),
        ("uber@axisbank", 0),
        ("bookmyshow@ybl", 0),
        ("paytm-refund-desk@okaxis", 1),
        ("sbi-customer-care-helpdesk@okicici", 1),
        ("9876543210.lottery@ybl", 1),
        ("cashback-claim-desk@ybl", 1),
        ("kyc-update-verify@okaxis", 1),
    ]

    df_upi = pd.DataFrame(upi_data, columns=["vpa", "label"])

    upi_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4))),
        ("classifier", RandomForestClassifier(n_estimators=50, random_state=42)),
    ])

    upi_pipeline.fit(df_upi["vpa"], df_upi["label"])

    upi_model_path = os.path.join(models_dir, "upi_scam_model.joblib")
    joblib.dump(upi_pipeline, upi_model_path)
    logger.info(f"Saved trained UPI VPA ML Model -> {upi_model_path}")

    logger.info("Machine Learning model training completed successfully.")


if __name__ == "__main__":
    train_and_save_ml_models()
