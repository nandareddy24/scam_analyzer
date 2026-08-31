import { Theme } from '../types/theme.types';

export const theme: Theme = {
  isDark: true,
  colors: {
    primary: '#0EA5E9', // Electric Cyan
    primaryLight: '#38BDF8',
    primaryDark: '#0284C7',
    secondary: '#6366F1', // Indigo Accent
    accent: '#14B8A6', // Teal Accent

    background: '#0B1120', // Cyber Deep Blue Dark
    backgroundSecondary: '#0F172A', // Dark Slate Container
    cardBackground: '#1E293B', // Glass/Slate Card Base
    cardBorder: 'rgba(56, 189, 248, 0.15)', // Subtle Cyber Border

    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    safe: '#10B981', // Emerald Safe
    safeBg: 'rgba(16, 185, 129, 0.12)',
    caution: '#F59E0B', // Amber Caution
    cautionBg: 'rgba(245, 158, 11, 0.12)',
    danger: '#EF4444', // Red High Risk
    dangerBg: 'rgba(239, 68, 68, 0.12)',
    critical: '#DC2626', // Deep Red Critical Threat
    criticalBg: 'rgba(220, 38, 38, 0.18)',

    border: '#334155',
    divider: '#1E293B',
    overlay: 'rgba(11, 17, 32, 0.85)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  typography: {
    h1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '800',
    },
    h2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700',
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700',
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600',
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
    },
    body1: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '400',
    },
    body2: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400',
    },
    caption: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '400',
    },
    button: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
    },
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 8.3,
      elevation: 8,
    },
    cyberGlow: {
      shadowColor: '#0EA5E9',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 8,
    },
    dangerGlow: {
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 10,
    },
  },
};
