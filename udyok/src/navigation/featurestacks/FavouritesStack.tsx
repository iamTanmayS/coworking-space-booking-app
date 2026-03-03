import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favourites from '@/screens/favourite/Favourites';

import BookingFlowStack from './BookingFlowStack';
import type { SpaceDetailParam, BookingFlowParam } from '@/navigation/types';

export type FavouritesStackParamList = BookingFlowParam & {
  Favourites: undefined;
};

const Stack = createNativeStackNavigator<FavouritesStackParamList>();

const FavouritesStack = () => {
  return (
    <Stack.Navigator initialRouteName="Favourites" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favourites" component={Favourites} />

      <Stack.Screen name="BookingFlow" component={BookingFlowStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default FavouritesStack;
