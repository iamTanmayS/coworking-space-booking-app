import { useGetReviewsQuery, useCreateReviewMutation } from '@/features/reviews/reviews.api';

export interface ReviewViewModelProp {
    spaceId: string;
}

export const useReviewTabViewModel = ({ spaceId }: ReviewViewModelProp) => {
    const { data: reviewResponse, isLoading, error } = useGetReviewsQuery({ spaceId });

    // 1. The hook returns a 'trigger' function and an 'options' object
    const [createReviewMutation, { isLoading: isCreating }] = useCreateReviewMutation();

    const handleCreateReview = async (reviewData: any) => {
        try {
            // 2. Call the trigger function and unwrap the promise
            const response = await createReviewMutation({ spaceId, data: reviewData }).unwrap();
            console.log('Success:', response.message);
            return response;
        } catch (err) {
            console.error('Failed to create review:', err);
            throw err;
        }
    };

    const reviews = reviewResponse?.data || [];
    const rawSummary = (reviewResponse as any)?.summary;
    const summary = rawSummary ? {
        averageRating: rawSummary.averageRating ?? rawSummary.average ?? 0,
        totalReviews: rawSummary.totalReviews ?? rawSummary.total ?? 0,
        summary: rawSummary.summary ?? 'No summary available',
    } : null;

    const createReview = async (data: any) => {
        console.log('Mock creating review:', data);
        return { message: 'Review created successfully' };
    };

    return {
        reviews,
        summary,
        isLoading,
        error,
        createReview: handleCreateReview, // Use the real mutation wrapper
        isCreating: isCreating, // Pass loading state to UI
    };
};

