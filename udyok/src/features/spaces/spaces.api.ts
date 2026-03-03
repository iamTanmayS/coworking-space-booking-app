import type {
    SpaceDetailResponse,
    SpaceListParams,
    SpaceListResponse,
} from './spaces.types';

import { baseApi } from '../../api/base.api';

export const spacesApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // LIST + SEARCH (merged)
        getSpaces: builder.query<SpaceListResponse, SpaceListParams>({
            query: (params) => ({
                url: '/spaces',
                params,
            }),

            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({
                            type: 'Space' as const,
                            id,
                        })),
                        { type: 'Space', id: 'LIST' },
                        'Favorites',
                    ]
                    : [{ type: 'Space', id: 'LIST' }, 'Favorites'],
        }),

        // DETAIL
        getSpace: builder.query<SpaceDetailResponse, { id: string; lat?: number; lng?: number }>({
            query: ({ id, lat, lng }) => ({
                url: `/spaces/${id}`,
                params: lat != null ? { lat, lng } : undefined,
            }),

            providesTags: (result, error, { id }) => [
                { type: 'Space', id },
                'Favorites'
            ],
        }),

    }),
});


export const {
    useGetSpacesQuery,
    useGetSpaceQuery,
} = spacesApi;

