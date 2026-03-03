import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ScreenWrapper, PrimaryButton, Icon } from '@/components';
import { colors, spacing, typography, radius } from '@/index';
import OTPInput from '@/components/reusable_components/Inputs/OTPInput';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/featurestacks/AuthStack';
import { useVerifyCodeViewModel } from '@/viewmodels/authentication/VerifyCodeViewModel';
import { Controller } from 'react-hook-form';
import { OtpSchemaType } from '@/validation/auth.schema';

type VerifyCodeRouteProp = RouteProp<AuthStackParamList, 'VerifyCode'>;

export default function VerifyCode() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<VerifyCodeRouteProp>();
  const { email } = route.params;

  const {
    form: { control, handleSubmit, formState: { isValid } },
    handleVerify,
    handleResend,
    isVerifying,
    isResending,
  } = useVerifyCodeViewModel();

  const onVerifySubmit = async (data: OtpSchemaType) => {
    try {
      await handleVerify(email, data);
      // Success is handled by the root navigator reacting to updated auth state
    } catch (error) {
      // Error handling is managed by the view model/API hooks
      console.log("Verification Error", error)
    }
  };

  const onResendPress = async () => {
    try {
      await handleResend(email);
    } catch (error) {
      console.log("Resend Error", error)
    }
  };

  return (
    <ScreenWrapper keyboardAvoiding scrollable>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon library="ionicons" name="arrow-back" size="lg" color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Verify Code</Text>
          <Text style={styles.subtitle}>
            Please enter the code we just sent to email{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, value } }) => (
              <OTPInput
                code={value}
                setCode={onChange}
                maximumLength={4}
              />
            )}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive OTP? </Text>
            <Pressable onPress={onResendPress} disabled={isResending}>
              <Text style={styles.resendLink}>
                {isResending ? 'Resending...' : 'Resend code'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Verify"
              onPress={handleSubmit(onVerifySubmit)}
              loading={isVerifying}
              disabled={!isValid || isVerifying}
              fullWidth
              size="lg"
            />
          </View>
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
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  emailText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  resendText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  resendLink: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.md,
  },
});
