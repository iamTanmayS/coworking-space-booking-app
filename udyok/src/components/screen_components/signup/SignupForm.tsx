import { StyleSheet, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { FormInput } from '@/components/reusable_components/Inputs/FormInput'
import { SignupSchema, SignupSchemaType } from '@/validation/auth.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton'
import PasswordInput from '@/components/reusable_components/Inputs/PaswordInput'
import Icon from '@/components/reusable_components/icons/Icon'
import TermsAndCondition from '@/components/screen_components/signup/TANDC'
import { colors, spacing } from '@/index'
import { useSignUpViewModel } from '@/viewmodels/authentication/SignUpFormViewModel'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '@/navigation/featurestacks/AuthStack'


const SignupForm = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, "CreateAccount">>()
    const { handleSignUp } = useSignUpViewModel()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { control, handleSubmit } = useForm<SignupSchemaType>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            termsAndConditions: false,
        }
    })

    const onSubmit = async (data: SignupSchemaType) => {
        setIsSubmitting(true)
        try {
            await handleSignUp(data)
            navigation.navigate('VerifyCode', { email: data.email })
        } catch (error: any) {
            console.log("Signup Error:", error)
            const errorMsg = error?.data?.error || error?.data?.message || "";
            if (errorMsg.includes("already in use") || errorMsg.includes("already registered")) {
                Alert.alert(
                    "Account Exists",
                    "An account with this email is already registered.",
                    [
                        { text: "Sign In Instead", onPress: () => navigation.navigate('SignIn') },
                        { text: "Cancel", style: "cancel" }
                    ]
                )
            } else {
                Alert.alert("Signup Failed", errorMsg || "Something went wrong.");
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View style={styles.container}>
            <FormInput
                control={control}
                name="name"
                label="Name"
                placeholder="Tanmay Shukla"
            />
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

            <TermsAndCondition
                control={control}
                name="termsAndConditions"
            />

            <PrimaryButton
                title="Sign Up"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                fullWidth
                size="lg"
            />
        </View>
    )
}

export default SignupForm

const styles = StyleSheet.create({
    container: {
        // Padding handled by parent screen
    }
})