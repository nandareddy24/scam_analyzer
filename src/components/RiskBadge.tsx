import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RiskLevel } from '../types/scam.types';
import { getRiskBackgroundColor, getRiskColor, getRiskLabel } from '../utils/formatters';
import { useTheme } from '../hooks/useTheme';

interface RiskBadgeProps {
  level: RiskLevel;
  customText?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  customText,
  size = 'medium',
  style,
}) => {
  const theme = useTheme();
  const textColor = getRiskColor(level);
  const bgColor = getRiskBackgroundColor(level);
  const label = customText || getRiskLabel(level);

  const paddingVertical = size === 'small' ? 2 : size === 'large' ? 6 : 4;
  const paddingHorizontal = size === 'small' ? 8 : size === 'large' ? 14 : 10;
  const fontSize = size === 'small' ? 10 : size === 'large' ? 12 : 11;
  const dotSize = size === 'small' ? 5 : size === 'large' ? 7 : 6;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor: textColor,
          paddingVertical,
          paddingHorizontal,
          borderRadius: theme.borderRadius.full,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: textColor }]} />
      <Text style={[styles.label, { color: textColor, fontSize }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  dot: {
    marginRight: 5,
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
