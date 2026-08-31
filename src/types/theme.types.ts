export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  
  background: string;
  backgroundSecondary: string;
  cardBackground: string;
  cardBorder: string;
  
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  safe: string;
  safeBg: string;
  caution: string;
  cautionBg: string;
  danger: string;
  dangerBg: string;
  critical: string;
  criticalBg: string;
  
  border: string;
  divider: string;
  overlay: string;
}

export interface SpacingTheme {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadiusTheme {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface TypographyVariant {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700' | '800';
}

export interface TypographyTheme {
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  subtitle1: TypographyVariant;
  subtitle2: TypographyVariant;
  body1: TypographyVariant;
  body2: TypographyVariant;
  caption: TypographyVariant;
  button: TypographyVariant;
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ShadowsTheme {
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  cyberGlow: ShadowStyle;
  dangerGlow: ShadowStyle;
}

export interface Theme {
  colors: ColorPalette;
  spacing: SpacingTheme;
  borderRadius: BorderRadiusTheme;
  typography: TypographyTheme;
  shadows: ShadowsTheme;
  isDark: boolean;
}
