import { Platform } from 'react-native';

/**
 * Backend API Configuration
 * Automatically resolves the appropriate local development backend URL based on OS/Platform:
 * - Android Emulator: http://10.0.2.2:8000
 * - iOS Simulator / Web / Desktop: http://localhost:8000
 */
const getBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }
  return 'http://localhost:8000/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT_MS: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
