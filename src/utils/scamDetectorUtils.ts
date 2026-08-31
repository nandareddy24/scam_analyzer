import { RiskLevel, ThreatFactor } from '../types/scam.types';

const SUSPICIOUS_VPA_PATTERNS = [
  /refund/i,
  /reward/i,
  /cashback/i,
  /lucky/i,
  /winner/i,
  /lottery/i,
  /helpdesk/i,
  /customer-care/i,
  /support-bank/i,
  /upi-verify/i,
  /kyc/i,
];

const SUSPICIOUS_SMS_KEYWORDS = [
  'urgently verify kyc',
  'account suspended',
  'claim your refund of rs',
  'congratulations you won',
  'electricity connection will be disconnected',
  'share 6-digit pin',
  'enter upi pin to receive money',
  'download anydesk',
  'install teamviewer',
  'update pan card immediately',
  'sbi rewards point expire',
];

const SUSPICIOUS_URL_TLDS = ['.xyz', '.top', '.buzz', '.tk', '.ml', '.cf', '.gq', '.site', '.work'];

export function analyzeVPAHeuristics(vpa: string): { score: number; level: RiskLevel; factors: ThreatFactor[] } {
  const factors: ThreatFactor[] = [];
  let score = 5; // Base low risk

  const trimmed = vpa.trim().toLowerCase();

  if (!trimmed.includes('@')) {
    return {
      score: 80,
      level: 'high_risk',
      factors: [
        {
          id: 'vpa_malformed',
          name: 'Invalid VPA Format',
          severity: 'high',
          description: 'UPI Handle does not contain valid "@handle" separator',
        },
      ],
    };
  }

  const [username, handle] = trimmed.split('@');

  // Check suspicious handle keywords
  SUSPICIOUS_VPA_PATTERNS.forEach((pattern, idx) => {
    if (pattern.test(username) || pattern.test(handle)) {
      score += 35;
      factors.push({
        id: `vpa_keyword_${idx}`,
        name: 'Deceptive Keyword Detected',
        severity: 'high',
        description: `UPI handle contains suspicious phishing term matching "${pattern.source}"`,
      });
    }
  });

  // Check handle anomalies
  if (username.length > 25) {
    score += 15;
    factors.push({
      id: 'vpa_long_user',
      name: 'Unusually Long Username',
      severity: 'medium',
      description: 'Scammers frequently use complex auto-generated strings to bypass standard checks',
    });
  }

  if (/^\d{10,}/.test(username)) {
    score += 15;
    factors.push({
      id: 'vpa_phone_mask',
      name: 'Raw Phone Number Handle',
      severity: 'medium',
      description: 'VPA uses unverified phone number handle without merchant registry badge',
    });
  }

  // Calculate final level
  score = Math.min(100, Math.max(0, score));
  const level = getRiskLevelFromScore(score);

  return { score, level, factors };
}

export function analyzeSMSHeuristics(text: string): { score: number; level: RiskLevel; factors: ThreatFactor[] } {
  const factors: ThreatFactor[] = [];
  let score = 10;

  const lower = text.toLowerCase();

  SUSPICIOUS_SMS_KEYWORDS.forEach((kw, idx) => {
    if (lower.includes(kw)) {
      score += 30;
      factors.push({
        id: `sms_kw_${idx}`,
        name: 'High-Risk Trigger Phrase',
        severity: 'high',
        description: `Message content contains classic scam phrasing: "${kw}"`,
      });
    }
  });

  if (/https?:\/\/[^\s]+/i.test(text)) {
    score += 25;
    factors.push({
      id: 'sms_embedded_url',
      name: 'Embedded Link in Financial SMS',
      severity: 'medium',
      description: 'Official banking SMS rarely send raw shortened URLs urging immediate clicks',
    });
  }

  if (/enter upi pin to receive/i.test(text) || /pin is required to credit/i.test(text)) {
    score += 50;
    factors.push({
      id: 'sms_pin_receive_trap',
      name: 'UPI PIN Credit Trap',
      severity: 'critical',
      description: 'GOLDEN RULE VIOLATION: You NEVER enter UPI PIN to receive money in your account!',
    });
  }

  score = Math.min(100, Math.max(0, score));
  const level = getRiskLevelFromScore(score);

  return { score, level, factors };
}

export function analyzeURLHeuristics(url: string): { score: number; level: RiskLevel; factors: ThreatFactor[] } {
  const factors: ThreatFactor[] = [];
  let score = 15;

  const lower = url.toLowerCase().trim();

  if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
    score += 10;
  }

  if (lower.startsWith('http://')) {
    score += 25;
    factors.push({
      id: 'url_no_ssl',
      name: 'Unencrypted Connection (HTTP)',
      severity: 'high',
      description: 'Target site lacks SSL encryption (HTTPS), unsafe for financial transactions',
    });
  }

  SUSPICIOUS_URL_TLDS.forEach((tld, idx) => {
    if (lower.includes(tld)) {
      score += 35;
      factors.push({
        id: `url_tld_${idx}`,
        name: 'High-Risk Domain TLD',
        severity: 'high',
        description: `Domain uses top-level domain "${tld}" commonly associated with phishing links`,
      });
    }
  });

  if (lower.includes('sbi') || lower.includes('hdfc') || lower.includes('icici') || lower.includes('paytm') || lower.includes('phonepe')) {
    if (!lower.includes('sbi.co.in') && !lower.includes('hdfcbank.com') && !lower.includes('icicibank.com') && !lower.includes('paytm.com') && !lower.includes('phonepe.com')) {
      score += 45;
      factors.push({
        id: 'url_typosquatting',
        name: 'Brand Typosquatting / Impersonation',
        severity: 'critical',
        description: 'URL uses bank brand name on an unofficial third-party domain',
      });
    }
  }

  score = Math.min(100, Math.max(0, score));
  const level = getRiskLevelFromScore(score);

  return { score, level, factors };
}

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score <= 25) return 'safe';
  if (score <= 55) return 'caution';
  if (score <= 85) return 'high_risk';
  return 'critical';
}
