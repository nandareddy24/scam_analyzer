import {
  URLAnalysisRequest,
  URLAnalysisResult,
  URLIndicator,
  URLRiskLevel,
  URLVerdict,
} from '../types/url.types';

const KNOWN_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  'cutt.ly',
  'is.gd',
  't.co',
  'rb.gy',
  'shorturl.at',
  'ow.ly',
  'buff.ly',
];

const SUSPICIOUS_TLDS = [
  '.top',
  '.xyz',
  '.site',
  '.buzz',
  '.work',
  '.tk',
  '.ml',
  '.cf',
  '.gq',
  '.online',
  '.free',
  '.club',
  '.info',
  '.rest',
  '.live',
];

const SUSPICIOUS_URL_KEYWORDS = [
  { kw: 'login', label: 'Credential Harvesting Keyword (login)' },
  { kw: 'verify', label: 'Unverified Action Keyword (verify)' },
  { kw: 'update', label: 'Urgent Update Lure (update)' },
  { kw: 'reward', label: 'Bank Reward Points Trap (reward)' },
  { kw: 'claim', label: 'Unsolicited Claim Lure (claim)' },
  { kw: 'kyc', label: 'KYC Suspension Trap (kyc)' },
  { kw: 'banking', label: 'Financial Impersonation (banking)' },
  { kw: 'secure', label: 'False Trust Keyword (secure)' },
  { kw: 'refund', label: 'Fake Refund Portal Keyword (refund)' },
  { kw: 'electricity', label: 'Utility Disconnect Scam (electricity)' },
];

const OFFICIAL_FINANCIAL_DOMAINS = [
  'sbi.co.in',
  'onlinesbi.sbi',
  'hdfcbank.com',
  'icicibank.com',
  'paytm.com',
  'phonepe.com',
  'axisbank.com',
  'cybercrime.gov.in',
  'npci.org.in',
  'rbi.org.in',
];

export class URLAnalyzerService {
  /**
   * Performs risk assessment analysis on web links.
   * Evaluates domain reputation, SSL encryption, TLD risk, and typosquatting.
   * Service is decoupled for future Python / FastAPI ML backend integration.
   */
  async analyzeURL(request: URLAnalysisRequest): Promise<URLAnalysisResult> {
    const rawInput = request.url?.trim() || '';

    // 1. Validation & Error Handling
    if (!rawInput) {
      throw new Error('Please enter or paste a web URL to analyze.');
    }

    let formattedUrl = rawInput;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(formattedUrl);
    } catch {
      throw new Error('Invalid URL format. Please enter a valid link (e.g. https://example.com).');
    }

    // 2. Simulated Latency for API / Backend
    await new Promise((resolve) => setTimeout(resolve, 800));

    const domain = parsedUrl.hostname.toLowerCase();
    const hasSSL = formattedUrl.startsWith('https://');
    const isShortened = KNOWN_SHORTENERS.some((s) => domain.includes(s));

    const domainParts = domain.split('.');
    const subdomainCount = Math.max(0, domainParts.length - 2);

    const tldMatch = SUSPICIOUS_TLDS.find((t) => domain.endsWith(t));
    const tld = tldMatch || '.' + domainParts[domainParts.length - 1];

    const detectedIndicators: URLIndicator[] = [];
    let riskScore = 10;

    // --- HEURISTIC RISK INDICATOR CHECKS ---

    // A. Check SSL Encryption
    if (!hasSSL) {
      riskScore += 25;
      detectedIndicators.push({
        id: 'ind_no_ssl',
        title: 'Unencrypted Connection (HTTP)',
        description: 'Site lacks HTTPS encryption. Sensitive payment details entered here can be intercepted.',
        severity: 'high',
      });
    }

    // B. Check URL Shorteners
    if (isShortened) {
      riskScore += 30;
      detectedIndicators.push({
        id: 'ind_shortener',
        title: 'URL Shortener Service Detected',
        description: 'Shortened URLs mask the true destination domain to bypass standard email/SMS filters.',
        severity: 'medium',
      });
    }

    // C. Check Suspicious TLDs
    if (tldMatch) {
      riskScore += 35;
      detectedIndicators.push({
        id: 'ind_suspicious_tld',
        title: `High-Risk Top-Level Domain (${tld})`,
        description: `Domain uses "${tld}" top-level domain frequently associated with low-cost disposable phishing sites.`,
        severity: 'high',
      });
    }

