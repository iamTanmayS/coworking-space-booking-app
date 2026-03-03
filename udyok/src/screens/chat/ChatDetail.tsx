import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChatDetailViewModel } from '@/viewmodels/chat/useChatViewModel';
import { useGetChatsQuery } from '@/features/chat/chat.api';
import { colors, spacing, typography, radius } from '@/index';
import { Icon } from '@/components';
import type { Message } from '@/features/chat/chat.types';
import type { ChatStackParamList } from '@/navigation/featurestacks/ChatStack';
import { useAppSelector } from '@/store/store';

type ChatDetailRouteProp = RouteProp<ChatStackParamList, 'ChatDetail'>;
type ChatDetailNavProp = NativeStackNavigationProp<ChatStackParamList, 'ChatDetail'>;

const decodeUserId = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.userId || payload.id || payload.sub || null;
  } catch { return null; }
};

const MessageBubble = ({ message, currentUserId }: { message: Message; currentUserId: string | null }) => {
  const isMe = message.senderId === currentUserId;
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowOther]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>
          {message.text}
        </Text>
        <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther]}>
          {time}
        </Text>
      </View>
    </View>
  );
};

const ChatDetail = () => {
  const navigation = useNavigation<ChatDetailNavProp>();
  const route = useRoute<ChatDetailRouteProp>();
  const { chatId } = route.params;
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const accessToken = useAppSelector((state: any) => state.auth?.accessToken);
  const currentUserId = decodeUserId(accessToken);
  const { messages, isLoading, isSending, sendMessage, markAsRead } = useChatDetailViewModel(chatId);
  const { data: chats = [] } = useGetChatsQuery();
  const chat = (chats as any[]).find((c: any) => c._id === chatId || c.id === chatId);

  // Get the other participant (not current user)
  const otherParticipant = chat?.participants?.find((p: any) => p.userId !== currentUserId)
    || chat?.participants?.[0];

  const participantName = otherParticipant?.name || chat?.participantName || 'Chat';
  const participantAvatar = otherParticipant?.avatar || chat?.participantAvatar;
  const participantId = otherParticipant?.userId || '';
  const isOnline = otherParticipant?.isOnline || false;

  useEffect(() => {
    markAsRead();
  }, [chatId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    await sendMessage(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" library="ionicons" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={{ uri: participantAvatar || 'https://i.pravatar.cc/150?img=0' }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName} numberOfLines={1}>{participantName}</Text>
            <Text style={styles.headerStatus}>{isOnline ? '🟢 Online' : 'Offline'}</Text>
          </View>
        </View>

        {/* Call Buttons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => navigation.navigate('VoiceCall', {
              chatId,
              participantName,
              participantId,
              isIncoming: false,
            } as any)}
          >
            <Icon name="call" library="ionicons" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => navigation.navigate('VideoCall', {
              chatId,
              participantName,
              participantId,
              isIncoming: false,
            } as any)}
          >
            <Icon name="videocam" library="ionicons" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <MessageBubble message={item} currentUserId={currentUserId} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet. Say hi! 👋</Text>
            </View>
          }
        />
      )}

      {/* Input bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="send" library="ionicons" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  headerName: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: '#fff',
  },
  headerStatus: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: 16,
  },
  bubbleRow: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
  },
  bubbleRowMe: {
    justifyContent: 'flex-end',
  },
  bubbleRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: '#fff',
  },
  bubbleTextOther: {
    color: colors.textPrimary,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  bubbleTimeOther: {
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : spacing.md,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    maxHeight: 100,
  },
  input: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    padding: 0,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatDetail;
