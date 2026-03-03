import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PasswordInput from '@/components/reusable_components/Inputs/PaswordInput';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useChangePasswordMutation } from '@/features/user/user.api';
import { ProfileStackParamList } from '@/navigation/featurestacks/ProfileStack';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function PasswordManager() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const { control, handleSubmit, reset, formState: { isValid, errors } } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      Alert.alert(
        '✅ Password Changed',
        'Your password has been updated successfully.',
        [{ text: 'OK', onPress: () => { reset(); navigation.goBack(); } }]
      );
    } catch (error: any) {
      const message = error?.data?.error || 'Failed to change password. Please try again.';
      Alert.alert('Change Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" library="ionicons" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Icon name="information-circle-outline" library="ionicons" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Choose a strong password with at least 8 characters. You'll be required to sign in again after changing.
          </Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Current Password</Text>
            <PasswordInput
              control={control}
              name="currentPassword"
              placeholder="Enter your current password"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>New Password</Text>
            <PasswordInput
              control={control}
              name="newPassword"
              placeholder="Enter new password (min 8 chars)"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Confirm New Password</Text>
            <PasswordInput
              control={control}
              name="confirmPassword"
              placeholder="Re-enter new password"
            />
          </View>
        </View>

        {/* Password tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Password Tips</Text>
          {[
            'Use at least 8 characters',
            'Mix uppercase and lowercase letters',
            'Include numbers and symbols',
            'Avoid using your name or email',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Icon name="checkmark-circle-outline" library="ionicons" size={16} color={colors.success || colors.primary} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          title={isLoading ? 'Updating...' : 'Change Password'}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid || isLoading}
          fullWidth
          size="lg"
          style={styles.submitButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '15',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow.sm,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  tipsTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  submitButton: {
    marginBottom: spacing.xxxl,
  },
});
