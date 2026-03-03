import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { useGoogleLoginMutation } from '@/features/authentication/auth.api';
import { useAppDispatch } from '@/store/store';
import { setTokens } from '@/features/authentication/Auth.slice';
import { useNavigation } from '@react-navigation/native';

// Google Client ID (Web Client ID for backend token exchange)
const WEB_CLIENT_ID = '70421937215-agisouqhtaomm47c6t6d7j4f179u841m.apps.googleusercontent.com';

// Lazily load the native Google Sign-in module.
// Using a dynamic require() inside a try-catch prevents the app from crashing
// in Expo Go or any environment where the native binary isn't compiled in.
// The RNGoogleSignIn TurboModule only exists after a custom dev-client or APK build.
let GoogleSignin: any = null;
let statusCodes: any = {};
let isNativeModuleAvailable = false;

try {
    const pkg = require('@react-native-google-signin/google-signin');
    GoogleSignin = pkg.GoogleSignin;
    statusCodes = pkg.statusCodes;
    isNativeModuleAvailable = true;
} catch (_) {
    // Native module not available — running in Expo Go or simulator without native build
    isNativeModuleAvailable = false;
}

export const useGoogleSignInViewModel = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const [googleLogin, { isLoading }] = useGoogleLoginMutation();

    useEffect(() => {
        if (!isNativeModuleAvailable || !GoogleSignin) return;

        // Initialize the native Google Sign-in SDK on mount
        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: true,
        });
    }, []);

    const promptAsync = async () => {
        // Guard: show a helpful message if running in Expo Go
        if (!isNativeModuleAvailable) {
            Alert.alert(
                'Not Available in Expo Go',
                'Google Sign-In requires a custom development build or APK. ' +
                'Please build with EAS and test on the APK.',
                [{ text: 'OK' }]
            );
            return;
        }

        try {
            await GoogleSignin.hasPlayServices();

            // Sign out first to clear cached session so the account picker always shows
            await GoogleSignin.signOut();

            // Trigger the native Google Play Services bottom-sheet UI
            const userInfo = await GoogleSignin.signIn();

            // In @react-native-google-signin v13+, idToken is inside the data property
            const idToken = userInfo.data?.idToken;

            if (idToken) {
                await handleGoogleBackendLogin(idToken);
            } else {
                console.error('No ID token present in Google Signin response');
                Alert.alert('Sign-In Error', 'Could not retrieve credentials from Google. Please try again.');
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled — do nothing silently
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Sign in is already in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services are not available on this device.');
            } else {
                console.error('Google Sign-In Error:', error);
                Alert.alert('Sign-In Error', 'Google Sign-In failed. Please try again.');
            }
        }
    };

    const handleGoogleBackendLogin = async (idToken: string) => {
        try {
            const result = await googleLogin({ idToken }).unwrap();

            if (result.accessToken && result.refreshToken) {
                dispatch(setTokens({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                }));
                // Navigation handled automatically by RootStackNavigator watching isAuthenticated
            } else {
                Alert.alert('Sign-In Error', 'Authentication failed. Please try again.');
            }
        } catch (error: any) {
            console.error('Backend Auth Error via Google Token:', error);
            const message = error?.data?.error || 'Failed to sign in with Google. Please try again.';
            Alert.alert('Sign-In Failed', message);
        }
    };

    return {
        promptAsync,
        isLoading,
        // Expose whether the native module is available so the UI can optionally
        // hide or dim the Google Sign-In button in Expo Go
        isGoogleSignInAvailable: isNativeModuleAvailable,
    };
};
