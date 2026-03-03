import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@/screens/home/Home';

import Review from '@/screens/space/Review';
import Location from '@/screens/auth/Location';
import BookingFlowStack from './BookingFlowStack';
import type { SpaceDetailParam, BookingFlowParam } from '@/navigation/types';

export type HomeStackParamList = BookingFlowParam & {
  Home: undefined;
  Reviews: { spaceId: string };
  Location: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="Reviews" component={Review} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="BookingFlow" component={BookingFlowStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default HomeStack;
