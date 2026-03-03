import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography, radius } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import BookingCard from '@/components/specific_components/booking/BookingCard';
import WriteReviewModal from '@/components/screen_components/space/WriteReviewModal';
import { useNavigation } from '@react-navigation/native';
import { useBookingViewModel, BookingWithSpace } from '@/viewmodels/booking/useBookingViewModel';
import { useCreateReviewMutation } from '@/features/reviews/reviews.api';

export default function MyBookings() {
  const navigation = useNavigation();
  const layout = Dimensions.get('window');
  const [index, setIndex] = useState(0); // Default to 'Upcoming'
  const [routes] = useState([
    { key: 'upcoming', title: 'Upcoming' },
    { key: 'ongoing', title: 'Ongoing' },
    { key: 'completed', title: 'Completed' },
    { key: 'cancelled', title: 'Canceled' },
  ]);

  const {
    upcomingBookings,
    ongoingBookings,
    completedBookings,
    cancelledBookings,
    isLoading,
    refetch
  } = useBookingViewModel();

  // Review modal state
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewSpaceId, setReviewSpaceId] = useState<string | null>(null);
  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();

  const handleLeaveReview = useCallback((spaceId: string) => {
    setReviewSpaceId(spaceId);
    setReviewModalVisible(true);
  }, []);

  const handleReviewSubmit = useCallback(async (data: { rating: number; title: string; description: string }) => {
    if (!reviewSpaceId) return;
    try {
      await createReview({ spaceId: reviewSpaceId, data }).unwrap();
      setReviewModalVisible(false);
      Alert.alert('Thank you!', 'Your review has been submitted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
      throw error;
    }
  }, [reviewSpaceId, createReview]);

  // Refetch when screen comes into focus to get latest status updates
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation, refetch]);

  const renderBookingList = (data: BookingWithSpace[], statusLabel: string) => {
    return (
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookingCard
            image={item.space?.thumbnail || 'https://via.placeholder.com/150'}
            badge={item.space?.category || 'Coworking'}
            title={item.space?.name || 'Unknown Space'}
            location={item.space?.city || 'Unknown Location'}
            rating={item.space?.rating || 4.5}
            price={`₹${item.space?.pricePerHour || 0}`}
            status={statusLabel.toLowerCase() as any}
            onRebook={() => {
              if (item.spaceId) {
                // @ts-ignore
                navigation.navigate('SpaceDetail', { spaceId: item.spaceId });
              }
            }}
            onViewTicket={() => {
              // @ts-ignore
              navigation.navigate('EReceipt', {
                bookingId: item.id,
                spaceName: item.space?.name,
                totalAmount: item.totalAmount,
                date: item.startDate,
                startTime: item.startTime,
                endTime: item.endTime,
                paymentLabel: 'Paid',
                duration: 0,
                fees: 0
              });
            }}
            onLeaveReview={() => handleLeaveReview(item.spaceId)}
            onPress={() => {
              if (statusLabel.toLowerCase() === 'ongoing') {
                // @ts-ignore
                navigation.navigate('SpaceTimer', {
                  bookingId: item.id,
                  spaceName: item.space?.name,
                  userName: 'Tanmay Shukla',
                  spaceType: item.space?.category,
                  allocatedSpace: 'A52',
                  startTime: item.startTime,
                  endTime: item.endTime,
                  date: item.startDate,
                  totalAmount: item.totalAmount
                });
              } else {
                // @ts-ignore
                navigation.navigate('BookingDetail', { bookingId: item.id });
              }
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {statusLabel} bookings</Text>
          </View>
        }
      />
    );
  };

  const renderScene = SceneMap({
    upcoming: () => renderBookingList(upcomingBookings, 'Upcoming'),
    ongoing: () => renderBookingList(ongoingBookings, 'Ongoing'),
    completed: () => renderBookingList(completedBookings, 'Completed'),
    cancelled: () => renderBookingList(cancelledBookings, 'Cancelled'),
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{ backgroundColor: colors.primary, height: 3, borderRadius: 3 }}
      style={{ backgroundColor: colors.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: colors.divider }}
      labelStyle={{ fontSize: typography.fontSize.md, fontWeight: '400', textTransform: 'none' }}
      tabStyle={{ width: 'auto', paddingHorizontal: spacing.md }}
      activeColor={colors.primary}
      inactiveColor={colors.textSecondary}
      pressColor={'transparent'}
    />
  );

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" library="material" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        style={{ flex: 1 }}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
        isLoading={isCreatingReview}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
  },
});
