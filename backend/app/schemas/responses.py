from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class RedFlag(BaseModel):
    id: str = Field(..., description="Unique indicator identifier")
    title: str = Field(..., description="Short name of red flag")
    description: str = Field(..., description="Detailed description of anomaly")
    severity: str = Field(..., description="Severity level: low, medium, high, critical")


class AnalysisResponse(BaseModel):
    verdict: str = Field(..., description="Overall verdict: SAFE, SUSPICIOUS, SCAM, PHISHING_SCAM")
    risk_score: int = Field(..., description="Calculated risk score from 0 to 100", ge=0, le=100)
    risk_level: str = Field(..., description="Risk severity level: LOW, MEDIUM, HIGH, CRITICAL")
    category: str = Field(..., description="Classification category (e.g. KYC_SCAM, DIGITAL_ARREST, VPA_IMPERSONATION)")
    confidence: float = Field(..., description="Model confidence probability between 0.0 and 1.0", ge=0.0, le=1.0)
    red_flags: List[RedFlag] = Field(default_factory=list, description="List of detected threat factors")
    explanation: str = Field(..., description="Detailed AI explanation for the assessment")
    recommendations: List[str] = Field(default_factory=list, description="Recommended safety actions for user")
    details: Optional[Dict[str, Any]] = Field(None, description="Optional category-specific extracted metadata")


class HealthResponse(BaseModel):
    status: str = Field("ok", description="Server health status")
    service: str = Field("UPI ScamGuard API", description="Service title")
    version: str = Field("1.0.0", description="API version")
