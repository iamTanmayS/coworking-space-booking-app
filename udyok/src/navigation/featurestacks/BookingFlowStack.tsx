import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Booking from '@/screens/booking/Booking';
import ReviewSummary from '@/screens/booking/ReviewSummary';
import PaymentMethod from '@/screens/booking/PaymentMethod';
import AddCard from '@/screens/booking/AddCard';
import PaymentSuccess from '@/screens/booking/PaymentSuccess';
import EReceipt from '@/screens/booking/EReceipt';

export type BookingFlowParamList = {
  Booking: undefined;
  ReviewSummary: undefined;
  PaymentMethod: undefined;
  AddCard: undefined;
  PaymentSuccess: undefined;
  EReceipt: {
    bookingId: string;
    spaceName: string;
    totalAmount: number;
    duration: number;
    date: string;
    startTime: string;
    endTime: string;
    paymentLabel: string;
    fees: number;
  };
};

const Stack = createNativeStackNavigator<BookingFlowParamList>();

const BookingFlowStack = () => {
  return (
    <Stack.Navigator initialRouteName="Booking" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="AddCard" component={AddCard} />
      <Stack.Screen name="ReviewSummary" component={ReviewSummary} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="EReceipt" component={EReceipt} />
    </Stack.Navigator>
  );
};

export default BookingFlowStack;
