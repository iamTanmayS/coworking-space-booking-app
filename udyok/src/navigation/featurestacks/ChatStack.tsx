import ChatDetail from '@/screens/chat/ChatDetail';
import ChatList from '@/screens/chat/ChatList';
import React from 'react';
import VideoCall from '@/screens/chat/VideoCall';
import VoiceCall from '@/screens/chat/VoiceCall';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: { chatId: string };
  VoiceCall: { chatId: string};
  VideoCall: { chatId: string};
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatStack = () => {
  return (
    <Stack.Navigator initialRouteName="ChatList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatDetail" component={ChatDetail} />
      <Stack.Screen name="VoiceCall" component={VoiceCall} />
      <Stack.Screen name="VideoCall" component={VideoCall} />
    </Stack.Navigator>
  );
};

export default ChatStack;
