# 🧪 UPI ScamGuard Comprehensive Testing Suite

This directory contains the automated testing suite for **UPI ScamGuard**, covering React Native frontend logic, FastAPI REST API endpoints, scikit-learn Machine Learning pipelines, and privacy sanitizers.

---

## 📁 Test Suite Directory Structure

```
tests/
├── __init__.py
├── test_backend_api.py      # FastAPI REST API tests (health, SMS, UPI, URL, screenshot, edge cases)
├── test_ml_models.py        # scikit-learn ML Model tests (predictions, probabilities, metrics integrity)
├── test_frontend_logic.ts   # React Native service logic & privacy sanitizer assertions
└── run_all_tests.py         # Master automated test runner script
```

---

## 🚀 How to Execute All Tests

### Option 1: Execute Complete Master Test Suite
To run all test suites sequentially (Backend APIs, ML Models, TypeScript Type Safety Check):

```bash
python tests/run_all_tests.py
```

### Option 2: Execute PyTest Suite (Backend APIs & ML Models)
To run Python backend endpoints & machine-learning model tests directly via PyTest:

```bash
python -m pytest tests/ -v
```

### Option 3: Execute React Native TypeScript Type Safety Check
To verify complete type safety across all React Native screens and components:

```bash
npm run typecheck
```
*or*
```bash
node node_modules/typescript/bin/tsc --noEmit
```

---

## 📊 Test Coverage Breakdown

| Test Suite Module | Scope Covered | Execution Result |
|---|---|---|
| `test_backend_api.py::test_health_endpoint` | GET `/api/health` status check | ✅ PASSED |
| `test_backend_api.py::test_analyze_sms_*` | SMS scam/safe text classification | ✅ PASSED |
| `test_backend_api.py::test_analyze_upi_*` | UPI VPA handle reputation check | ✅ PASSED |
| `test_backend_api.py::test_analyze_url_*` | URL phishing domain check | ✅ PASSED |
| `test_backend_api.py::test_analyze_screenshot_*` | Payment receipt OCR check | ✅ PASSED |
| `test_backend_api.py::test_*_invalid/oversized` | 422 input validation bounds | ✅ PASSED |
| `test_ml_models.py::test_sms_model_*` | `SMSScamModel` predictions & `sms_metrics.json` | ✅ PASSED |
| `test_ml_models.py::test_upi_model_*` | `UPIScamModel` predictions & `upi_metrics.json` | ✅ PASSED |
| `test_ml_models.py::test_url_model_*` | `URLPhishingModel` predictions & `url_metrics.json` | ✅ PASSED |
| `test_frontend_logic.ts` | Privacy regex sanitization & service layers | ✅ PASSED |
