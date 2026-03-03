import { useRegisterMutation } from "@/features/authentication/auth.api";
import { SignupSchemaType } from "@/validation/auth.schema";

export const useSignUpViewModel = () => {
    const [register, { isLoading, error, isSuccess }] = useRegisterMutation();

    const handleSignUp = async (data: SignupSchemaType) => {
        try {
            const result = await register({
                name: data.name,
                email: data.email,
                password: data.password,
            }).unwrap();
            return result;

        } catch (err) {
            console.error("Registration failed", err);
            throw err;
        }
    };

    return {
        handleSignUp,
        isLoading,
        error,
        isSuccess
    };
};
