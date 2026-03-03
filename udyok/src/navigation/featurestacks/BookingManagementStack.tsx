import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyBookings from '@/screens/booking/MyBookings';
import BookingDetail from '@/screens/booking/BookingDetail';
import ETicket from '@/screens/booking/ETicket';
import EReceipt from '@/screens/booking/EReceipt';
import SpaceTimer from '@/screens/booking/SpaceTimer';
import ExtendTimer from '@/screens/booking/ExtendTimer';
import CancelBooking from '@/screens/booking/CancelBooking';

export type BookingManagementParamList = {
  MyBookings: undefined;
  BookingDetail: { bookingId: string };
  ETicket: { bookingId: string };
  EReceipt: { bookingId: string };
  SpaceTimer: { bookingId: string };
  ExtendTimer: { bookingId: string };
  CancelBooking: { bookingId: string };
};

const Stack = createNativeStackNavigator<BookingManagementParamList>();

const BookingManagementStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyBookings" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyBookings" component={MyBookings} />
      <Stack.Screen name="BookingDetail" component={BookingDetail} />
      <Stack.Screen name="ETicket" component={ETicket} />
      <Stack.Screen name="EReceipt" component={EReceipt} />
      <Stack.Screen name="SpaceTimer" component={SpaceTimer} />
      <Stack.Screen name="ExtendTimer" component={ExtendTimer} />
      <Stack.Screen name="CancelBooking" component={CancelBooking} />
    </Stack.Navigator>
  );
};

export default BookingManagementStack;
