import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Explore from '@/screens/explore/Explore';
import Search from '@/screens/explore/Search';
import Filter from '@/screens/explore/Filter';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';

import BookingFlowStack from './BookingFlowStack';
import type { SpaceDetailParam, BookingFlowParam } from '@/navigation/types';

export type ExploreStackParamList = BookingFlowParam & {
  Explore: undefined;
  Search: undefined;
  Filter: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

const ExploreStack = () => {
  return (
    <Stack.Navigator initialRouteName="Explore" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explore" component={Explore} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      <Stack.Screen name="BookingFlow" component={BookingFlowStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default ExploreStack;
