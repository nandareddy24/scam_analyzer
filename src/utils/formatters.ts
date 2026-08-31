import { RiskLevel, ScamCategory } from '../types/scam.types';
import { theme } from '../constants/theme';

export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'safe':
      return theme.colors.safe;
    case 'caution':
      return theme.colors.caution;
    case 'high_risk':
      return theme.colors.danger;
    case 'critical':
      return theme.colors.critical;
    case 'scanning':
    default:
      return theme.colors.primary;
  }
}

export function getRiskBackgroundColor(level: RiskLevel): string {
  switch (level) {
    case 'safe':
      return theme.colors.safeBg;
    case 'caution':
      return theme.colors.cautionBg;
    case 'high_risk':
      return theme.colors.dangerBg;
    case 'critical':
      return theme.colors.criticalBg;
    case 'scanning':
    default:
      return 'rgba(14, 165, 233, 0.15)';
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'safe':
      return 'VERIFIED SAFE';
    case 'caution':
      return 'SUSPICIOUS - CAUTION';
    case 'high_risk':
      return 'HIGH RISK SCAM';
    case 'critical':
      return 'CRITICAL FRAUD THREAT';
    case 'scanning':
      return 'ANALYZING...';
  }
}

export function getCategoryLabel(category: ScamCategory): string {
  switch (category) {
    case 'upi_vpa':
      return 'UPI VPA / ID';
    case 'sms':
      return 'SMS Message';
    case 'url':
      return 'Phishing Link';
    case 'screenshot':
      return 'Payment QR / Screenshot';
  }
}

export function getCategoryIconName(category: ScamCategory): string {
  switch (category) {
    case 'upi_vpa':
      return 'at-circle-outline';
    case 'sms':
      return 'chatbox-ellipses-outline';
    case 'url':
      return 'link-outline';
    case 'screenshot':
      return 'qr-code-outline';
  }
}
