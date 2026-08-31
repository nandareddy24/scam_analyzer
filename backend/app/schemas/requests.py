from pydantic import BaseModel, Field
from typing import Optional


class SMSAnalysisRequest(BaseModel):
    message_text: str = Field(
        ...,
        description="Raw SMS or WhatsApp message text to analyze",
        min_length=5,
        max_length=1000,
        examples=["URGENT: SBI reward points expire today. Redeem at http://sbi-reward.top"],
    )
    sender_header: Optional[str] = Field(
        None,
        description="SMS sender ID header (e.g. AD-SBIBNK)",
        max_length=20,
    )


class UPIAnalysisRequest(BaseModel):
    upi_id: str = Field(
        ...,
        description="Target UPI VPA handle (e.g. paytm-refund-desk@okaxis)",
        min_length=3,
        max_length=100,
        examples=["paytm-refund-desk@okaxis"],
    )


class URLAnalysisRequest(BaseModel):
    url: str = Field(
        ...,
        description="Web URL / link to analyze for phishing threats",
        min_length=4,
        max_length=2048,
        examples=["http://sbi-reward-points.top/claim"],
    )


class ScreenshotAnalysisRequest(BaseModel):
    image_base64: Optional[str] = Field(
        None,
        description="Base64 encoded string of payment receipt screenshot",
        max_length=15000000, # Approx 10MB binary limit
    )
    filename: Optional[str] = Field(
        None,
        description="Original screenshot filename (e.g. paytm_receipt_5000.png)",
        max_length=255,
        examples=["fake_paytm_txn_receipt_5000.png"],
    )

