import os
from typing import Optional
from backend.app.ml.sms_model import SMSScamModel
from backend.app.ml.upi_model import UPIScamModel
from backend.app.ml.url_model import URLPhishingModel
from backend.app.utils.logger import logger


class ModelLoader:
    """
    Loads trained scikit-learn ML models dynamically for SMS, UPI VPA, and URL Phishing inference.
    """
    def __init__(self):
        self.sms_model: Optional[SMSScamModel] = None
        self.upi_model: Optional[UPIScamModel] = None
        self.url_model: Optional[URLPhishingModel] = None
        self.reload_models()

    def reload_models(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models"))
        
        sms_path = os.path.join(base_dir, "sms_model.joblib")
        upi_path = os.path.join(base_dir, "upi_model.joblib")
        url_path = os.path.join(base_dir, "url_model.joblib")

        # 1. Load SMS Model
        if os.path.exists(sms_path):
            try:
                sms_inst = SMSScamModel()
                sms_inst.load(sms_path)
                self.sms_model = sms_inst
                logger.info(f"Loaded SMS ML Model pipeline from {sms_path}")
            except Exception as e:
                logger.warning(f"Error loading SMS ML model: {e}")
        else:
            logger.info("SMS joblib model file not found.")

        # 2. Load UPI VPA Model
        if os.path.exists(upi_path):
            try:
                upi_inst = UPIScamModel()
                upi_inst.load(upi_path)
                self.upi_model = upi_inst
                logger.info(f"Loaded UPI VPA ML Model pipeline from {upi_path}")
            except Exception as e:
                logger.warning(f"Error loading UPI ML model: {e}")
        else:
            logger.info("UPI joblib model file not found.")

        # 3. Load URL Model
        if os.path.exists(url_path):
            try:
                url_inst = URLPhishingModel()
                url_inst.load(url_path)
                self.url_model = url_inst
                logger.info(f"Loaded URL Phishing ML Model pipeline from {url_path}")
            except Exception as e:
                logger.warning(f"Error loading URL ML model: {e}")
        else:
            logger.info("URL joblib model file not found.")


model_loader = ModelLoader()
