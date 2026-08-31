import os
import re
import joblib
from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix


class UPIScamModel:
    """
    Independent scikit-learn Machine Learning pipeline for UPI VPA handle detection.
    Uses sub-word character n-gram TF-IDF vectorization with Random Forest classification.
    """
    def __init__(self):
        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4), min_df=1)),
            ("classifier", RandomForestClassifier(n_estimators=100, random_state=42)),
        ])

    @staticmethod
    def preprocess_vpa(vpa: str) -> str:
        if not vpa:
            return ""
        cleaned = vpa.lower().strip()
        cleaned = re.sub(r'\s+', '', cleaned)
        return cleaned

    def fit(self, X_train: List[str], y_train: List[int]):
        processed_X = [self.preprocess_vpa(x) for x in X_train]
        self.pipeline.fit(processed_X, y_train)

    def predict(self, X: List[str]) -> List[int]:
        processed_X = [self.preprocess_vpa(x) for x in X]
        return self.pipeline.predict(processed_X).tolist()

    def predict_proba(self, X: List[str]) -> List[List[float]]:
        processed_X = [self.preprocess_vpa(x) for x in X]
        return self.pipeline.predict_proba(processed_X).tolist()

    def evaluate(self, X_test: List[str], y_test: List[int]) -> Dict[str, Any]:
        y_pred = self.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred).tolist()

        return {
            "model_name": "UPIScamModel (Char TF-IDF + RandomForest)",
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
