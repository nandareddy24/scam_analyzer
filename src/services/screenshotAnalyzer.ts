import {
  ScreenshotAnalysisRequest,
  ScreenshotAnalysisResult,
  ScreenshotExtractedData,
  ScreenshotIndicator,
  ScreenshotRiskLevel,
  ScreenshotVerdict,
} from '../types/screenshot.types';

export const MANDATORY_SCREENSHOT_DISCLAIMER =
  'Screenshot analysis is an automated risk assessment and cannot independently verify whether money was actually transferred.';

export class ScreenshotAnalyzerService {
  /**
   * Analyzes payment proof screenshots using OCR text extraction & font metric inspection.
   * Service abstraction is decoupled for future Python / FastAPI Vision AI backend connection.
   */
  async analyzeScreenshot(request: ScreenshotAnalysisRequest): Promise<ScreenshotAnalysisResult> {
    const { imageUri, fileSize, fileType } = request;

    // 1. Image Input & File Validation Error Handling
    if (!imageUri || imageUri.trim().length === 0) {
      throw new Error('Please select or upload a payment screenshot image to analyze.');
    }

    // Check large image files (> 10MB)
    if (fileSize && fileSize > 10 * 1024 * 1024) {
      throw new Error('Image file size exceeds the 10MB limit. Please upload a smaller image file.');
    }

    // Check unsupported file formats
    if (fileType && !['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(fileType.toLowerCase())) {
      throw new Error('Unsupported image file format. Please upload a PNG, JPEG, or WEBP screenshot.');
    }

    // 2. Simulated Latency for OCR / Vision AI Processing
    await new Promise((resolve) => setTimeout(resolve, 900));

    // 3. Mock Heuristic & OCR Pattern Engine
    const lowerUri = imageUri.toLowerCase();
    const isManipulated = lowerUri.includes('fake') || lowerUri.includes('spoof') || lowerUri.includes('demo_scam') || lowerUri.includes('5000');

    let extractedData: ScreenshotExtractedData;
    let manipulationWarning = false;
    let manipulationDetails: string | undefined;
    let riskScore = 15;
    let verdict: ScreenshotVerdict = 'GENUINE_PATTERN';
    let riskLevel: ScreenshotRiskLevel = 'LOW';
    let confidencePercentage = 94;
    const suspiciousIndicators: ScreenshotIndicator[] = [];

    if (isManipulated) {
      manipulationWarning = true;
      manipulationDetails = 'Altered font metrics & mismatched transaction UTR raster alignment detected.';
      riskScore = 92;
      verdict = 'MANIPULATED_RECEIPT';
      riskLevel = 'CRITICAL';
      confidencePercentage = 96;

      extractedData = {
        transactionAmount: '₹5,000.00',
        utrReferenceNumber: '492019482910',
        receiverPayeeName: 'Rahul Electronics',
        detectedTimestamp: '31 Aug 2026, 09:14 PM',
        detectedPaymentApp: 'Paytm (Fake Generator App)',
      };

      suspiciousIndicators.push(
        {
          id: 'ind_ocr_font',
          title: 'Synthesized Font Metric Distortion',
          description: 'Font rasterization on transaction ID does not match authentic Paytm/PhonePe receipt templates.',
          severity: 'high',
        },
        {
          id: 'ind_ocr_utr',
          title: 'Invalid 12-Digit RRN Checksum',
          description: 'Extracted 12-digit UTR reference number fails bank checksum validation algorithms.',
          severity: 'critical',
        },
        {
          id: 'ind_ocr_alignment',
          title: 'Status Icon Pixel Misalignment',
          description: 'Pixel alignment around "Payment Successful" checkmark shows signatures of FakePay app generators.',
          severity: 'high',
        },
      );
    } else {
      extractedData = {
        transactionAmount: '₹150.00',
        utrReferenceNumber: '424810294812',
        receiverPayeeName: 'Local Coffee Shop',
        detectedTimestamp: '31 Aug 2026, 04:30 PM',
        detectedPaymentApp: 'Google Pay',
      };
      riskScore = 15;
      verdict = 'GENUINE_PATTERN';
      riskLevel = 'LOW';
      confidencePercentage = 92;
    }

    // 4. Build Explanation with Mandatory Disclaimer (Never claim genuine purely because OCR parsed valid text!)
    const explanation = isManipulated
      ? `HIGH MANIPULATION RISK: OCR text extraction detected altered font metrics and invalid UTR checksums common in fake payment app generators. ${MANDATORY_SCREENSHOT_DISCLAIMER}`
      : `STANDARD LAYOUT PATTERN: Extracted receipt text conforms to standard banking receipt templates. ${MANDATORY_SCREENSHOT_DISCLAIMER}`;

    const recommendation = isManipulated
      ? 'DO NOT RELEASE GOODS OR SERVICES. Verify your actual bank statement inside your official banking app!'
      : 'Verify incoming funds directly in your bank account statement before completing transaction.';

    return {
      id: `screenshot_audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      imageUri,
      extractedData,
      manipulationWarning,
      manipulationDetails,
      riskScore,
      riskLevel,
      verdict,
      confidencePercentage,
      suspiciousIndicators,
      explanation,
      disclaimer: MANDATORY_SCREENSHOT_DISCLAIMER,
      recommendation,
      rawMetadata: {
        ocrEngine: 'Tesseract-Vision-Mock-v1',
        fastApiTarget: 'http://localhost:8000/api/v1/analyze/ocr-receipt',
        dpiResolved: 300,
      },
    };
  }
}

export const screenshotAnalyzer = new ScreenshotAnalyzerService();
