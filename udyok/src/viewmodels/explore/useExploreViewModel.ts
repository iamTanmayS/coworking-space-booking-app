import { useState, useEffect, useCallback } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetSpacesQuery } from '@/features/spaces/spaces.api';
import { SpaceListItem, FilterParams } from '@/features/spaces/spaces.types';

type ExploreRouteParams = {
    searchQuery?: string;
    category?: string;
};

export const useExploreViewModel = () => {

    const navigation = useNavigation()
    const route = useRoute<RouteProp<{ Explore: ExploreRouteParams }, 'Explore'>>();
    const initialSearchQuery = route.params?.searchQuery || '';
    const initialCategory = route.params?.category;

    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [filterParams, setFilterParams] = useState<FilterParams>({
        category: initialCategory,
        minPrice: 100,
        maxPrice: 2000,
    });

    // Apply route params when navigating to Explore with category or search
    useEffect(() => {
        if (route.params?.category) {
            setFilterParams(prev => ({
                ...prev,
                category: route.params.category,
            }));
        }
        if (route.params?.searchQuery) {
            setSearchQuery(route.params.searchQuery);
        }
    }, [route.params?.category, route.params?.searchQuery]);

    // Reset filters when user navigates away from Explore screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setSearchQuery('');
            setFilterParams({
                minPrice: 100,
                maxPrice: 2000,
            });
        });

        return unsubscribe;
    }, [navigation]);

    const locationObj = useSelector((state: RootState) => state.user.profile?.location);

    // Fetch spaces with dynamic params
    const { data: spacesResponse, isLoading, error, refetch } = useGetSpacesQuery({
        page: 1,
        limit: 50,
        query: searchQuery || undefined,
        minPrice: filterParams.minPrice,
        maxPrice: filterParams.maxPrice,
        amenities: filterParams.amenities,
        ...(locationObj?.latitude != null && {
            lat: locationObj.latitude,
            lng: locationObj.longitude,
        }),
    });

    const spaces = spacesResponse?.data || [];

    // Filter by category client-side if provided, though mock service might not handle it yet?
    // Mock service `getSpaces` calls `getFilteredSpaces(params)`.
    // Let's check if mock service supports category.
    // It seems `mockSpacesService.getSpaces` uses `SpaceListParams` which doesn't explicitly list category in `getFilteredSpaces` maybe?
    // Checking `mockApiService.ts` previously:
    // `getFilteredSpaces` filters by price and amenities.
    // So category filtering needs to be done here or added to mock service.
    // The current implementation does client-side filtering for category:
    const filteredSpaces = filterParams.category && filterParams.category !== 'All'
        ? spaces.filter(space => space.category === filterParams.category)
        : spaces;

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const applyFilters = (newFilters: FilterParams) => {
        console.log('Applying filters:', newFilters);
        setFilterParams(newFilters);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilterParams({
            minPrice: 100,
            maxPrice: 2000,
        });
    };

    return {
        spaces: filteredSpaces,
        searchQuery,
        filterParams, // Expose for modal initial state
        isLoading,
        error,
        handleSearch,
        applyFilters,
        clearFilters,
        refetch,
    };
};
