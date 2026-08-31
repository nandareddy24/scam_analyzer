from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.requests import (
    SMSAnalysisRequest,
    UPIAnalysisRequest,
    URLAnalysisRequest,
    ScreenshotAnalysisRequest,
)
from backend.app.schemas.responses import AnalysisResponse, HealthResponse
from backend.app.services.sms_service import SMSService
from backend.app.services.upi_service import UPIService
from backend.app.services.url_service import URLService
from backend.app.services.screenshot_service import ScreenshotService
from backend.app.utils.logger import logger

router = APIRouter(prefix="/api")


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check endpoint",
    description="Returns server status and operational health metadata",
)
async def health_check():
    logger.info("Health check endpoint pinged.")
    return HealthResponse(
        status="ok",
        service="UPI ScamGuard API Backend",
        version="1.0.0",
    )


@router.post(
    "/analyze/sms",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze SMS & WhatsApp content",
    description="Classifies SMS messages for Digital Arrest, UPI PIN traps, KYC scams, and phishing",
)
async def analyze_sms(request: SMSAnalysisRequest):
    try:
        return await SMSService.analyze_sms(request)
    except Exception as e:
        logger.error(f"Error analyzing SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the SMS message: {str(e)}",
        )


@router.post(
    "/analyze/upi",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze UPI VPA handle",
    description="Evaluates syntax format validity and reputational handle risk separately",
)
async def analyze_upi(request: UPIAnalysisRequest):
    try:
        return await UPIService.analyze_upi(request)
    except Exception as e:
        logger.error(f"Error analyzing UPI ID: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the UPI ID: {str(e)}",
        )


@router.post(
    "/analyze/url",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze web link URL",
    description="Inspects web URL domain SSL, shortener redirects, TLD risk, and brand typosquatting",
)
async def analyze_url(request: URLAnalysisRequest):
    try:
        return await URLService.analyze_url(request)
    except Exception as e:
        logger.error(f"Error analyzing URL: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the URL: {str(e)}",
        )


@router.post(
    "/analyze/screenshot",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze payment receipt screenshot",
    description="Extracts OCR text metrics and performs raster font manipulation checks",
)
async def analyze_screenshot(request: ScreenshotAnalysisRequest):
    try:
        return await ScreenshotService.analyze_screenshot(request)
    except Exception as e:
        logger.error(f"Error analyzing payment screenshot: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the payment screenshot: {str(e)}",
        )
