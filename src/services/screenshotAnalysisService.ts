import { apiClient } from '../api/apiClient';
import { ScanResultData, ScreenshotAnalysisPayload } from '../types/scam.types';

export class ScreenshotAnalysisService {
  /**
   * Placeholder service for QR Code & Payment Screenshot OCR Analysis.
   * Ready for integration with Tesseract OCR / Vision AI models.
   */
  async analyzeScreenshot(payload: ScreenshotAnalysisPayload): Promise<ScanResultData> {
    await apiClient.mockPost('/analyze/screenshot', payload);

    // Mock OCR / Vision model placeholder result
    const isMockFake = payload.imageUri.includes('fake') || payload.imageUri.includes('demo_scam');
    const score = isMockFake ? 88 : 15;
    const level = isMockFake ? 'high_risk' : 'safe';

    return {
      id: `scan_img_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'screenshot',
      targetInput: payload.imageUri || 'Image_Scan_Upload.png',
      riskScore: score,
      riskLevel: level,
      verdictTitle: isMockFake ? 'Manipulated Payment Proof / Trap QR' : 'Valid Payment Screenshot Format',
      summary: isMockFake
        ? 'OCR text extraction detected mismatched transaction UTR reference font and altered timestamp alignment common in fake payment app generators.'
        : 'Image matches standard banking receipt font metrics and expected UPI transaction layout.',
      threatFactors: isMockFake
        ? [
            {
              id: 'ocr_font_anomaly',
              name: 'Synthesized Font Metric Distortion',
              severity: 'high',
              description: 'Font rasterization on transaction ID does not match authentic Paytm/PhonePe receipt templates.',
            },
            {
              id: 'ocr_utr_invalid',
              name: 'Invalid UTR Length',
              severity: 'high',
              description: 'Extracted 12-digit RRN fails bank checksum validation.',
            },
          ]
        : [],
      recommendedAction: isMockFake
        ? 'Verify your bank account balance directly in official bank app. Do not release goods based on this screenshot!'
        : 'Double check bank statement notification to confirm actual receipt of funds.',
      rawDetails: {
        ocrExtractedText: 'SUCCESS TXN ID: 492019482910 AMOUNT: Rs 5,000',
        modelEndpoint: '/api/v1/ml/ocr-receipt-analyzer',
      },
    };
  }
}

export const screenshotAnalysisService = new ScreenshotAnalysisService();
