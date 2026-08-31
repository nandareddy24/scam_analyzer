import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

# Ensure backend root is in sys.path for clean imports
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from backend.app.api.endpoints import router as api_router
from backend.app.utils.logger import logger
from backend.app.ml.train_models import train_and_save_ml_models


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup & shutdown lifespan context manager.
    Ensures ML models are trained and ready before accepting requests.
    """
    logger.info("Initializing UPI ScamGuard FastAPI Application Backend...")
    models_dir = os.path.join(backend_root, "models")
    sms_model_file = os.path.join(models_dir, "sms_scam_model.joblib")

    if not os.path.exists(sms_model_file):
        logger.info("ML Models not detected in backend/models. Running automated training pipeline...")
        try:
            train_and_save_ml_models()
        except Exception as e:
            logger.error(f"Failed to auto-train ML models on startup: {e}")

    logger.info("UPI ScamGuard Backend is ready to serve requests.")
    yield
    logger.info("Shutting down UPI ScamGuard Backend application...")


app = FastAPI(
    title="UPI ScamGuard API Backend",
    description="AI & Machine Learning Powered REST API Service for UPI Fraud, Phishing & Fake Receipt Detection",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Input Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Request validation error for {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
            "message": "Invalid payload parameters provided.",
        },
    )


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception at {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your request.",
        },
    )


# Include API Endpoints Router
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
