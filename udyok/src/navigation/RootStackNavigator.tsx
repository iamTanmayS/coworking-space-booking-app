import AuthStack from '@/navigation/featurestacks/AuthStack'
import Maintab from '@/navigation/tabs/Maintab'
import BookingFlowStack from '@/navigation/featurestacks/BookingFlowStack'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAppSelector, useAppDispatch } from '@/store/store';
import Location from '@/screens/auth/Location';
import SpaceDetail from '@/screens/space/SpaceDetail';
import { SpaceDetailParam } from '@/navigation/types';
import { useGetProfileQuery } from '@/features/user/user.api';
import { setUserProfile } from '@/features/user/User.slice';

export type RootStackParamList = {
  MainTabs: undefined;
  AuthStack: undefined;
  Location: undefined;
  SpaceDetail: SpaceDetailParam['SpaceDetail'];
  BookingFlowStack: undefined;
}

const RootStackNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.user);

  // Fetch user profile if authenticated but no profile exists
  const { data: userProfile, isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (userProfile) {
      dispatch(setUserProfile(userProfile));
    }
  }, [userProfile, dispatch]);

  // Determine which screen to show
  const getInitialScreen = () => {
    console.log('=== RootStackNavigator Debug ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('profile:', profile);
    console.log('profile?.location:', profile?.location);
    console.log('isProfileLoading:', isProfileLoading);

    if (!isAuthenticated) {
      console.log('→ Showing AuthStack (not authenticated)');
      return <Stack.Screen name="AuthStack" component={AuthStack} />;
    }

    if (isProfileLoading && !profile) {
      // Could return a loading screen here, but returning null or keeping current screen is fine
      console.log('→ Waiting for profile to load');
    }

    // Check if user needs to complete location
    if (profile && !profile?.location) {
      console.log('→ Showing Location screen (no location)');
      return <Stack.Screen name="Location" component={Location} />;
    }

    // User is fully onboarded, show main app
    if (profile && profile?.location) {
      console.log('→ Showing MainTabs (fully onboarded)');
      return (
        <React.Fragment>
          <Stack.Screen name="MainTabs" component={Maintab} />
          <Stack.Screen name="SpaceDetail" component={SpaceDetail} />
          <Stack.Screen name="BookingFlowStack" component={BookingFlowStack} />
        </React.Fragment>
      );
    }

    // Default fallback while loading
    return <Stack.Screen name="AuthStack" component={AuthStack} />;
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {getInitialScreen()}
    </Stack.Navigator>
  )
}

export default RootStackNavigator

