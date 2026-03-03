import { baseApi } from "@/api/base.api";
import {
    SpaceReviewResponse,
} from "@/features/spaces/spaces.types";
import { WriteReviewRequest, WriteReviewResponse } from "./review.type";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReviews: builder.query<
            SpaceReviewResponse,
            { spaceId: string; page?: number }>
            ({
                query: ({ spaceId, page = 1 }) =>
                    `/spaces/${spaceId}/reviews?page=${page}`,

                providesTags: (result, error, { spaceId }) => [
                    { type: "Reviews", id: spaceId },
                ],
            }),

        createReview: builder.mutation<
            WriteReviewResponse,
            { spaceId: string; data: WriteReviewRequest }>
            ({
                query: ({ spaceId, data }) => ({
                    url: `/spaces/${spaceId}/reviews`,
                    method: "POST",
                    body: data,
                }),

                invalidatesTags: (result, error, { spaceId }) => [
                    { type: "Reviews", id: spaceId },
                ],
            }),
    }),
});

export const { useGetReviewsQuery, useCreateReviewMutation } = reviewApi;