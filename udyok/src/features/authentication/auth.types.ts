// Authentication API types

import { User } from "../user/user.types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    phone?: string;

}

export interface RegisterResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    email: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface VerifyCodeRequest {
    email: string;
    otp: string;
}

export interface VerifyCodeResponse {
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface ResendCodeRequest {
    email: string;
}

export interface ResendCodeResponse {
    message: string;
}

export interface GoogleLoginRequest {
    idToken: string;
}

export interface GoogleLoginResponse {
    accessToken: string;
    refreshToken: string;
    message: string;
}
