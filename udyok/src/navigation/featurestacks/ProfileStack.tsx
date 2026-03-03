import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '@/screens/profile/Profile';
import Wallet from '@/screens/profile/Wallet';
import Settings from '@/screens/profile/Settings';
import Logout from '@/screens/profile/Logout';
import BookingManagementStack from './BookingManagementStack';
import AddCard from '@/screens/booking/AddCard';

import EditProfile from '@/screens/profile/EditProfile';
import AddMoney from '@/screens/profile/AddMoney';
import PaymentMethods from '@/screens/profile/PaymentMethods';
import TopUpSuccess from '@/screens/profile/TopUpSuccess';
import HelpCenter from '@/screens/profile/HelpCenter';
import PasswordManager from '@/screens/profile/PasswordManager';

export type ProfileStackParamList = {
  Profile: undefined;
  Wallet: undefined;
  Settings: undefined;
  Logout: undefined;
  BookingManagement: undefined;
  AddCard: undefined;
  EditProfile: undefined;
  AddMoney: undefined;
  PaymentMethods: undefined;
  TopUpSuccess: undefined;
  HelpCenter: undefined;
  PasswordManager: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="BookingManagement" component={BookingManagementStack} options={{ headerShown: false }} />
      <Stack.Screen name="AddCard" component={AddCard} />
      <Stack.Screen name="AddMoney" component={AddMoney} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="TopUpSuccess" component={TopUpSuccess} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} />
      <Stack.Screen name="PasswordManager" component={PasswordManager} />

    </Stack.Navigator>
  );
};

export default ProfileStack;
