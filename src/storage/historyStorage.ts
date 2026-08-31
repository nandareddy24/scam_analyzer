import { ScanResultData } from '../types/scam.types';

const MOCK_INITIAL_HISTORY: ScanResultData[] = [
  {
    id: 'scan_init_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    category: 'sms',
    targetInput: 'Dear customer, your SBI rewards points worth Rs 9,850 will expire today. Redeem now at http://sbi-reward-points.top/claim',
    riskScore: 92,
    riskLevel: 'critical',
    verdictTitle: 'Phishing SMS Link Trap',
    summary: 'Detected fake bank reward points luring victim to unencrypted phishing domain.',
    threatFactors: [
      {
        id: 'tf_1',
        name: 'Urgent Disconnect / Expiry Threat',
        severity: 'high',
        description: 'Creates artificial panic to disable critical thinking.',
      },
      {
        id: 'tf_2',
        name: 'Phishing TLD (.top)',
        severity: 'critical',
        description: 'High-risk fraudulent top-level domain registered 2 days ago.',
      },
    ],
    recommendedAction: 'Do not open link. Report SMS to 1930 Cyber Crime portal.',
  },
  {
    id: 'scan_init_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
    category: 'upi_vpa',
    targetInput: 'paytm-refund-desk@okaxis',
    riskScore: 78,
    riskLevel: 'high_risk',
    verdictTitle: 'Fraudulent Refund VPA',
    summary: 'VPA handle uses keywords "refund-desk" to impersonate official Paytm support.',
    threatFactors: [
      {
        id: 'tf_3',
        name: 'Impersonation Keyword',
        severity: 'high',
        description: 'Offical customer care will NEVER ask you to pay or verify VPA for refunds.',
      },
    ],
    recommendedAction: 'Refuse collect request. Paytm customer care never sends raw payment handles.',
  },
  {
    id: 'scan_init_3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
    category: 'upi_vpa',
    targetInput: 'merchant.zomato@icici',
    riskScore: 5,
    riskLevel: 'safe',
    verdictTitle: 'Verified Merchant UPI',
    summary: 'Matches official registered merchant PSP database with clean transaction history.',
    threatFactors: [],
    recommendedAction: 'Safe to proceed with payment.',
  },
  {
    id: 'scan_init_4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2d ago
    category: 'url',
    targetInput: 'https://electricity-bill-update-desk.site',
    riskScore: 86,
    riskLevel: 'high_risk',
    verdictTitle: 'Electricity Bill Extortion Phishing',
    summary: 'Fake state electricity portal used in power disconnection scam.',
    threatFactors: [
      {
        id: 'tf_4',
        name: 'Fake Utility Portal',
        severity: 'high',
        description: 'Unregistered site luring users to pay fake dues.',
      },
    ],
    recommendedAction: 'Pay utility bills only via official state electricity board app.',
  },
];

class HistoryStorage {
  private history: ScanResultData[] = [...MOCK_INITIAL_HISTORY];

  async getHistory(): Promise<ScanResultData[]> {
    return [...this.history];
  }

  async saveScanResult(result: ScanResultData): Promise<void> {
    this.history = [result, ...this.history];
  }

  async clearHistory(): Promise<void> {
    this.history = [];
  }

  async deleteScanResult(id: string): Promise<void> {
    this.history = this.history.filter((item) => item.id !== id);
  }
}

export const historyStorage = new HistoryStorage();
