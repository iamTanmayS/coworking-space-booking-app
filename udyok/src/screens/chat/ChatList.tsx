import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChatListViewModel } from '@/viewmodels/chat/useChatViewModel';
import { colors, spacing, typography, radius } from '@/index';
import { Icon } from '@/components';
import type { UIChat } from '@/viewmodels/chat/useChatViewModel';
import type { ChatStackParamList } from '@/navigation/featurestacks/ChatStack';

type ChatListNavProp = NativeStackNavigationProp<ChatStackParamList, 'ChatList'>;

const ChatItem = ({ item, onPress }: { item: UIChat; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress} activeOpacity={0.7}>
      {/* Avatar with online indicator */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: item.participantAvatar || 'https://i.pravatar.cc/150?img=0' }}
          style={styles.avatar}
        />
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      {/* Name + last message */}
      <View style={styles.chatInfo}>
        <Text style={styles.participantName} numberOfLines={1}>{item.participantName}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage || 'No messages yet'}</Text>
      </View>

      {/* Time + unread badge */}
      <View style={styles.chatMeta}>
        <Text style={styles.time}>{item.lastMessageTime || ''}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ChatList = () => {
  const navigation = useNavigation<ChatListNavProp>();
  const { chats, isLoading, searchQuery, setSearchQuery } = useChatListViewModel();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search bar inside header */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Icon name="search" library="ionicons" size={18} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Operator"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat list */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatItem
                item={item}
                onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
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
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: '#fff',
  },
  searchWrapper: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: 40, // Increased bottom padding
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 12, // Increased vertical padding
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    padding: 0,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24, // Pulled up to overlap slightly less or more naturally
    paddingTop: 16, // More padding top for the list
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  separator: {
    height: spacing.sm,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#eee',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  lastMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  chatMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  time: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ChatList;
