from backend.app.schemas.requests import SMSAnalysisRequest
from backend.app.schemas.responses import AnalysisResponse, RedFlag
from backend.app.utils.heuristics import evaluate_sms_heuristics
from backend.app.ml.model_loader import model_loader
from backend.app.utils.logger import logger


class SMSService:
    @staticmethod
    async def analyze_sms(request: SMSAnalysisRequest) -> AnalysisResponse:
        logger.info(f"Analyzing SMS message input (length: {len(request.message_text)})")
        
        # 1. Run Heuristic Rules Engine
        heuristic_res = evaluate_sms_heuristics(request.message_text)

        # 2. Run Real ML Inference if model loaded
        ml_verdict = None
        ml_confidence = None
        ml_prob = 0.0

        if model_loader.sms_model:
            try:
                probs = model_loader.sms_model.predict_proba([request.message_text])[0]
                ml_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
                ml_confidence = round(max(probs), 4)
                ml_verdict = "SCAM" if ml_prob >= 0.5 else "SAFE"
                logger.info(f"SMS ML Inference Output: prob={ml_prob:.4f}, verdict={ml_verdict}")
            except Exception as e:
                logger.warning(f"SMS ML model inference error: {e}")

        # Combine ML & Heuristics
        heur_score = heuristic_res["risk_score"]
        ml_score = int(ml_prob * 100) if ml_confidence is not None else heur_score
        
        risk_score = max(heur_score, ml_score)
        verdict = "SCAM" if risk_score >= 70 else "SUSPICIOUS" if risk_score >= 40 else "SAFE"
        risk_level = "CRITICAL" if risk_score >= 85 else "HIGH" if risk_score >= 65 else "MEDIUM" if risk_score >= 35 else "LOW"
        category = heuristic_res["category"]
        confidence = ml_confidence if ml_confidence is not None else heuristic_res["confidence"]

        if verdict == "SCAM":
            explanation = f"CRITICAL SCAM WARNING: ML model & heuristic rules detected {category} fraud patterns (ML confidence: {confidence*100:.1f}%)."
            recommendations = [
                "DO NOT enter your UPI PIN (PIN is ONLY used to send money, NEVER to receive!).",
                "Do NOT click any web links in this SMS.",
                "Report this SMS to Cyber Helpline 1930 or www.cybercrime.gov.in.",
            ]
        elif verdict == "SUSPICIOUS":
            explanation = f"SUSPICIOUS SMS: Message contains high-risk urgency cues or embedded redirects requiring caution (ML risk score: {risk_score}/100)."
            recommendations = [
                "Verify sender identity through official banking apps.",
                "Never share OTPs, passwords, or CVV numbers with anyone.",
            ]
        else:
            explanation = f"SAFE / LOW RISK: No malicious fraud signatures or PIN trap patterns detected (ML confidence: {confidence*100:.1f}%)."
            recommendations = [
                "Always remain vigilant when receiving unsolicited SMS messages.",
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
                "input_length": len(request.message_text),
                "ml_scam_probability": round(ml_prob, 4),
                "sender_header": request.sender_header,
            },
        )
