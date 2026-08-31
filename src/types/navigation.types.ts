import { NavigatorScreenParams } from '@react-navigation/native';
import { ScanResultData } from './scam.types';

export type MainTabParamList = {
  Home: undefined;
  Analyze: { initialCategory?: 'upi_vpa' | 'sms' | 'url' | 'screenshot'; initialInput?: string } | undefined;
  History: undefined;
  Safety: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ScanDetails: { scanResult: ScanResultData };
  ReportHelp: undefined;
  About: undefined;
};


