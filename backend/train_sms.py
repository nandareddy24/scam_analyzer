import os
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from backend.app.ml.sms_model import SMSScamModel
from backend.app.utils.logger import logger


def train_sms_pipeline():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    dataset_path = os.path.join(base_dir, "datasets", "sms_dataset.csv")
    model_path = os.path.join(base_dir, "models", "sms_model.joblib")
    metrics_path = os.path.join(base_dir, "models", "sms_metrics.json")

    logger.info(f"Loading SMS dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)

    X = df["text"].tolist()
    y = df["label"].tolist()

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    logger.info(f"Training SMS Scam Classification Model on {len(X_train)} samples...")
    model = SMSScamModel()
    model.fit(X_train, y_train)

    logger.info(f"Evaluating SMS model on {len(X_test)} test split samples...")
    metrics = model.evaluate(X_test, y_test)

    # Save model and metrics
    model.save(model_path)
    logger.info(f"Saved trained SMS model -> {model_path}")

    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    logger.info(f"Saved SMS evaluation metrics -> {metrics_path}")

    print("\n" + "=" * 50)
    print("      SMS SCAM MODEL TRAINING & EVALUATION REPORT")
    print("=" * 50)
    print(f"Test Accuracy  : {metrics['accuracy']:.4f}")
    print(f"Precision      : {metrics['precision']:.4f}")
    print(f"Recall         : {metrics['recall']:.4f}")
    print(f"F1-Score       : {metrics['f1_score']:.4f}")
    print(f"Confusion Matrix:\n{metrics['confusion_matrix']}")
    print("=" * 50 + "\n")


if __name__ == "__main__":
    train_sms_pipeline()
