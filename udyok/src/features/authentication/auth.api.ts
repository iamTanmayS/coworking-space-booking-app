// Authentication API
import { baseApi } from '../../api/base.api';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    VerifyCodeRequest,
    VerifyCodeResponse,
    ResendCodeRequest,
    ResendCodeResponse,
    GoogleLoginRequest,
    GoogleLoginResponse,
} from './auth.types';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),

        forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),

        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),

        verifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
            query: (data) => ({
                url: '/auth/verify-email',
                method: 'POST',
                body: data,
            }),
        }),

        resendCode: builder.mutation<ResendCodeResponse, ResendCodeRequest>({
            query: (data) => ({
                url: '/auth/resend-code',
                method: 'POST',
                body: data,
            }),
        }),
        googleLogin: builder.mutation<GoogleLoginResponse, GoogleLoginRequest>({
            query: (data) => ({
                url: '/auth/google',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyCodeMutation,
    useResendCodeMutation,
    useGoogleLoginMutation,
} = authApi;
