import React from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { ScreenWrapper, PrimaryButton, Icon } from '@/components';
import { colors, spacing, typography } from '@/index';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/featurestacks/AuthStack';
import { useForgotPasswordMutation } from '@/features/authentication/auth.api';
import { FormInput } from '@/components/reusable_components/Inputs/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const { control, handleSubmit, getValues, formState: { isValid } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            await forgotPassword({ email: data.email }).unwrap();
            Alert.alert(
                'Check your email',
                `We've sent a reset code to ${data.email}. Enter it below to reset your password.`,
                [{
                    text: 'Enter Code',
                    onPress: () => navigation.navigate('VerifyCode', {
                        email: data.email,
                        mode: 'reset',
                    }),
                }]
            );
        } catch (error: any) {
            // Backend returns 200 even for non-existent emails for security
            // So any real error here is a server issue
            Alert.alert('Error', error?.data?.error || 'Something went wrong. Please try again.');
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
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Don't worry! Enter your email and we'll send you a reset code.
                    </Text>

                    <FormInput
                        control={control}
                        name="email"
                        label="Email Address"
                        placeholder="your@email.com"
                    />

                    <PrimaryButton
                        title="Send Reset Code"
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
    button: {
        marginTop: spacing.xl,
    },
});
