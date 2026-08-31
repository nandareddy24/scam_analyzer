import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RiskLevel } from '../types/scam.types';
import { getRiskBackgroundColor, getRiskColor, getRiskLabel } from '../utils/formatters';
import { useTheme } from '../hooks/useTheme';

interface BadgeProps {
  level: RiskLevel;
  customText?: string;
  style?: ViewStyle;
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({ level, customText, style, size = 'medium' }) => {
  const theme = useTheme();
  const textColor = getRiskColor(level);
  const bgColor = getRiskBackgroundColor(level);
  const label = customText || getRiskLabel(level);

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor: textColor,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 12,
          borderRadius: theme.borderRadius.full,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: textColor }]} />
      <Text
        style={[
          styles.label,
          {
            color: textColor,
            fontSize: isSmall ? 10 : 12,
            fontWeight: '700',
          },
        ]}
      >
        {label}
      </Text>
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
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
