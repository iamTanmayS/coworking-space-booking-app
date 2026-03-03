import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { markAsRead, markAllAsRead, clearAll } from '@/features/notifications/notifications.slice';
import { colors, spacing, radius, typography } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(state => state.notifications.items);

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
            onPress={() => dispatch(markAsRead(item.id))}
        >
            <View style={styles.iconContainer}>
                {/* Dynamically pick icon based on title/type keyword */}
                {item.title.includes('Booking') ? (
                    <Icon name="calendar-outline" library="ionicons" size={24} color={colors.primary} />
                ) : item.title.includes('Favorite') ? (
                    <Icon name="heart-outline" library="ionicons" size={24} color={colors.error} />
                ) : item.title.includes('Message') ? (
                    <Icon name="chatbubble-outline" library="ionicons" size={24} color="#4CAF50" />
                ) : (
                    <Icon name="notifications-outline" library="ionicons" size={24} color={colors.primary} />
                )}
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, !item.isRead && styles.unreadText]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.date}>{formatDate(item.date)}</Text>
                </View>
                <Text style={styles.bodyText} numberOfLines={2}>
                    {item.body}
                </Text>
            </View>

            {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { marginTop: Platform.OS === 'android' ? statusBarHeight : 0 }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" library="ionicons" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>

                {notifications.length > 0 && (
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => dispatch(markAllAsRead())}>
                            <Icon name="checkmark-done" library="ionicons" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => dispatch(clearAll())} style={{ marginLeft: spacing.md }}>
                            <Icon name="trash-outline" library="ionicons" size={24} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="notifications-off-outline" library="ionicons" size={64} color={colors.textSecondary} />
                    <Text style={styles.emptyTitle}>No Notifications</Text>
                    <Text style={styles.emptyText}>You're all caught up!</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        paddingTop: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    headerTitle: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: typography.fontSize.xl,
        color: colors.textPrimary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listContent: {
        padding: spacing.md,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    unreadCard: {
        backgroundColor: '#F0F8FF', // Light blue tint
        borderColor: '#BBE1FA',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: radius.full,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        flex: 1,
        fontFamily: typography.fontFamily.semiBold,
        fontSize: typography.fontSize.sm,
        color: colors.textPrimary,
        marginRight: spacing.sm,
    },
    unreadText: {
        fontFamily: typography.fontFamily.bold,
        color: colors.primary,
    },
    date: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
    },
    bodyText: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        alignSelf: 'center',
        marginLeft: spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyTitle: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: typography.fontSize.lg,
        color: colors.textPrimary,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    emptyText: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
    }
});