    // D. Check Excessive Subdomains
    if (subdomainCount >= 3) {
      riskScore += 25;
      detectedIndicators.push({
        id: 'ind_excessive_subdomains',
        title: 'Excessive Subdomain Stacking',
        description: `Domain contains ${subdomainCount} subdomains. Scammers use multi-level subdomains to mimic official bank structures.`,
        severity: 'medium',
      });
    }

    // E. Check Suspicious Keywords in URL
    const fullPath = (parsedUrl.hostname + parsedUrl.pathname + parsedUrl.search).toLowerCase();
    SUSPICIOUS_URL_KEYWORDS.forEach((item, idx) => {
      if (fullPath.includes(item.kw)) {
        riskScore += 15;
        detectedIndicators.push({
          id: `ind_kw_${idx}`,
          title: item.label,
          description: `URL path contains keyword "${item.kw}" common in credential harvesting phishing pages.`,
          severity: 'medium',
        });
      }
    });

    // F. Brand Typosquatting / Impersonation Check
    const brandMatches = ['sbi', 'hdfc', 'icici', 'paytm', 'phonepe', 'gpay', 'yono', 'electricity'];
    const containsBrand = brandMatches.some((b) => fullPath.includes(b));
    const isOfficialDomain = OFFICIAL_FINANCIAL_DOMAINS.some((off) => domain === off || domain.endsWith('.' + off));

    if (containsBrand && !isOfficialDomain) {
      riskScore += 45;
      detectedIndicators.push({
        id: 'ind_typosquatting',
        title: 'Financial Brand Impersonation / Typosquatting',
        description: 'URL uses bank/payment brand keywords on an unofficial third-party domain.',
        severity: 'critical',
      });
    }

    // Official Domain Exception Override
    if (isOfficialDomain) {
      riskScore = 5;
      detectedIndicators.length = 0;
    }

    // Normalize Risk Score
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Determine Verdict & Risk Level
    let verdict: URLVerdict = 'SAFE';
    let riskLevel: URLRiskLevel = 'LOW';
    let confidencePercentage = 93;

    if (riskScore >= 75) {
      verdict = 'PHISHING_SCAM';
      riskLevel = 'CRITICAL';
      confidencePercentage = 97;
    } else if (riskScore >= 45) {
      verdict = 'SUSPICIOUS';
      riskLevel = 'HIGH';
      confidencePercentage = 91;
    } else if (riskScore >= 25) {
      verdict = 'SUSPICIOUS';
      riskLevel = 'MEDIUM';
      confidencePercentage = 84;
    } else {
      verdict = 'SAFE';
      riskLevel = 'LOW';
      confidencePercentage = 96;
    }

    const explanation = isOfficialDomain
      ? 'Verified official financial portal. Domain matches authorized banking infrastructure.'
      : verdict === 'PHISHING_SCAM'
      ? 'CRITICAL PHISHING WARNING: Link exhibits strong malicious domain indicators, brand impersonation, or unencrypted credential traps. (Note: Treat URL analysis as a risk assessment rating, not absolute proof of fraud).'
      : verdict === 'SUSPICIOUS'
      ? 'SUSPICIOUS LINK: Contains unverified TLDs, shortened redirects, or financial keywords. (Note: Treat URL analysis as a risk assessment rating, not absolute proof of fraud).'
      : 'No high-risk phishing signatures or domain anomalies detected. (Note: Treat URL analysis as a risk assessment rating, not absolute proof of fraud).';

    const recommendation =
      verdict === 'PHISHING_SCAM'
        ? 'DO NOT OPEN THIS LINK or submit passwords/OTP. Close browser immediately.'
        : verdict === 'SUSPICIOUS'
        ? 'Avoid entering financial passwords or UPI MPIN on this page. Verify link from official bank website.'
        : 'Ensure HTTPS padlock icon is visible in browser before logging in.';

    return {
      id: `url_audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      url: formattedUrl,
      domain,
      hasSSL,
      isShortened,
      subdomainCount,
      tld,
      riskScore,
      riskLevel,
      verdict,
      confidencePercentage,
      detectedIndicators,
      explanation,
      recommendation,
      rawMetadata: {
        analyzedDomain: domain,
        officialMatch: isOfficialDomain,
        serviceEndpoint: 'mock://services/urlAnalyzer.ts',
        fastApiTarget: 'http://localhost:8000/api/v1/analyze/url',
      },
    };
  }
}

export const urlAnalyzer = new URLAnalyzerService();
