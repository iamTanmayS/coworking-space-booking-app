import { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from "@/features/favorites/favorites.api";
import { SpaceListItem } from "@/features/spaces/spaces.types";
import { setFavorites } from "@/features/favorites/Favorites.slice";

export const useFavoritesViewModel = () => {
    const dispatch = useAppDispatch();

    // 1. Local search state
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // 2. Get Persisted Favorites from Redux
    const persistedFavorites = useAppSelector((state) => state.favorites.favorites);

    // 2b. Get user location for distance calculation
    const userProfile = useAppSelector((state) => state.user.profile);
    const userLat = userProfile?.location?.latitude;
    const userLng = userProfile?.location?.longitude;

    // 3. Get Data (Favorites from Backend with Search + Location)
    const { data: favoritesResponse, isLoading, refetch } = useGetFavoritesQuery({
        page: 1,
        limit: 100,
        query: searchQuery || undefined,
        lat: userLat,
        lng: userLng,
    });

    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    useEffect(() => {
        if (!searchQuery && favoritesResponse?.data) {
            dispatch(setFavorites(favoritesResponse.data));
        }
    }, [favoritesResponse?.data, searchQuery, dispatch]);

    // 4. Actions
    const handleSearchChange = useCallback((text: string) => {
        setSearchInput(text);
    }, []);

    const handleSearchSubmit = useCallback(() => {
        setSearchQuery(searchInput);
    }, [searchInput]);

    const toggleFavorite = useCallback(async (space: SpaceListItem) => {
        try {
            if (space.isFavorite) {
                await removeFavorite(space.id).unwrap();
            } else {
                await addFavorite(space.id).unwrap();
            }
            refetch();
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    }, [addFavorite, removeFavorite, refetch]);

    // Determine which data to show
    const displayFavorites = searchQuery
        ? (favoritesResponse?.data || [])
        : persistedFavorites;

    // Show loading ONLY if we are searching and loading, OR if we have NO data at all and are loading initial
    const showLoading = isLoading && displayFavorites.length === 0;

    return {
        // State
        favorites: displayFavorites,
        searchInput,
        isLoading: showLoading,

        // Actions
        setSearchInput: handleSearchChange,
        handleSearchSubmit,
        toggleFavorite,
    };
};
