import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScanResultData } from '../types/scam.types';
import { RiskBadge } from './RiskBadge';
import { useTheme } from '../hooks/useTheme';
import { formatTimestamp, getCategoryIconName, getRiskColor } from '../utils/formatters';

interface ScanHistoryCardProps {
  scanResult: ScanResultData;
  onPress?: () => void;
}

export const ScanHistoryCard: React.FC<ScanHistoryCardProps> = ({ scanResult, onPress }) => {
  const theme = useTheme();
  const riskColor = getRiskColor(scanResult.riskLevel);
  const iconName = getCategoryIconName(scanResult.category);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: scanResult.riskScore > 60 ? 'rgba(239, 68, 68, 0.4)' : theme.colors.cardBorder,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={[styles.categoryBox, { backgroundColor: `${theme.colors.primary}18` }]}>
          <Ionicons name={iconName as any} size={18} color={theme.colors.primary} />
        </View>

        <View style={styles.targetBox}>
          <Text style={[styles.targetInput, { color: theme.colors.textPrimary, ...theme.typography.subtitle2 }]} numberOfLines={1}>
            {scanResult.targetInput}
          </Text>
          <Text style={[styles.timestamp, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
            {formatTimestamp(scanResult.timestamp)} • {scanResult.category.toUpperCase()}
          </Text>
        </View>

        <View style={styles.scorePill}>
          <Text style={[styles.scoreValue, { color: riskColor }]}>{Math.round(scanResult.riskScore)}%</Text>
          <Text style={[styles.scoreLabel, { color: theme.colors.textMuted }]}>RISK</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <RiskBadge level={scanResult.riskLevel} size="small" />
        <View style={styles.verdictRight}>
          <Text style={[styles.verdictTitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {scanResult.verdictTitle}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.textMuted} style={{ marginLeft: 4 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  targetBox: {
    flex: 1,
    marginRight: 8,
  },
  targetInput: {
    fontWeight: '700',
  },
  timestamp: {
    marginTop: 2,
  },
  scorePill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  verdictRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 8,
  },
  verdictTitle: {
    fontSize: 11,
    fontWeight: '600',
  },
});
