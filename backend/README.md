# UPI ScamGuard - FastAPI & Machine Learning Backend

AI-powered backend service for **UPI ScamGuard**, delivering real-time fraud detection APIs for SMS messages, UPI handles, phishing web URLs, and payment screenshot proofs.

---

## 🛠️ Stack & Architecture

- **Framework**: FastAPI (Python 3.12)
- **Validation**: Pydantic v2
- **Machine Learning**: scikit-learn (TF-IDF + Random Forest Classifier), pandas, joblib
- **Server**: Uvicorn (ASGI)
- **CORS**: Configured for cross-origin mobile client integration

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── main.py                     # FastAPI application entrypoint with CORS & logging
│   ├── api/
│   │   ├── __init__.py
│   │   └── endpoints.py            # REST API routes (/api/health, /api/analyze/*)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── sms_service.py          # SMS classification & NLP analysis service
│   │   ├── upi_service.py          # UPI VPA syntax validation & risk assessment service
│   │   ├── url_service.py          # URL phishing & typosquatting analysis service
│   │   └── screenshot_service.py   # OCR font metric & proof verification service
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── requests.py             # Pydantic input schemas
│   │   └── responses.py            # Pydantic output response schemas
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── model_loader.py         # Joblib model loader & fallback manager
│   │   └── train_models.py         # Model training script for scikit-learn classifiers
│   └── utils/
│       ├── __init__.py
│       ├── logger.py               # Structured logging utility
│       └── heuristics.py           # Pattern rules engine
├── models/                         # Serialized joblib ML models
├── datasets/                       # Datasets for model training
├── requirements.txt
└── README.md
```

---

## 🚀 Setup & Execution Guide

### 1. Create & Activate Virtual Environment
```bash
cd backend
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Linux / macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Train ML Models
Train the scikit-learn classifiers and save the joblib models to `backend/models/`:
```bash
python -m app.ml.train_models
```

### 4. Start Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API Documentation will be available at:
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 API Endpoints Summary

- `GET /api/health`: Health status check
- `POST /api/analyze/sms`: Analyze SMS & WhatsApp text for scam indicators
- `POST /api/analyze/upi`: Analyze UPI VPA handles (format vs risk)
- `POST /api/analyze/url`: Analyze web URLs for phishing & typosquatting
- `POST /api/analyze/screenshot`: Analyze payment screenshots for OCR & font metrics
