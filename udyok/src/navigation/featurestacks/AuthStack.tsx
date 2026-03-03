import CompleteProfile from '@/screens/auth/CompleteProfile';
import CreateAccount from '@/screens/auth/CreateAccount';
import EnableNotification from '@/screens/auth/EnableNotification';
import ForgotPassword from '@/screens/auth/ForgotPassword';
import Location from '@/screens/auth/Location';
import NewPassword from '@/screens/auth/NewPassword';
import React from 'react';
import SignIn from '@/screens/auth/SignIn';
import VerifyCode from '@/screens/auth/VerifyCode';
import AppTour from '@/screens/onboarding/AppTour';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '@/screens/onboarding/GetStarted';

export type AuthStackParamList = {

  Getstarted: undefined;
  AppTour: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
  VerifyCode: { email: string; mode?: 'verify' | 'reset' };
  ForgotPassword: undefined;
  NewPassword: { email: string; otp: string };
  Profile: undefined;
  EnableNotification: undefined;
  Location: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Getstarted" screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Getstarted" component={GetStarted} />
      <Stack.Screen name="AppTour" component={AppTour} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="VerifyCode" component={VerifyCode} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />

      <Stack.Screen name="Profile" component={CompleteProfile} />
      <Stack.Screen name="EnableNotification" component={EnableNotification} />
      <Stack.Screen name="Location" component={Location} />
    </Stack.Navigator>
  );
};

export default AuthStack;
