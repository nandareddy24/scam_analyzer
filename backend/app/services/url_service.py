from backend.app.schemas.requests import URLAnalysisRequest
from backend.app.schemas.responses import AnalysisResponse, RedFlag
from backend.app.utils.heuristics import evaluate_url_heuristics
from backend.app.ml.model_loader import model_loader
from backend.app.utils.logger import logger


class URLService:
    @staticmethod
    async def analyze_url(request: URLAnalysisRequest) -> AnalysisResponse:
        logger.info(f"Analyzing Web Link URL: {request.url}")

        heuristic_res = evaluate_url_heuristics(request.url)

        # 2. Run Real ML Inference if loaded
        ml_prob = 0.0
        ml_confidence = None

        if model_loader.url_model:
            try:
                probs = model_loader.url_model.predict_proba([request.url])[0]
                ml_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
                ml_confidence = round(max(probs), 4)
                logger.info(f"URL ML Inference Output: prob={ml_prob:.4f}")
            except Exception as e:
                logger.warning(f"URL ML model inference error: {e}")

        heur_score = heuristic_res["risk_score"]
        ml_score = int(ml_prob * 100) if ml_confidence is not None else heur_score
        
        risk_score = max(heur_score, ml_score) if heuristic_res["category"] != "OFFICIAL_PORTAL" else heur_score
        verdict = "PHISHING_SCAM" if risk_score >= 70 else "SUSPICIOUS" if risk_score >= 35 else "SAFE"
        risk_level = "CRITICAL" if risk_score >= 80 else "HIGH" if risk_score >= 60 else "MEDIUM" if risk_score >= 30 else "LOW"
        category = heuristic_res["category"]
        confidence = ml_confidence if ml_confidence is not None else heuristic_res["confidence"]

        if verdict == "PHISHING_SCAM":
            explanation = "CRITICAL PHISHING WARNING: Link exhibits strong malicious domain indicators, unverified TLDs, or financial brand typosquatting. (Note: Treat URL analysis as a risk assessment rating, not absolute proof of fraud)."
            recommendations = [
                "DO NOT OPEN THIS LINK or submit passwords/OTP on this web page.",
                "Close your browser tab immediately.",
                "Access banking services only by typing the official bank domain directly into your browser.",
            ]
        elif verdict == "SUSPICIOUS":
            explanation = "SUSPICIOUS WEB LINK: Domain uses unencrypted HTTP, shortened redirects, or suspicious subdomains. (Note: Treat URL analysis as a risk assessment rating, not absolute proof of fraud)."
            recommendations = [
                "Avoid entering sensitive financial passwords or credit card numbers.",
                "Check for the HTTPS padlock icon in your browser address bar.",
            ]
        else:
            explanation = "OFFICIAL / SAFE PORTAL: Domain matches verified official banking or government infrastructure. (Note: Treat URL analysis as a risk assessment rating, not absolute proof of fraud)."
            recommendations = [
                "Ensure HTTPS encryption remains active while logged in.",
            ]

        red_flags_list = [RedFlag(**flag) for flag in heuristic_res["red_flags"]]

        return AnalysisResponse(
            verdict=verdict,
            risk_score=risk_score,
            risk_level=risk_level,
            category=category,
            confidence=confidence,
            red_flags=red_flags_list,
            explanation=explanation,
            recommendations=recommendations,
            details={
                "url": request.url,
                "domain": heuristic_res["domain"],
                "has_ssl": heuristic_res["has_ssl"],
                "ml_phishing_probability": round(ml_prob, 4),
            },
        )
