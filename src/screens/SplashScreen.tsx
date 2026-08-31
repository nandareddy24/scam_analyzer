import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { useTheme } from '../hooks/useTheme';
import { APP_CONFIG } from '../constants/config';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.glowCircle, { backgroundColor: `${theme.colors.primary}15` }]}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.cardBackground }]}>
          <Ionicons name="shield-checkmark" size={64} color={theme.colors.primary} />
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.h1 }]}>
        UPI ScamGuard
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.textSecondary, ...theme.typography.body2 }]}>
        AI-Powered Fraud Prevention & Real-Time Security
      </Text>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.statusText, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
          Initializing Security Engine v{APP_CONFIG.appVersion}...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  glowCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: '80%',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  statusText: {
    marginTop: 12,
    letterSpacing: 0.5,
  },
});
