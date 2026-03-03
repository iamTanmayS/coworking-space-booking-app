import { View, Text, StyleSheet, TextInput, Pressable, Platform, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import { Svg, Circle, Path } from 'react-native-svg';
import { useState } from 'react';
import { useAppSelector } from '@/store/store';

const { height } = Dimensions.get('window');

export interface HomeHeaderProps {
    location?: string;
    onSearch?: (query: string) => void;
    onFilterPress?: () => void;
    onNotificationPress?: () => void;
    onLocationPress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
    location = 'Bengaluru, India',
    onSearch,
    onFilterPress,
    onNotificationPress,
    onLocationPress,
}) => {
    const insets = useSafeAreaInsets();
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
    const topPadding = insets.top > 0 ? insets.top : statusBarHeight + spacing.md;

    const [searchQuery, setSearchQuery] = useState('');

    // Subscribe to notifications state to get unread count
    const notifications = useAppSelector(state => state.notifications?.items || []);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleSearchPress = () => {
        if (searchQuery.trim() && onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: topPadding }]}>
            {/* Background Pattern */}
            <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width="100%">
                    <Circle cx="90%" cy="20%" r="120" fill="rgba(255,255,255,0.05)" />
                    <Circle cx="10%" cy="60%" r="80" fill="rgba(255,255,255,0.03)" />
                    <Path
                        d="M0,100 Q50,150 100,100 T200,100"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="4"
                    />
                </Svg>
            </View>

            <View style={styles.content}>
                {/* Top Section */}
                <View style={styles.topSection}>
                    <Pressable onPress={onLocationPress} style={styles.locationContainer}>
                        <Text style={styles.locationLabel}>Location</Text>
                        <View style={styles.locationRow}>
                            <Icon library="ionicons" name="location" size={16} color={colors.textInverse} style={styles.locationIcon} />
                            <Text style={styles.locationText}>{location}</Text>
                            <Icon library="ionicons" name="chevron-down" size={16} color={colors.textInverse} />
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={onNotificationPress}
                        style={styles.notificationButton}
                    >
                        <Icon library="ionicons" name="notifications" size={24} color={colors.textInverse} />
                        {unreadCount > 0 && <View style={styles.notificationBadge} />}
                    </Pressable>
                </View>

                {/* Search Section */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Icon library="ionicons" name="search" size={20} color={colors.primary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Here"
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearchPress}
                            returnKeyType="search"
                            selectionColor={colors.primary}
                        />
                        <Pressable
                            onPress={handleSearchPress}
                            style={({ pressed }) => [
                                styles.searchButton,
                                { opacity: pressed ? 0.8 : 1 }
                            ]}
                        >
                            <Icon library="ionicons" name="search" size={20} color={colors.textInverse} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        borderBottomLeftRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        height: height * 0.24,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    content: {
        paddingTop: spacing.xs,
        flex: 1,
        justifyContent: 'space-between', // Distribute space between top and search
        paddingBottom: spacing.lg,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    locationContainer: {
        flex: 1,
    },

    locationLabel: {
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.medium,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        marginRight: 4,
    },
    locationText: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.semiBold,
        color: colors.textInverse,
        marginRight: 4,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4D4D',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    searchContainer: {
        flex: 1,
        height: 52,
        backgroundColor: colors.background,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily.medium,
        color: colors.textPrimary,
    },
    searchButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    filterButton: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeHeader;
