import React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'glowing' | 'bordered' | 'danger';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const theme = useTheme();

  const getBorderColor = () => {
    switch (variant) {
      case 'glowing':
        return theme.colors.primary;
      case 'bordered':
        return theme.colors.cardBorder;
      case 'danger':
        return 'rgba(239, 68, 68, 0.4)';
      default:
        return 'rgba(255, 255, 255, 0.08)';
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: getBorderColor(),
    ...(variant === 'glowing' ? theme.shadows.cyberGlow : theme.shadows.sm),
  };

  if (onPress) {
    return (
      <TouchableOpacity style={[cardStyle, style]} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
