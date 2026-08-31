import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ensure project root is in sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify GET /api/health returns HTTP 200 OK and healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "service" in data


def test_analyze_sms_scam():
    """Verify POST /api/analyze/sms correctly flags Digital Arrest / PIN lure SMS."""
    payload = {
        "message_text": "URGENT: SBI account blocked within 24 hours due to pending KYC. Update at http://sbi-kyc.top",
        "sender_header": "AD-SBIBNK"
    }
    response = client.post("/api/analyze/sms", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] in ["SCAM", "CRITICAL", "SUSPICIOUS"]
    assert data["risk_score"] >= 50
    assert "red_flags" in data
    assert "recommendations" in data


def test_analyze_sms_safe():
    """Verify POST /api/analyze/sms handles normal non-scam SMS."""
    payload = {
        "message_text": "Hi Mom, please remember to buy milk and bread on your way home today. Thanks!",
    }
    response = client.post("/api/analyze/sms", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "verdict" in data
    assert "risk_score" in data


def test_analyze_sms_invalid_short_input():
    """Verify POST /api/analyze/sms rejects message text under 5 characters."""
    payload = {"message_text": "Hi"}
    response = client.post("/api/analyze/sms", json=payload)
    assert response.status_code == 422


def test_analyze_sms_oversized_input():
    """Verify POST /api/analyze/sms rejects message text over 1000 characters."""
    payload = {"message_text": "A" * 1050}
    response = client.post("/api/analyze/sms", json=payload)
    assert response.status_code == 422


def test_analyze_upi_suspicious():
    """Verify POST /api/analyze/upi identifies suspicious refund VPA handles."""
    payload = {"upi_id": "paytm-refund-desk@okaxis"}
    response = client.post("/api/analyze/upi", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] in ["SCAM", "SUSPICIOUS"]
    assert data["risk_score"] >= 50
    assert "red_flags" in data


def test_analyze_upi_invalid_format():
    """Verify POST /api/analyze/upi handles malformed VPA format gracefully."""
    payload = {"upi_id": "invalid-vpa-without-at-symbol"}
    response = client.post("/api/analyze/upi", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "SUSPICIOUS"


def test_analyze_url_phishing():
    """Verify POST /api/analyze/url detects unencrypted HTTP & high risk TLD (.top)."""
    payload = {"url": "http://sbi-reward-points.top/claim"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] in ["SCAM", "CRITICAL", "PHISHING_SCAM"]
    assert data["risk_score"] >= 70
    assert "red_flags" in data


def test_analyze_url_legitimate():
    """Verify POST /api/analyze/url evaluates official HTTPS portal as safe/low risk."""
    payload = {"url": "https://cybercrime.gov.in"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] in ["SAFE", "SUSPICIOUS", "LEGITIMATE"]


def test_analyze_url_invalid_short():
    """Verify POST /api/analyze/url rejects input shorter than 4 characters."""
    payload = {"url": "htt"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 422


def test_analyze_screenshot_fake():
    """Verify POST /api/analyze/screenshot identifies manipulated Paytm proof."""
    payload = {"filename": "fake_paytm_txn_receipt_5000.png"}
    response = client.post("/api/analyze/screenshot", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] in ["SCAM", "CRITICAL", "MANIPULATED_RECEIPT"]
    assert data["risk_score"] >= 80


def test_malformed_json_request():
    """Verify sending malformed non-JSON body returns HTTP 422 validation error."""
    response = client.post(
        "/api/analyze/sms",
        content="Malformed Non JSON String Payload",
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 422
