import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RiskLevel } from '../types/scam.types';
import { getRiskBackgroundColor, getRiskColor, getRiskLabel } from '../utils/formatters';
import { useTheme } from '../hooks/useTheme';

interface RiskIndicatorProps {
  score: number; // 0 - 100
  level: RiskLevel;
  size?: number;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ score, level, size = 120 }) => {
  const theme = useTheme();
  const color = getRiskColor(level);
  const bgColor = getRiskBackgroundColor(level);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.circleOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            backgroundColor: bgColor,
          },
        ]}
      >
        <Text style={[styles.scoreText, { color, fontSize: size * 0.32 }]}>
          {Math.round(score)}%
        </Text>
        <Text style={[styles.scoreSub, { color: theme.colors.textSecondary }]}>RISK SCORE</Text>
      </View>

      {/* Progress Bar representation for Android rendering stability */}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.min(100, Math.max(5, score))}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <Text style={[styles.levelLabel, { color, ...theme.typography.subtitle1 }]}>
        {getRiskLabel(level)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  circleOuter: {
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  scoreText: {
    fontWeight: '900',
    letterSpacing: -1,
  },
  scoreSub: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: -2,
  },
  barBackground: {
    width: '80%',
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  levelLabel: {
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
