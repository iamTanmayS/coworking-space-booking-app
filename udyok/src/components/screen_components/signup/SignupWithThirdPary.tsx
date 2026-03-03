import { StyleSheet, Pressable, View, Text } from 'react-native'
import React from 'react'
import Icon from '@/components/reusable_components/icons/Icon'
import { colors, spacing, radius, typography } from '@/index'
import { moderateScale } from 'react-native-size-matters'

import { useGoogleSignInViewModel } from '@/viewmodels/authentication/useGoogleSignInViewModel'

interface Props {
    dividerText?: string;
}

const SignupWithThirdPary = ({ dividerText = "Or sign up with" }: Props) => {
    const { promptAsync, isLoading, isGoogleSignInAvailable } = useGoogleSignInViewModel();

    return (
        <View style={styles.container}>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>{dividerText}</Text>
                <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
                <Pressable
                    onPress={() => promptAsync()}
                    disabled={isLoading}
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && styles.pressed,
                        isLoading && { opacity: 0.5 }
                    ]}
                >
                    <Icon library="fontawesome" name="apple" size="lg" color={colors.textPrimary} />
                </Pressable>
                <Pressable
                    onPress={() => promptAsync()}
                    disabled={isLoading}
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && styles.pressed,
                        (isLoading || !isGoogleSignInAvailable) && { opacity: 0.4 }
                    ]}
                >
                    <Icon library="fontawesome" name="google" size="lg" color={colors.textPrimary} />
                </Pressable>
                <Pressable
                    onPress={() => promptAsync()}
                    disabled={isLoading}
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && styles.pressed,
                        isLoading && { opacity: 0.5 }
                    ]}
                >
                    <Icon library="fontawesome" name="facebook" size="lg" color={colors.textPrimary} />
                </Pressable>
            </View>
        </View>
    )
}

export default SignupWithThirdPary

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.md,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        marginHorizontal: spacing.md,
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.regular,
        color: colors.textSecondary,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        width: moderateScale(56),
        height: moderateScale(56),
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.sm,
        backgroundColor: colors.background,
    },
    pressed: {
        opacity: 0.7,
        backgroundColor: colors.surface,
    },
})