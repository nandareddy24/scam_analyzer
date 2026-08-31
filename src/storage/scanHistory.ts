import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScamCategory } from '../types/scam.types';

const HISTORY_STORAGE_KEY = '@upiscamguard_scan_history_v1';
const MAX_HISTORY_ITEMS = 50;

export interface StorageRedFlag {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ScanHistoryItem {
  id: string;
  type: ScamCategory;
  inputSummary: string; // Privacy sanitized summary
  verdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'CRITICAL';
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  confidencePercentage: number;
  timestamp: string; // ISO date string
  explanation: string;
  recommendations: string[];
  redFlags: StorageRedFlag[];
  extractedMetrics?: Record<string, any>;
}

/**
 * Privacy Sanitizer: Scrubs sensitive credentials (OTP, UPI PIN, CVV, Card numbers)
 * and truncates text to prevent storing private message content.
 */
export const sanitizeInputSummary = (input: string): string => {
  if (!input) return '';
  
  let cleaned = input.trim();

  // 1. Scrub 16-digit card numbers
  cleaned = cleaned.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[CARD REDACTED]');

  // 2. Scrub OTP / PIN triggers
  cleaned = cleaned.replace(/\b(otp|pin|password|cvv|code)\s*[:=]?\s*\d{4,6}\b/gi, '$1: [REDACTED]');

  // 3. Truncate long SMS/URL inputs to 60 characters max
  if (cleaned.length > 60) {
    cleaned = cleaned.substring(0, 57) + '...';
  }

  return cleaned;
};

export const scanHistoryStorage = {
  /**
   * Retrieves all saved scan history items from AsyncStorage (newest first).
   */
  getHistory: async (): Promise<ScanHistoryItem[]> => {
    try {
      const rawJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (!rawJson) return getSeedHistoryItems();
      const parsed: ScanHistoryItem[] = JSON.parse(rawJson);
      return parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.warn('Failed to load scan history from AsyncStorage:', error);
      return getSeedHistoryItems();
    }
  },

  /**
   * Saves a new scan entry with privacy sanitization.
   */
  addScan: async (newItemData: Omit<ScanHistoryItem, 'id' | 'timestamp'>): Promise<ScanHistoryItem> => {
    try {
      const history = await scanHistoryStorage.getHistory();

      const newItem: ScanHistoryItem = {
        ...newItemData,
        id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        inputSummary: sanitizeInputSummary(newItemData.inputSummary),
        timestamp: new Date().toISOString(),
      };

      // Prepend newest item & limit total history length
      const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      return newItem;
    } catch (error) {
      console.warn('Failed to save scan item to AsyncStorage:', error);
      throw error;
    }
  },

  /**
   * Deletes a single scan entry by ID.
   */
  deleteScan: async (id: string): Promise<void> => {
    try {
      const history = await scanHistoryStorage.getHistory();
      const filtered = history.filter((item) => item.id !== id);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.warn('Failed to delete scan item from AsyncStorage:', error);
      throw error;
    }
  },

  /**
   * Clears all scan history.
   */
  clearHistory: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear scan history from AsyncStorage:', error);
      throw error;
    }
  },
};

/**
 * Initial seed history items for demonstration / prototype view.
 */
function getSeedHistoryItems(): ScanHistoryItem[] {
  return [
    {
      id: 'seed_scan_1',
      type: 'sms',
      inputSummary: 'CONGRATS! Rs 25,000 credited to GPay account. Enter UPI...',
      verdict: 'CRITICAL',
      riskScore: 95,
      riskLevel: 'CRITICAL',
      category: 'UPI Collect Request Trap',
      confidencePercentage: 96,
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
      explanation: 'Message contains UPI PIN trap phrases urging user to accept payment.',
      recommendations: ['Do NOT enter your UPI PIN.', 'Report to Cyber Helpline 1930.'],
      redFlags: [
        {
          id: 'rf_1',
          title: 'UPI PIN Trap Lure',
          description: 'PIN is ONLY required to send money, never to receive.',
          severity: 'critical',
        },
      ],
    },
    {
      id: 'seed_scan_2',
      type: 'upi_vpa',
      inputSummary: 'paytm-refund-desk@okaxis',
      verdict: 'SCAM',
      riskScore: 88,
      riskLevel: 'HIGH',
      category: 'UPI VPA Handle',
      confidencePercentage: 94,
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
      explanation: 'VPA uses fake customer desk brand impersonation.',
      recommendations: ['Do NOT transfer money to unverified handles.'],
      redFlags: [
        {
          id: 'rf_2',
          title: 'Brand Impersonation',
          description: 'Handle uses "refund-desk" keyword on non-official merchant account.',
          severity: 'high',
        },
      ],
    },
    {
      id: 'seed_scan_3',
      type: 'url',
      inputSummary: 'http://sbi-reward-points.top/claim',
      verdict: 'CRITICAL',
      riskScore: 100,
      riskLevel: 'CRITICAL',
      category: 'Web Link Phishing',
      confidencePercentage: 97,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      explanation: 'Link uses unencrypted HTTP and disposable top-level domain (.top).',
      recommendations: ['Do not open link or enter credentials.'],
      redFlags: [
        {
          id: 'rf_3',
          title: 'Unencrypted HTTP Connection',
          description: 'Lacks SSL encryption certificate.',
          severity: 'high',
        },
        {
          id: 'rf_4',
          title: 'High Risk TLD (.top)',
          description: 'Domain uses TLD associated with disposable phishing sites.',
          severity: 'critical',
        },
      ],
    },
    {
      id: 'seed_scan_4',
      type: 'screenshot',
      inputSummary: 'fake_paytm_txn_receipt_5000.png',
      verdict: 'SCAM',
      riskScore: 92,
      riskLevel: 'HIGH',
      category: 'Payment Proof Receipt',
      confidencePercentage: 94,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      explanation: 'Font metric distortion and invalid UTR checksum detected.',
      recommendations: ['Verify incoming funds directly in your bank statement.'],
      redFlags: [
        {
          id: 'rf_5',
          title: 'Font Metric Distortion',
          description: 'Rasterized font does not match official Paytm receipt template.',
          severity: 'high',
        },
      ],
    },
  ];
}
