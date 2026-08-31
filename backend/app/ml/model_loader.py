import os
import joblib
from typing import Optional, Any
from backend.app.utils.logger import logger


class ModelLoader:
    """
    Loads joblib ML models dynamically at startup with graceful fallback to heuristic engines.
    """
    def __init__(self):
        self.sms_model: Optional[Any] = None
        self.upi_model: Optional[Any] = None
        self._load_all_models()

    def _load_all_models(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models"))
        
        sms_path = os.path.join(base_dir, "sms_scam_model.joblib")
        upi_path = os.path.join(base_dir, "upi_scam_model.joblib")

        if os.path.exists(sms_path):
            try:
                self.sms_model = joblib.load(sms_path)
                logger.info(f"Successfully loaded SMS ML model from {sms_path}")
            except Exception as e:
                logger.warning(f"Could not load SMS ML model: {e}")
        else:
            logger.info("SMS joblib model not found. Will train on demand or use heuristics.")

        if os.path.exists(upi_path):
            try:
                self.upi_model = joblib.load(upi_path)
                logger.info(f"Successfully loaded UPI VPA ML model from {upi_path}")
            except Exception as e:
                logger.warning(f"Could not load UPI ML model: {e}")
        else:
            logger.info("UPI joblib model not found. Will train on demand or use heuristics.")


model_loader = ModelLoader()
