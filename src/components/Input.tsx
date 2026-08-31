import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  helperText?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  iconName,
  onClear,
  value,
  containerStyle,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary, ...theme.typography.subtitle2 }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.cardBackground,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderRadius: theme.borderRadius.md,
          },
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? theme.colors.danger : theme.colors.primary}
            style={styles.icon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              ...theme.typography.body1,
            },
          ]}
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          {...rest}
        />

        {value && value.length > 0 && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.danger, ...theme.typography.caption }]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  errorText: {
    marginTop: 4,
  },
  helperText: {
    marginTop: 4,
  },
});
