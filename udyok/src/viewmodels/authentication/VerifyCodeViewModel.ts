import { useVerifyCodeMutation, useResendCodeMutation } from "@/features/authentication/auth.api";
import { otpSchema, OtpSchemaType } from "@/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/store";
import { setTokens } from "@/features/authentication/Auth.slice";

export const useVerifyCodeViewModel = () => {
    const dispatch = useAppDispatch();
    const [verifyCode, { isLoading: isVerifying, error: verifyError, isSuccess: isVerified }] = useVerifyCodeMutation();
    const [resendCode, { isLoading: isResending, error: resendError, isSuccess: isResendSuccess }] = useResendCodeMutation();

    const form = useForm<OtpSchemaType>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    });

    const handleVerify = async (email: string, data: OtpSchemaType) => {
        try {
            const result = await verifyCode({ email, otp: data.otp }).unwrap();

            console.log('OTP Verification result:', result);

            if (result.accessToken) {
                dispatch(setTokens({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                }));
                // Profile is fetched automatically by RootStackNavigator via useGetProfileQuery
            }

            return result;
        } catch (err) {
            console.error("Verification failed", err);
            throw err;
        }
    };

    const handleResend = async (email: string) => {
        try {
            const result = await resendCode({ email }).unwrap();
            return result;
        } catch (err) {
            console.error("Resend failed", err);
            throw err;
        }
    };

    return {
        form,
        handleVerify,
        handleResend,
        isVerifying,
        isResending,
        verifyError,
        resendError,
        isVerified,
        isResendSuccess,
    };
};
