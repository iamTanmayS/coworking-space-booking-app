import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MOCK_CATEGORIES, MOCK_OFFERS } from '@/services/mockData';
import { SpecialOfferCardProps } from '@/components/reusable_components/SpecialOfferCard';
import { Category } from '@/services/mockData';
import { useGetSpacesQuery } from '@/features/spaces/spaces.api';
import { SpaceListItem } from '@/features/spaces/spaces.types';
import { useAddFundsMutation } from '@/features/wallet/wallet.api';

export const useHomeViewModel = () => {
    const navigation = useNavigation();
    const { profile } = useSelector((state: RootState) => state.user);

    // Format location for display
    const locationObj = profile?.location;
    const location = locationObj
        ? `${locationObj.city}${locationObj.country ? `, ${locationObj.country}` : ''}`
        : 'Select Location';

    const categories = MOCK_CATEGORIES;
    const offers = MOCK_OFFERS;

    const { data: spacesResponse, isLoading, error } = useGetSpacesQuery({
        page: 1,
        limit: 10,
        sortBy: 'rating',
        ...(locationObj?.latitude != null && {
            lat: locationObj.latitude,
            lng: locationObj.longitude,
        }),
    });

    const spaces = spacesResponse?.data || [];

    // Wallet Mutation for Claiming Offers
    const [addFunds] = useAddFundsMutation();
    const [claimingOffers, setClaimingOffers] = useState<Record<string, boolean>>({});

    const handleSearch = (query: string) => {
        if (query.trim()) {
            // Navigate to Explore tab with search query
            (navigation as any).navigate('ExploreStack', {
                screen: 'Explore',
                params: { searchQuery: query }
            });
        }
    };

    const handleNotification = () => {
        (navigation as any).navigate('ExploreStack', {
            screen: 'Notifications'
        });
    };

    const handleLocationPress = () => {
        navigation.navigate('Location' as never);
    };

    const handleClaim = async (offer: SpecialOfferCardProps) => {
        // Use a default ID if none provided since mock data didn't have IDs initially
        const offerId = offer.title || 'default_offer';

        if (claimingOffers[offerId]) return;

        setClaimingOffers(prev => ({ ...prev, [offerId]: true }));

        try {
            // Extract a reasonable numeric value from the discount string
            // e.g. "40" -> 40, "50" -> 50. If it's a percentage, let's just make it a flat amount 
            // of ₹500 as promotional credit for simplicity.
            const rewardAmount = 500;

            await addFunds({
                amount: rewardAmount,
                paymentMethodId: 'promo_credit'
            }).unwrap();

            Alert.alert(
                'Offer Claimed!',
                `₹${rewardAmount} promotional credit has been added to your wallet.`
            );
        } catch (err) {
            Alert.alert('Error', 'Failed to claim offer. Please try again later.');
        } finally {
            setClaimingOffers(prev => ({ ...prev, [offerId]: false }));
        }
    };

    // We also need to map the claiming state into the offers list
    const mappedOffers = offers.map(offer => ({
        ...offer,
        isClaiming: claimingOffers[offer.title || 'default_offer'] || false
    }));

    const handleCategoryPress = (category: Category) => {
        console.log('Category selected:', category.name);
        // Navigate to Explore tab with category filter
        (navigation as any).navigate('ExploreStack', {
            screen: 'Explore',
            params: { category: category.name }
        });
    };

    return {
        location,
        categories,
        offers: mappedOffers,
        spaces,
        isLoading,
        error,
        handleSearch,
        handleNotification,
        handleLocationPress,
        handleClaim,
        handleCategoryPress,
    };
};
