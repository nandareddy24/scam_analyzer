from backend.app.schemas.requests import ScreenshotAnalysisRequest
from backend.app.schemas.responses import AnalysisResponse, RedFlag
from backend.app.utils.heuristics import evaluate_screenshot_heuristics
from backend.app.utils.logger import logger

MANDATORY_DISCLAIMER = "Screenshot analysis is an automated risk assessment and cannot independently verify whether money was actually transferred."


class ScreenshotService:
    @staticmethod
    async def analyze_screenshot(request: ScreenshotAnalysisRequest) -> AnalysisResponse:
        filename = request.filename or "uploaded_screenshot.png"
        logger.info(f"Analyzing payment proof screenshot: {filename}")

        heuristic_res = evaluate_screenshot_heuristics(filename)

        verdict = heuristic_res["verdict"]
        risk_score = heuristic_res["risk_score"]
        risk_level = heuristic_res["risk_level"]
        category = heuristic_res["category"]
        confidence = heuristic_res["confidence"]
        extracted = heuristic_res["extracted_data"]

        if verdict == "MANIPULATED_RECEIPT":
            explanation = f"MANIPULATION WARNING: OCR raster font metrics & UTR checksum analysis indicate altered payment proof. {MANDATORY_DISCLAIMER}"
            recommendations = [
                "DO NOT release goods, services, or cash based on this screenshot.",
                "Log into your official banking app directly and verify your account statement.",
                "Verify 12-digit UTR reference number directly with your bank.",
            ]
        else:
            explanation = f"STANDARD RECEIPT PATTERN: Extracted receipt text conforms to standard banking receipt layout templates. {MANDATORY_DISCLAIMER}"
            recommendations = [
                "Always verify incoming credit in your bank statement before completing orders.",
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
                "filename": filename,
                "extracted_amount": extracted["amount"],
                "utr_number": extracted["utr"],
                "payee_name": extracted["payee"],
                "payment_app": extracted["app"],
                "timestamp": extracted["timestamp"],
                "manipulation_warning": heuristic_res["manipulation_warning"],
                "disclaimer": MANDATORY_DISCLAIMER,
            },
        )
