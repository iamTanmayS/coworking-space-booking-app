import { Platform, Text, View } from 'react-native'

import ChatStack from '@/navigation/featurestacks/ChatStack';
import ExploreStack from '@/navigation/featurestacks/ExploreStack';
import FavouritesStack from '@/navigation/featurestacks/FavouritesStack';
import HomeStack from '@/navigation/featurestacks/Homestack';
import ProfileStack from '@/navigation/featurestacks/ProfileStack';
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, spacing, radius, typography } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';

export type MaintabParamList = {
  HomeStack: undefined;
  ExploreStack: undefined;
  FavouritesStack: undefined;
  ChatStack: undefined;
  ProfileStack: undefined;
}
const Maintab = () => {

  const Tab = createBottomTabNavigator<MaintabParamList>();

  return (
    <Tab.Navigator
      initialRouteName='HomeStack'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 92 : 72,
          paddingBottom: Platform.OS === 'ios' ? 34 : 16,
          paddingTop: 10,
          borderRadius: radius.xl,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: typography.fontFamily.medium,
          marginTop: 2,
          marginBottom: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'HomeStack':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ExploreStack':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'FavouritesStack':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'ChatStack':
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              break;
            case 'ProfileStack':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Icon library="ionicons" name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name='HomeStack' component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name='ExploreStack' component={ExploreStack} options={{ tabBarLabel: 'Explore' }} />
      <Tab.Screen name='FavouritesStack' component={FavouritesStack} options={{ tabBarLabel: 'Favorites' }} />
      <Tab.Screen name='ChatStack' component={ChatStack} options={{ tabBarLabel: 'Chat' }} />
      <Tab.Screen name='ProfileStack' component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  )
}

export default Maintab