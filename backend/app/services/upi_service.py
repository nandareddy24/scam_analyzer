from backend.app.schemas.requests import UPIAnalysisRequest
from backend.app.schemas.responses import AnalysisResponse, RedFlag
from backend.app.utils.heuristics import evaluate_upi_heuristics
from backend.app.ml.model_loader import model_loader
from backend.app.utils.logger import logger


class UPIService:
    @staticmethod
    async def analyze_upi(request: UPIAnalysisRequest) -> AnalysisResponse:
        logger.info(f"Analyzing UPI VPA handle: {request.upi_id}")

        # 1. Run Heuristic Rules Engine (Strictly separating syntax validation from risk assessment)
        heuristic_res = evaluate_upi_heuristics(request.upi_id)

        # 2. Run ML Model Inference if available
        ml_confidence = None
        if model_loader.upi_model:
            try:
                probs = model_loader.upi_model.predict_proba([request.upi_id])[0]
                scam_prob = float(probs[1]) if len(probs) > 1 else 0.5
                ml_confidence = round(scam_prob, 2)
            except Exception as e:
                logger.warning(f"UPI ML prediction error: {e}")

        verdict = heuristic_res["verdict"]
        risk_score = heuristic_res["risk_score"]
        risk_level = heuristic_res["risk_level"]
        category = heuristic_res["category"]
        confidence = ml_confidence if ml_confidence is not None else heuristic_res["confidence"]
        is_format_valid = heuristic_res["format_valid"]
        format_msg = heuristic_res["format_msg"]

        if verdict == "SCAM":
            explanation = f"HIGH REPUTATIONAL RISK: VPA '{request.upi_id}' contains impersonation terms or high-risk handle patterns. {format_msg} (Note: Format validity does not imply trust!)."
            recommendations = [
                "DO NOT send money or accept collect requests from this VPA.",
                "Verify the recipient's identity through direct official channels before paying.",
                "Report suspicious VPAs to your UPI app support (Paytm/GPay/PhonePe).",
            ]
        elif verdict == "SUSPICIOUS":
            explanation = f"SUSPICIOUS UPI VPA: {format_msg} Handle uses unverified keywords or raw phone number formatting requiring caution."
            recommendations = [
                "Verify the registered account holder name shown on your UPI app screen.",
                "Ensure you are transferring to a trusted merchant or person.",
            ]
        else:
            explanation = f"SAFE / VERIFIED PATTERN: {format_msg} No high-risk VPA impersonation signatures detected."
            recommendations = [
                "Always check the verified receiver name on your UPI app payment screen before approving.",
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
                "upi_id": request.upi_id,
                "is_format_valid": is_format_valid,
                "format_validation_message": format_msg,
            },
        )
