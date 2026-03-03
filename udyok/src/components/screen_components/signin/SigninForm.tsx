import { StyleSheet, View, Alert, Text, Pressable } from 'react-native'
import React from 'react'
import { FormInput } from '@/components/reusable_components/Inputs/FormInput'
import { LoginSchema, LoginSchemaType } from '@/validation/auth.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton'
import PasswordInput from '@/components/reusable_components/Inputs/PaswordInput'
import { colors, spacing, typography } from '@/index'
import { useSignInViewModel } from '@/viewmodels/authentication/SignInViewModel'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '@/navigation/featurestacks/AuthStack'

const SigninForm = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, "SignIn">>()
    const { handleSignIn, isLoading } = useSignInViewModel()
    const { control, handleSubmit } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            await handleSignIn(data)
        } catch (error: any) {
            console.error("Login failed", error)
            // Handle 429 Rate Limit which is returned as plain text by Render
            if (error?.originalStatus === 429 || error?.data?.includes?.("Too Many Requests")) {
                Alert.alert("Too Many Requests", "Please wait a moment and try again.");
            } else if (error?.data?.error === 'UNVERIFIED_EMAIL' || error?.data?.error === 'Please verify your email before logging in') {
                Alert.alert(
                    "Email Unverified",
                    error?.data?.message || "Please verify your email before logging in.",
                    [
                        {
                            text: "Verify Now",
                            onPress: () => navigation.navigate('VerifyCode', { email: data.email })
                        },
                        {
                            text: "Cancel",
                            style: "cancel"
                        }
                    ]
                );
            } else {
                Alert.alert("Login Failed", error?.data?.message || error?.error || error?.data?.error || "An unexpected error occurred. Please try again.");
            }
        }
    }

    return (
        <View style={styles.container}>
            <FormInput
                control={control}
                name="email"
                label="Email"
                placeholder="tanmay@gmail.com"
            />

            <PasswordInput
                control={control}
                name="password"
                label="Password"
                placeholder="***************"
            />

            <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            <PrimaryButton
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                fullWidth
                size="lg"
                style={styles.button}
            />
        </View>
    )
}

export default SigninForm

const styles = StyleSheet.create({
    container: {
        // Padding handled by parent
    },
    forgotContainer: {
        alignSelf: 'flex-end',
        marginTop: spacing.xs,
        marginBottom: spacing.xs,
    },
    forgotText: {
        fontSize: typography.fontSize.sm,
        color: colors.primary,
        fontFamily: typography.fontFamily.medium,
    },
    button: {
        marginTop: spacing.xl,
    }
})
