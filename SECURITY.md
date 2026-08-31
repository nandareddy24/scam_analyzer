# 🛡️ Security & Privacy Architecture – UPI ScamGuard

This document outlines the security controls, privacy architecture, threat model, and data handling practices implemented across the **UPI ScamGuard** mobile application (React Native / Expo) and machine-learning backend (Python / FastAPI).

---

## 📌 Executive Security & Privacy Summary

- 🔒 **Zero Spyware / Zero Background Surveillance**: UPI ScamGuard does **NOT** run background SMS listeners, track location, read user contact books, or collect personal messages without explicit user action.
- 🔑 **Credential Non-Storage Guarantee**: UPI PINs, OTPs, passwords, CVVs, and credit card numbers are **NEVER** stored, transmitted, or logged.
- 🌐 **Safe Threat Assessment**: Submitted web links (URLs) are statically parsed and evaluated for threat signals; the application **never automatically navigates** to or executes JavaScript on submitted links.
- 📑 **Honest Integrity Notice**: The application does **not** pretend to automatically lodge police complaints. All reporting is directed exclusively to official Indian Government channels (Cyber Helpline **1930** and **cybercrime.gov.in**).

---

## 🎯 Threat Model

| Asset | Threat Actor | Potential Risk | Mitigation / Control |
|---|---|---|---|
| **User Payment Credentials** | Phishing attackers / Malicious apps | Theft of UPI PIN, OTP, or CVV | Automatic regex scrubbing in `scanHistoryStorage` before any local write. |
| **Mobile Scan History** | Physical device access | Inspection of sensitive messages | Storage sanitization in `AsyncStorage` (max 60-char preview, credentials redacted). |
| **FastAPI Backend Services** | Remote cybercriminals | Denial of Service / Payload Injection | Pydantic length validation (`min_length`, `max_length`), CORS restrictions, global error handlers. |
| **Payment Screenshots** | Fraudulent buyers | Tampered proof of payment | OCR raster analysis & font distortion heuristics with mandatory verification disclaimers. |

---

## 🔒 Comprehensive Security Controls Audit

### 1. Hardcoded Secrets & API Keys
- ✅ **Audit Verdict**: Clean.
- **Control**: No secret keys, database passwords, or private API tokens are embedded inside the React Native bundle or Python repository.
- **Configuration**: Base URLs are dynamically resolved per platform (`src/api/config.ts`).

### 2. Android Permissions & Privacy Controls
- ✅ **Audit Verdict**: Minimum Necessary Permissions.
- **Control**: `app.json` requests zero dangerous Android permissions (`READ_SMS`, `RECEIVE_SMS`, `ACCESS_FINE_LOCATION`, or `READ_CONTACTS` are excluded).
- **Gallery Access**: Image selection for payment screenshot analysis uses standard Expo ImagePicker driven strictly by user interaction.

### 3. Insecure Local Storage & Privacy Scrubbing
- ✅ **Audit Verdict**: Sanitized Local Storage (`src/storage/scanHistory.ts`).
- **Control**: Before any scan result is written to `@react-native-async-storage/async-storage`, the `sanitizeInputSummary()` function executes:
  - Redacts 16-digit card numbers (`\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b` -> `[CARD REDACTED]`).
  - Redacts OTP / PIN triggers (`(otp|pin|password|cvv)\s*:\s*\d{4,6}` -> `[REDACTED]`).
  - Truncates message content preview to 60 characters max.

### 4. Unsafe URL Handling
- ✅ **Audit Verdict**: Safe Static Inspection (`src/services/urlAnalyzer.ts`).
- **Control**: Submitted links are inspected strictly via URL syntax parsers (inspecting SSL protocol, domain TLD, subdomains, and typosquatting keywords). The app **never** renders submitted URLs in an embedded WebView or automated browser.

### 5. Input Validation & Injection Vulnerabilities
- ✅ **Audit Verdict**: Strict Pydantic Schema Bounds (`backend/app/schemas/requests.py`).
- **Control**:
  - `SMSAnalysisRequest`: `min_length=5`, `max_length=1000`.
  - `UPIAnalysisRequest`: `min_length=3`, `max_length=100`.
  - `URLAnalysisRequest`: `min_length=4`, `max_length=2048`.
  - `ScreenshotAnalysisRequest`: Base64 payload capped at `max_length=15000000` (~10MB limit).

### 6. CORS & Backend Network Security
- ✅ **Audit Verdict**: Managed Middleware (`backend/app/main.py`).
- **Development**: `CORSMiddleware` configured with `allow_origins=["*"]` to enable local mobile emulator testing (`10.0.2.2:8000` / `localhost:8000`).
- **Production Guidance**: For production deployment, update `allow_origins` to restrict specific domain origins and deploy behind an NGINX reverse proxy with TLS 1.3 encryption.

### 7. Information Leakage in Log Messages & Error Handlers
- ✅ **Audit Verdict**: Shielded Global Exception Handlers (`backend/app/main.py`).
- **Control**:
  - Unhandled server exceptions return generic HTTP 500 JSON responses without exposing raw Python stack traces or internal server file paths.
  - Pydantic validation errors return structured HTTP 422 JSON errors.
  - Python logger (`backend/app/utils/logger.py`) outputs structured logs without logging user credentials or raw PII message text.

### 8. Rate Limiting & Denial of Service Protection
- ✅ **Audit Verdict**: Timeout Protection & Proxy Rate Limiting Recommendation.
- **Client Side**: Mobile `fetch` client uses a 15-second `AbortController` timeout (`src/api/client.ts`) to prevent hanging requests.
- **Production Recommendation**: Deploy FastAPI behind SlowAPI or NGINX `limit_req_zone` (e.g. 10 requests/minute per IP).

---

## ⚠️ Known Limitations & AI Disclaimers

1. **AI-Assisted Assessment**: Risk scores (0–100) and threat levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) are probability estimates produced by scikit-learn models and heuristic rule engines. They do not constitute legal or financial proof of fraud.
2. **UPI VPA Format vs. Reputation**: Valid UPI format syntax (e.g., `merchant@okaxis`) does not guarantee that a recipient is trustworthy. Users must independently verify recipient names inside their official UPI banking application before entering a PIN.
3. **Screenshot Analysis**: OCR extraction and raster font metric analysis evaluate visual authenticity signs, but cannot independently verify whether funds were transferred in the banking network.

---

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability within this project, please report it to the project maintainers via the GitHub repository issues tab at [https://github.com/nandareddy24/scam_analyzer](https://github.com/nandareddy24/scam_analyzer).
