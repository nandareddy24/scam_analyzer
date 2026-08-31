import os
import re
import joblib
from typing import Dict, Any, List, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix


class SMSScamModel:
    """
    Independent scikit-learn Machine Learning pipeline for SMS scam classification.
    Uses TF-IDF feature extraction with Random Forest classification.
    """
    def __init__(self):
        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=1500, sublinear_tf=True)),
            ("classifier", RandomForestClassifier(n_estimators=100, random_state=42)),
        ])

    @staticmethod
    def preprocess_text(text: str) -> str:
        if not text:
            return ""
        cleaned = text.lower()
        cleaned = re.sub(r'https?://\S+|www\.\S+', ' url_link ', cleaned)
        cleaned = re.sub(r'\d+', ' num_token ', cleaned)
        cleaned = re.sub(r'[^\w\s]', ' ', cleaned)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned

    def fit(self, X_train: List[str], y_train: List[int]):
        processed_X = [self.preprocess_text(x) for x in X_train]
        self.pipeline.fit(processed_X, y_train)

    def predict(self, X: List[str]) -> List[int]:
        processed_X = [self.preprocess_text(x) for x in X]
        return self.pipeline.predict(processed_X).tolist()

    def predict_proba(self, X: List[str]) -> List[List[float]]:
        processed_X = [self.preprocess_text(x) for x in X]
        return self.pipeline.predict_proba(processed_X).tolist()

    def evaluate(self, X_test: List[str], y_test: List[int]) -> Dict[str, Any]:
        y_pred = self.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred).tolist()

        return {
            "model_name": "SMSScamModel (TF-IDF + RandomForest)",
            "test_samples": len(y_test),
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "confusion_matrix": cm,
            "note": "Evaluation metrics computed on test split of prototype demonstration dataset.",
        }

    def save(self, filepath: str):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self.pipeline, filepath)

    def load(self, filepath: str):
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        self.pipeline = joblib.load(filepath)
