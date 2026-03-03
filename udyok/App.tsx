import { Text, View } from 'react-native';
import { persistor, store } from '@/store/store';
import { NavigationContainer } from '@react-navigation/native'

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import RootStackNavigator from '@/navigation/RootStackNavigator';
import { SocketProvider } from '@/features/chat/SocketContext';
import { StatusBar } from 'expo-status-bar';
import { linking } from "@/navigation/Linking"
import { StripeProvider } from '@stripe/stripe-react-native';
import { useEffect } from 'react';
import { NotificationService } from '@/services/NotificationService';

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermissions = await NotificationService.requestPermissionsAsync();
      if (hasPermissions) {
        // Schedule the 2-hour recurring notification for booking a space
        await NotificationService.scheduleRecurringReminder(2);
      }
    };

    setupNotifications();
  }, []);

  return (
    <>
      <StatusBar style="auto" />



      <StripeProvider publishableKey='pk_test_51T1xIyC4kGkF8KRyKObyKq8Pb8K02ha2LljfcK4YJQ5bN4g1et205NC5TXwkDd62V3TIpz3i0e0Mqg4Ea7bTYrUM00NPSQJ6wW'>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer linking={linking}>
              <SocketProvider>
                <RootStackNavigator />
              </SocketProvider>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </StripeProvider>




    </>
  );
}
