// RTK Query API Usage Examples
// This file demonstrates how to use the RTK Query APIs in your React Native components

import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';

// Import API hooks
import { useLoginMutation, useRegisterMutation } from '../features/authentication/auth.api';
import { useGetProfileQuery, useUpdateProfileMutation } from '../features/user/user.api';
import { useGetBookingsQuery, useCreateBookingMutation } from '../features/booking/booking.api';
import { useGetSpacesQuery, useGetSpaceQuery } from '../features/spaces/spaces.api';
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '../features/favorites/favorites.api';
import { useGetBalanceQuery } from '../features/wallet/wallet.api';
import { useGetChatsQuery, useGetMessagesQuery } from '../features/chat/chat.api';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../features/settings/settings.api';

// Import actions
import { setTokens, logout } from '../features/authentication/Auth.slice';
import { logoutThunk } from '../features/authentication/auth.actions';
import { baseApi } from './base.api';
/**
 * Example 1: Authentication - Login
 */
export const LoginExample = () => {
    const dispatch = useDispatch();
    const [login, { isLoading, error }] = useLoginMutation();

    const handleLogin = async () => {
        try {
            const result = await login({
                email: 'user@example.com',
                password: 'password123',
            }).unwrap();

            // Store tokens in Redux
            dispatch(setTokens({
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }));

            // Navigate to home screen
            console.log('Login successful:', result.user);
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <View>
            <Button title="Login" onPress={handleLogin} disabled={isLoading} />
            {isLoading && <ActivityIndicator />}
            {error && <Text>Error: {JSON.stringify(error)}</Text>}
        </View>
    );
};

/**
 * Example 2: Logout (Local-first, with storage purge and cache reset)
 */
export const LogoutExample = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        // Use the global logout thunk for a clean wipe
        dispatch(logoutThunk() as any);
        // Navigate to login screen
    };

    return <Button title="Logout" onPress={handleLogout} />;
};

/**
 * Example 3: Fetching User Profile
 */
export const ProfileExample = () => {
    const { data: profile, isLoading, error, refetch } = useGetProfileQuery();

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error loading profile</Text>;

    return (
        <View>
            <Text>Name: {profile?.name}</Text>
            <Text>Email: {profile?.email}</Text>
            <Button title="Refresh" onPress={refetch} />
        </View>
    );
};

/**
 * Example 4: Updating User Profile
 */
