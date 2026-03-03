import { useLoginMutation } from "@/features/authentication/auth.api";
import { setTokens } from "@/features/authentication/Auth.slice";
import { LoginSchemaType } from "@/validation/auth.schema";
import { useDispatch } from "react-redux";
export const useSignInViewModel = () => {
    const dispatch = useDispatch();
    const [login, { isLoading, error, isSuccess }] = useLoginMutation();

    const handleSignIn = async (data: LoginSchemaType) => {
        try {
            const result = await login({
                email: data.email,
                password: data.password,
            }).unwrap();
            if (result.accessToken) {
                dispatch(setTokens({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                }));
                // Profile is fetched automatically by RootStackNavigator via useGetProfileQuery
            }

            return result;
        } catch (err) {
            console.error("Login failed", err);
            throw err;
        }
    };

    return {
        handleSignIn,
        isLoading,
        error,
        isSuccess
    };
};
