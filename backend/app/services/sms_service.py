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

        # 2. Run ML Model Inference if loaded
        ml_confidence = None
        if model_loader.sms_model:
            try:
                probs = model_loader.sms_model.predict_proba([request.message_text])[0]
                scam_prob = float(probs[1]) if len(probs) > 1 else 0.5
                ml_confidence = round(scam_prob, 2)
                logger.info(f"ML Model Prediction Scam Probability: {ml_confidence}")
            except Exception as e:
                logger.warning(f"ML prediction error: {e}")

        # Combine ML & Heuristic Assessment
        verdict = heuristic_res["verdict"]
        risk_score = heuristic_res["risk_score"]
        risk_level = heuristic_res["risk_level"]
        category = heuristic_res["category"]
        confidence = ml_confidence if ml_confidence is not None else heuristic_res["confidence"]

        if verdict == "SCAM":
            explanation = f"CRITICAL SCAM WARNING: Message content matches known {category} fraud patterns. Do NOT click any links, call listed phone numbers, or enter your UPI PIN."
            recommendations = [
                "DO NOT enter your UPI PIN (PIN is ONLY used to send money, NEVER to receive!).",
                "Do NOT click any web links in this SMS.",
                "Report this SMS to Cyber Helpline 1930 or www.cybercrime.gov.in.",
            ]
        elif verdict == "SUSPICIOUS":
            explanation = "SUSPICIOUS SMS: Message contains high-risk urgency cues or embedded redirects that require caution."
            recommendations = [
                "Verify the sender's identity through official bank apps.",
                "Never share OTPs, passwords, or CVV numbers with anyone.",
            ]
        else:
            explanation = "SAFE / LOW RISK: No malicious fraud signatures or PIN trap patterns detected in this SMS."
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
            details={"input_length": len(request.message_text), "sender_header": request.sender_header},
        )