export const UpdateProfileExample = () => {
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const handleUpdate = async () => {
        try {
            await updateProfile({
                name: 'New Name',
                location: { latitude: 0, longitude: 0, city: 'New City', country: 'Country' },
            }).unwrap();

            console.log('Profile updated successfully');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return <Button title="Update Profile" onPress={handleUpdate} disabled={isLoading} />;
};

/**
 * Example 5: Fetching Bookings with Filters
 */
export const BookingsExample = () => {
    const { data: bookings, isLoading } = useGetBookingsQuery({
        status: 'confirmed',
        startDate: '2024-01-01',
    });

    if (isLoading) return <ActivityIndicator />;

    return (
        <View>
            {bookings?.map((booking) => (
                <Text key={booking.id}>{booking.startDate} - {booking.status}</Text>
            ))}
        </View>
    );
};

/**
 * Example 6: Creating a Booking
 */
export const CreateBookingExample = () => {
    const [createBooking, { isLoading }] = useCreateBookingMutation();

    const handleCreateBooking = async () => {
        try {
            const newBooking = await createBooking({
                spaceId: 'space-123',
                startDate: '2024-03-15',
                endDate: '2024-03-15',
                startTime: '14:00',
                endTime: '16:00',
                notes: 'Meeting room for team discussion',
            }).unwrap();

            console.log('Booking created:', newBooking);
        } catch (err) {
            console.error('Booking failed:', err);
        }
    };

    return <Button title="Create Booking" onPress={handleCreateBooking} disabled={isLoading} />;
};

/**
 * Example 7: Fetching Spaces with Pagination
 */
export const SpacesExample = () => {
    const { data, isLoading } = useGetSpacesQuery({
        page: 1,
        limit: 10,
        minPrice: 100,
        maxPrice: 500,
    });

    if (isLoading) return <ActivityIndicator />;

    return (
        <View>
            <Text>Total: {data?.total} spaces</Text>
            {data?.data.map((space) => (
                <Text key={space.id}>{space.name} - ${space.pricePerHour}</Text>
            ))}
        </View>
    );
};

/**
 * Example 8: Favorites with Optimistic Updates
 */
export const FavoritesExample = () => {
    const { data: favorites } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    const handleToggleFavorite = async (spaceId: string) => {
        const isFavorite = favorites?.data.some(s => s.id === spaceId);

        try {
            if (isFavorite) {
                // Optimistic update - UI updates immediately
                await removeFavorite(spaceId).unwrap();
            } else {
                await addFavorite(spaceId).unwrap();
            }
        } catch (err) {
            // Optimistic update is automatically rolled back on error
            console.error('Failed to toggle favorite:', err);
        }
    };

    return (
        <View>
            <Button title="Toggle Favorite" onPress={() => handleToggleFavorite('space-123')} />
        </View>
    );
};

/**
 * Example 9: Wallet Balance
 */
export const WalletExample = () => {
    const { data: wallet, isLoading } = useGetBalanceQuery();

    if (isLoading) return <ActivityIndicator />;

    return <Text>Balance: ${wallet?.balance}</Text>;
};

/**
 * Example 10: Chat with Optimistic Updates
 */
export const ChatExample = () => {
    const chatId = 'chat-123';
    const { data: messages } = useGetMessagesQuery(chatId);

    const handleSendMessage = async (text: string) => {
        try {
            // Note: chat-service WebSockets are used for sendMessage in actual UI
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    return (
        <View>
            {messages?.map((msg: any) => (
                <Text key={msg._id}>{msg.text}</Text>
            ))}
            <Button
                title="Send"
                onPress={() => handleSendMessage('Hello!')}
            />
        </View>
    );
};

/**
 * Example 11: Settings
 */
export const SettingsExample = () => {
    const { data: settings } = useGetSettingsQuery();
    const [updateSettings] = useUpdateSettingsMutation();

    const handleToggleTheme = async () => {
        try {
            await updateSettings({
                theme: settings?.theme === 'light' ? 'dark' : 'light',
            }).unwrap();
        } catch (err) {
            console.error('Failed to update settings:', err);
        }
    };

    return (
        <View>
            <Text>Current theme: {settings?.theme}</Text>
            <Button title="Toggle Theme" onPress={handleToggleTheme} />
        </View>
    );
};

/**
 * Example 12: Conditional Fetching (Skip)
 */
export const ConditionalFetchExample = ({ userId }: { userId?: string }) => {
    // Only fetch if userId is provided
    const { data: profile } = useGetProfileQuery(undefined, {
        skip: !userId,
    });

    return <Text>{profile?.name || 'No user selected'}</Text>;
};

/**
 * Example 13: Polling for Updates
 */
export const PollingExample = () => {
    // Refetch balance every 30 seconds
    const { data: wallet } = useGetBalanceQuery(undefined, {
        pollingInterval: 30000,
    });

    return <Text>Balance: ${wallet?.balance}</Text>;
};

/**
 * Example 14: Manual Cache Invalidation
 */
export const ManualInvalidationExample = () => {
    const dispatch = useDispatch();
    const { refetch } = useGetBookingsQuery();

    const handleRefresh = () => {
        // Manually refetch bookings
        refetch();

        // Or invalidate all booking tags
        // dispatch(bookingApi.util.invalidateTags(['Booking']));
    };

    return <Button title="Refresh Bookings" onPress={handleRefresh} />;
};
