import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { ScreenWrapper, PrimaryButton, Icon } from '@/components';
import { colors, spacing, typography } from '@/index';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/featurestacks/AuthStack';
import { useResetPasswordMutation } from '@/features/authentication/auth.api';
import PasswordInput from '@/components/reusable_components/Inputs/PaswordInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type NewPasswordRouteProp = RouteProp<AuthStackParamList, 'NewPassword'>;

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function NewPassword() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<NewPasswordRouteProp>();
  const { email, otp } = route.params;
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { control, handleSubmit, formState: { isValid } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await resetPassword({ token: otp, password: data.password, email }).unwrap();
      Alert.alert(
        'Password Reset!',
        'Your password has been changed successfully.',
        [{ text: 'Sign In', onPress: () => navigation.navigate('SignIn') }]
      );
    } catch (error: any) {
      const msg = error?.data?.error || 'Failed to reset password. Please try again.';
      Alert.alert('Reset Failed', msg);
    }
  };

  return (
    <ScreenWrapper keyboardAvoiding>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon library="ionicons" name="arrow-back" size="lg" color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>New Password</Text>
          <Text style={styles.subtitle}>
            Create a new password for{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <PasswordInput
            control={control}
            name="password"
            label="New Password"
            placeholder="Enter new password"
          />

          <PasswordInput
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter new password"
          />

          <PrimaryButton
            title="Reset Password"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isValid || isLoading}
            fullWidth
            size="lg"
            style={styles.button}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  emailText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
  button: {
    marginTop: spacing.xl,
  },
});
