import React, { useState } from 'react';
import { View, ActivityIndicator, Text, Linking, Alert } from 'react-native';
import SpaceDetailHeader from '@/components/screen_components/space/SpaceDetailHeader';
import SpaceInfo from '@/components/screen_components/space/SpaceInfo';
import { ScreenWrapper } from '@/components';
import SpaceTabView from '@/components/screen_components/space/tabnavigation/TabView';
import SpaceBottomPriceBar from '@/components/screen_components/space/SpaceBottomPriceBar';
import BookingModal from '@/components/screen_components/booking/BookingModal';
import WriteReviewModal from '@/components/screen_components/space/WriteReviewModal';
import { useSpaceDetailViewModel } from '@/viewmodels/space/useSpaceDetailViewModel';
import { colors } from '@/index';
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { SpaceDetailParam } from "@/navigation/types";
import { useAppDispatch } from '@/store/store';
import { updateDraftBooking } from '@/features/booking/Booking.slice';
import { useCreateChatMutation } from '@/features/chat/chat.api';
import { useCreateReviewMutation } from '@/features/reviews/reviews.api';


type SpaceDetailRoute = RouteProp<
  SpaceDetailParam,
  "SpaceDetail"
>;

export default function SpaceDetail() {
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const route = useRoute<SpaceDetailRoute>()
  const { spaceId } = route.params
  const { space, isLoading, error } = useSpaceDetailViewModel({ spaceId });
  console.log(spaceId)

  const [createChatMutation] = useCreateChatMutation();
  const [createReviewMutation, { isLoading: isCreatingReview }] = useCreateReviewMutation();

  const handleMessageOperator = async () => {
    if (!space?.owner) return;
    try {
      const chatResp = await createChatMutation({
        targetUserId: space.owner.id,
        targetName: space.owner.name,
        targetAvatar: space.owner.avatar || undefined,
      }).unwrap();

      const chatId = chatResp._id || chatResp.id;

      // Navigate to the ChatStack tab first (so ChatList is in the stack),
      // then immediately push ChatDetail on top — back button returns to ChatList
      // @ts-ignore - nested navigation typing
      navigation.navigate('MainTabs', { screen: 'ChatStack' });
      // Small delay so ChatStack mounts before pushing ChatDetail
      setTimeout(() => {
        // @ts-ignore
        navigation.navigate('MainTabs', {
          screen: 'ChatStack',
          params: {
            screen: 'ChatDetail',
            params: { chatId },
          },
        });
      }, 50);
    } catch (error) {
      console.error('Failed to create chat:', error);
      Alert.alert('Error', 'Could not open chat. Please try again.');
    }
  };

  const handleCallOperator = () => {
    if (space?.owner?.phone) {
      Linking.openURL(`tel:${space.owner.phone}`).catch(() => {
        Alert.alert('Error', 'Cannot open dialer on this device.');
      });
    } else {
      Alert.alert('Not Available', 'Operator phone number is not available.');
    }
  };

  const handleWriteReview = () => {
    setIsReviewModalVisible(true);
  };

  const handleReviewSubmit = async (data: { rating: number; title: string; description: string }) => {
    try {
      await createReviewMutation({
        spaceId: space!.id,
        data: {
          rating: data.rating,
          title: data.title,
          description: data.description
        }
      }).unwrap();
      Alert.alert('Success', 'Your review has been submitted successfully.');
      setIsReviewModalVisible(false);
    } catch (e) {
      console.error('Failed to submit review:', e);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  };

  const handleBookNow = () => {
    setIsBookingModalVisible(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalVisible(false);
  };

  const handleBookingContinue = (bookingData: any) => {
    // Create draft booking
    const draftBooking = {
      spaceId: space!.id,
      startDate: bookingData.date.toISOString().split('T')[0], // "2026-02-18"
      startTime: bookingData.startTime, // "09:00"
      endTime: bookingData.endTime, // "16:00"
    };

    // Save to Redux
    dispatch(updateDraftBooking(draftBooking));

    // Close modal
    setIsBookingModalVisible(false);

    // Navigate to payment screen in BookingFlowStack
    // @ts-ignore - Nested navigation
    navigation.navigate('BookingFlowStack', {
      screen: 'PaymentMethod',
      params: {
        spaceId: space!.id,
        spaceName: space!.name,
        totalAmount: bookingData.totalPrice,
        duration: bookingData.duration,
        date: bookingData.date.toISOString().split('T')[0],
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        spaceImage: space!.images?.[0],
        spaceLocation: space!.location.address,
        spaceRating: space!.rating,
      },
    });
  };

  if (isLoading) {
    return (
      <ScreenWrapper>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !space) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Failed to load space details</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}
    >
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <SpaceDetailHeader
          spaceId={space.id}
          images={space.images}
          isFavourite={space.isFavorite}
        />
        <SpaceInfo
          category={space.category}
          review={space.rating.toString()}
          reviewCount={space.totalReviews.toString()}
          name={space.name}
          location={space.location.address}
        />
        <SpaceTabView
          aboutProps={{
            walkingTime: space.travelTimeMin
              ? `${space.travelTimeMin} Mins`
              : space.schedule
                ? `${space.schedule.openTime} – ${space.schedule.closeTime}`
                : undefined,
            distance: space.distanceKm
              ? `${space.distanceKm.toFixed(1)} Km`
              : space.location?.city || space.location?.address || undefined,
            status: space.isOpenNow ? 'Open' : 'Closed',
            description: space.description,
            operatorName: space.owner?.name || 'Unknown',
            operatorAvatar: space.owner?.avatar || '',
            onMessageOperator: handleMessageOperator,
            onCallOperator: handleCallOperator,
          }}
          galleryProps={{
            images: space.images
          }}
          reviewProps={{
            spaceId: space.id,
            onWriteReview: handleWriteReview,
          }}
        />
        <SpaceBottomPriceBar
          price={space.pricePerHour}
          currency={space.currency}
          isOpen={space.isOpenNow}
          onBookNow={handleBookNow}
        />
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={isBookingModalVisible}
        space={space}
        onClose={handleCloseBookingModal}
        onContinue={handleBookingContinue}
      />

      {/* Review Modal */}
      <WriteReviewModal
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
        isLoading={isCreatingReview}
      />
    </ScreenWrapper>
  );
}
