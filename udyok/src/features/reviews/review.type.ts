export interface ReviewUser {
    userId: string;
    username: string;
    userImage: string;
}

export interface Review {
    reviewId: string;
    title: string;
    description: string;
    rating: number;
    images: string[];
    createdAt: string;
    user: ReviewUser;

}

export interface ReviewSummary {
    averageRating: number;
    totalReviews: number;
    summary: string;
}


export interface WriteReviewRequest {
    title: string;
    description: string;
    rating: number;
    images?: string[];
}

export interface WriteReviewResponse {
    reviewId?: string;
    message: string;
}