import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { store } from '@/store/store';
import { addNotification } from '@/features/notifications/notifications.slice';

// Configure how notifications behave when the app is in the foreground
// Skip in Expo Go where this crashes in SDK 53
if (Constants.appOwnership !== 'expo') {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

export class NotificationService {

    /**
     * Request permissions and retrieve Expo Push Token (if using remote later).
     * For local notifications, we primarily just need the permissions.
     */
    static async requestPermissionsAsync(): Promise<boolean> {
        // Expo Go SDK 53+ drops remote push notifications support.
        // If we are in Expo Go, we just return false and bypass native push setup,
        // but our local Redux notifications will still work.
        if (Constants.appOwnership === 'expo') {
            console.log('Running in Expo Go: Bypassing native push notification setup (Not supported in SDK 53). Local feed will still function.');
            return false;
        }

        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications (simulators often lack support)');
            return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return false;
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return true;
    }

    /**
     * Trigger a local push notification
     */
    static async scheduleLocalNotification(title: string, body: string, data: Record<string, any> = {}, delaySeconds = 1) {
        // Only trigger native push if NOT in Expo Go
        if (Constants.appOwnership !== 'expo') {
            try {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title,
                        body,
                        data,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: delaySeconds,
                        repeats: false
                    },
                });
            } catch (e) {
                console.log("Native push failed (usually simulator or permission issue).", e);
            }
        }

        // Add to Redux store feed immediately (works everywhere)
        store.dispatch(addNotification({ title, body, data }));
    }

    /**
     * Schedule a recurring background notification (e.g. every 2-3 hours)
     */
    static async scheduleRecurringReminder(intervalHours: number) {
        const seconds = intervalHours * 60 * 60;

        // Clear any existing recurring notifications with this identifier to avoid duplicates
        // Note: Expo has limited ability to tag recurring notifications easily,
        // normally we'd cancel a specific ID but here we'll just schedule it.
        // A robust app might store the identifier in AsyncStorage and cancel it first.

        // We do *not* dispatch to Redux here synchronously, because this will fire instantly on app launch.
        // If we wanted the reminder in the feed, we should write an Expo Background Fetch task
        // to handle the trigger payload or just keep reminders out of the permanent feed.

        if (Constants.appOwnership === 'expo') {
            console.log("Bypassing recurring native push reminder in Expo Go.");
            return;
        }

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Ready to work?",
                    body: "Book a new workspace nearby and be productive today!",
                    data: { type: 'reminder' },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: seconds,
                    repeats: true
                },
            });
            console.log(`Scheduled recurring reminder every ${intervalHours} hours.`);
        } catch (e) {
            console.log("Failed to schedule recurring notification:", e);
        }
    }


    /* --- Specific Feature Triggers --- */

    static notifyFavoriteAdded(spaceName: string) {
        this.scheduleLocalNotification(
            "❤️ Added to Favorites",
            `${spaceName} has been added to your favorites list.`
        );
    }

    static notifyBookingSuccess(spaceName: string, dateStr: string) {
        this.scheduleLocalNotification(
            "✅ Booking Confirmed",
            `Your booking for ${spaceName} on ${dateStr} is confirmed!`
        );
    }

    static notifyNewChatMessage(senderName: string, messagePreview: string) {
        this.scheduleLocalNotification(
            `💬 New Message from ${senderName}`,
            messagePreview
        );
    }
}
