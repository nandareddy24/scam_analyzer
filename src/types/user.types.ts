export interface UserSettings {
  realtimeSmsScan: boolean;
  autoUrlCheck: boolean;
  biometricLock: boolean;
  threatAlerts: boolean;
  darkTheme: boolean;
  soundEffects: boolean;
}

export interface SecurityStats {
  scansPerformed: number;
  threatsBlocked: number;
  safeTransactionsVerified: number;
  securityHealthScore: number;
}
