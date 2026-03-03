import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpaceListItem } from '../spaces/spaces.types';
import { favoritesApi } from './favorites.api';

interface FavoritesState {
    favorites: SpaceListItem[];
}

const initialState: FavoritesState = {
    favorites: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        setFavorites: (state, action: PayloadAction<SpaceListItem[]>) => {
            state.favorites = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            favoritesApi.endpoints.getFavorites.matchFulfilled,
            (state, { payload }) => {
                if (payload.data) {
                    state.favorites = payload.data;
                }
            }
        );
        // We could also listen to add/remove mutations here for optimistic updates
        // but since we handle optimistic updates via API cache invalidation/patches,
        // and we refetch, the refetch will trigger matchFulfilled and update this slice.
        // However, for pure offline support without refetch, we might want to manually add/remove.
        // But let's keep it simple: API is source of truth, slice is a persisted mirror.
    },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
