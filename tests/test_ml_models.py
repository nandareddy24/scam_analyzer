import pytest
import os
import sys
import json

# Ensure project root is in sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.app.ml.sms_model import SMSScamModel
from backend.app.ml.upi_model import UPIScamModel
from backend.app.ml.url_model import URLPhishingModel


def test_sms_model_prediction():
    """Test SMS scikit-learn ML model prediction and probability scoring."""
    model = SMSScamModel()

    # Predict scam sample probability
    scam_proba = model.predict_proba(["URGENT: SBI reward points expire today. Redeem at http://sbi-reward.top"])[0][1]
    assert isinstance(scam_proba, float)
    assert 0.0 <= scam_proba <= 1.0

    # Predict safe sample probability
    safe_proba = model.predict_proba(["Hello, your order from Zomato will be delivered in 15 minutes."])[0][1]
    assert isinstance(safe_proba, float)
    assert 0.0 <= safe_proba <= 1.0


def test_sms_model_metrics_json_integrity():
    """Verify saved SMS model evaluation metrics JSON file exists and contains real metrics."""
    metrics_path = os.path.join(project_root, "backend", "models", "sms_metrics.json")
    assert os.path.exists(metrics_path), "sms_metrics.json must exist"

    with open(metrics_path, "r") as f:
        metrics = json.load(f)

    assert "accuracy" in metrics
    assert "precision" in metrics
    assert "recall" in metrics
    assert "f1_score" in metrics
    assert "confusion_matrix" in metrics
    assert isinstance(metrics["accuracy"], float)


def test_upi_model_prediction():
    """Test UPI VPA handle ML model prediction."""
    model = UPIScamModel()

    # Predict suspicious refund handle probability
    scam_proba = model.predict_proba(["paytm-refund-desk@okaxis"])[0][1]
    assert isinstance(scam_proba, float)
    assert 0.0 <= scam_proba <= 1.0

    # Predict legitimate handle probability
    legit_proba = model.predict_proba(["merchant.zomato@icici"])[0][1]
    assert isinstance(legit_proba, float)
    assert 0.0 <= legit_proba <= 1.0


def test_upi_model_metrics_json_integrity():
    """Verify saved UPI model evaluation metrics JSON file exists and contains valid metrics."""
    metrics_path = os.path.join(project_root, "backend", "models", "upi_metrics.json")
    assert os.path.exists(metrics_path), "upi_metrics.json must exist"

    with open(metrics_path, "r") as f:
        metrics = json.load(f)

    assert "accuracy" in metrics
    assert "f1_score" in metrics


def test_url_model_prediction():
    """Test URL phishing ML model prediction."""
    model = URLPhishingModel()

    # Predict phishing link probability
    phish_proba = model.predict_proba(["http://sbi-reward-points.top/claim"])[0][1]
    assert isinstance(phish_proba, float)
    assert 0.0 <= phish_proba <= 1.0

    # Predict legitimate link probability
    legit_proba = model.predict_proba(["https://cybercrime.gov.in"])[0][1]
    assert isinstance(legit_proba, float)
    assert 0.0 <= legit_proba <= 1.0


def test_url_model_metrics_json_integrity():
    """Verify saved URL model evaluation metrics JSON file exists and contains real metrics."""
    metrics_path = os.path.join(project_root, "backend", "models", "url_metrics.json")
    assert os.path.exists(metrics_path), "url_metrics.json must exist"

    with open(metrics_path, "r") as f:
        metrics = json.load(f)

    assert "accuracy" in metrics
    assert "precision" in metrics
    assert "recall" in metrics
    assert "f1_score" in metrics
