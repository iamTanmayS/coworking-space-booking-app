import React, { forwardRef } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, spacing, radius, typography, shadow, opacity } from '@/index';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = forwardRef<View, ButtonProps>(
  (
    {
      title,
      onPress,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      style,
      textStyle,
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const sizeStyle =
      size === 'sm'
        ? styles.sm
        : size === 'lg'
          ? styles.lg
          : styles.md;

    const variantStyle =
      variant === 'secondary'
        ? styles.secondary
        : variant === 'outline'
          ? styles.outline
          : styles.primary;

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        android_ripple={{ color: colors.ripple }}
        style={({ pressed }) => [
          styles.base,
          sizeStyle,
          variantStyle,
          fullWidth && styles.fullWidth,
          pressed && { opacity: opacity.pressed },
          isDisabled && { opacity: 0.7 },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textInverse} />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </Pressable>
    );
  }
);

export default Button;


const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...shadow.sm,
  },

  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.secondary,
  },

  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },

  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },

  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },

  text: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textInverse,
  },

  disabled: {
    elevation: 0,
  },

  fullWidth: {
    width: '100%',
  },
});
