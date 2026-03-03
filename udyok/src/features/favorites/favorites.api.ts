// Favorites API
import { baseApi } from '../../api/base.api';
import type { FavoritesResponse, FavoritesParams } from './favorites.types';

export const favoritesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFavorites: builder.query<FavoritesResponse, FavoritesParams | void>({
            query: (params) => ({
                url: '/favorites',
                params: params || undefined,
            }),
            providesTags: ['Favorites'],
        }),

        addFavorite: builder.mutation<void, string>({
            query: (spaceId) => ({
                url: `/favorites/${spaceId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Favorites'],
        }),

        removeFavorite: builder.mutation<void, string>({
            query: (spaceId) => ({
                url: `/favorites/${spaceId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Favorites'],
            async onQueryStarted(spaceId, { dispatch, queryFulfilled }) {
                // Optimistic update for getFavorites
                const patchResult = dispatch(
                    favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
                        // Find and remove the item from favorites list
                        if (draft?.data) {
                            draft.data = draft.data.filter(item => item.id !== spaceId);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
} = favoritesApi;
