import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'cyber';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case 'primary':
      case 'cyber':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.cardBackground;
      case 'danger':
        return theme.colors.danger;
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textMuted;
    switch (variant) {
      case 'primary':
      case 'cyber':
        return '#0B1120';
      case 'secondary':
        return theme.colors.textPrimary;
      case 'danger':
        return '#FFFFFF';
      case 'ghost':
        return theme.colors.primary;
      default:
        return '#0B1120';
    }
  };

  const getBorderColor = () => {
    if (variant === 'secondary') return theme.colors.border;
    if (variant === 'cyber') return theme.colors.primaryLight;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: getBorderColor() !== 'transparent' ? 1 : 0,
          borderRadius: theme.borderRadius.md,
          paddingVertical: theme.spacing.md - 2,
          paddingHorizontal: theme.spacing.lg,
          width: fullWidth ? '100%' : 'auto',
          ...(variant === 'cyber' ? theme.shadows.cyberGlow : theme.shadows.sm),
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                ...theme.typography.button,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.6,
  },
});
