import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { historyStorage } from '../storage/historyStorage';
import { APP_CONFIG } from '../constants/config';

type Props = BottomTabScreenProps<MainTabParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = () => {
  const theme = useTheme();

  const [realtimeSms, setRealtimeSms] = useState(true);
  const [autoUrlCheck, setAutoUrlCheck] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  const [threatAlerts, setThreatAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleResetData = () => {
    Alert.alert(
      'Reset Application Data',
      'This will clear local scan cache and restore default preferences.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Data',
          style: 'destructive',
          onPress: async () => {
            await historyStorage.clearHistory();
            Alert.alert('Data Reset', 'All cached security audit logs cleared successfully.');
          },
        },
      ],
    );
  };

  return (
    <ScreenWrapper scrollable>
      <Header
        title="App Settings"
        subtitle="Security toggles, guard parameters & system status"
      />

      {/* Security Shield Preferences */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
        Active Protection Guards
      </Text>

      <Card style={styles.cardGroup}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="chatbox-ellipses-outline" size={22} color={theme.colors.primary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                Real-Time SMS Monitor
              </Text>
              <Text style={[styles.settingSub, { color: theme.colors.textSecondary }]}>
                Auto-scan incoming SMS for PIN traps & fake reward links
              </Text>
            </View>
          </View>
          <Switch
            value={realtimeSms}
            onValueChange={setRealtimeSms}
            thumbColor={realtimeSms ? theme.colors.primary : '#64748B'}
            trackColor={{ false: '#334155', true: 'rgba(14, 165, 233, 0.3)' }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="link-outline" size={22} color={theme.colors.secondary} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                Phishing Domain Defender
              </Text>
              <Text style={[styles.settingSub, { color: theme.colors.textSecondary }]}>
                Inspect web domain SSL metrics & typosquatting
              </Text>
            </View>
          </View>
          <Switch
            value={autoUrlCheck}
            onValueChange={setAutoUrlCheck}
            thumbColor={autoUrlCheck ? theme.colors.primary : '#64748B'}
            trackColor={{ false: '#334155', true: 'rgba(14, 165, 233, 0.3)' }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="finger-print-outline" size={22} color={theme.colors.safe} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                Biometric App Security Lock
              </Text>
              <Text style={[styles.settingSub, { color: theme.colors.textSecondary }]}>
                Require Fingerprint / FaceID to open UPI ScamGuard
              </Text>
            </View>
          </View>
          <Switch
            value={biometricLock}
            onValueChange={setBiometricLock}
            thumbColor={biometricLock ? theme.colors.primary : '#64748B'}
            trackColor={{ false: '#334155', true: 'rgba(14, 165, 233, 0.3)' }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-active-outline" size={22} color={theme.colors.caution} style={styles.settingIcon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                High-Threat Push Alerts
              </Text>
              <Text style={[styles.settingSub, { color: theme.colors.textSecondary }]}>
                Instant alerts on newly discovered Indian UPI fraud techniques
              </Text>
            </View>
          </View>
          <Switch
            value={threatAlerts}
            onValueChange={setThreatAlerts}
            thumbColor={threatAlerts ? theme.colors.primary : '#64748B'}
            trackColor={{ false: '#334155', true: 'rgba(14, 165, 233, 0.3)' }}
          />
        </View>
      </Card>

      {/* Project & System Metadata */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3, marginTop: 14 }]}>
        Academic Project Metadata
      </Text>

      <Card style={styles.cardGroup}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Project Title</Text>
          <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>UPI ScamGuard</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Build Platform</Text>
          <Text style={[styles.infoVal, { color: theme.colors.primary }]}>React Native + Expo TS</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Architecture Layer</Text>
          <Text style={[styles.infoVal, { color: theme.colors.safe }]}>Modular Service Interface Ready</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>App Version</Text>
          <Text style={[styles.infoVal, { color: theme.colors.textMuted }]}>{APP_CONFIG.appVersion}</Text>
        </View>
      </Card>

      {/* Reset Action Button */}
      <Button
        title="Reset Local Cache & Audit Logs"
        onPress={handleResetData}
        variant="danger"
        style={{ marginTop: 16 }}
        icon={<Ionicons name="trash-bin-outline" size={18} color="#FFFFFF" />}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 12,
  },
  cardGroup: {
    padding: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
  },
});
