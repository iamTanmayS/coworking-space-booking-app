import { PaginatedResponse } from "../pagination/pagination.type";
import { Review } from "../reviews/review.type";

export interface SpaceListItem {
    id: string;
    category: string;

    name: string;
    thumbnail: string;

    pricePerHour: number;
    currency: string;

    rating: number;
    totalReviews: number;

    distanceKm?: number;
    travelTimeMin?: number;

    city: string;

    isOpenNow: boolean;
    isFavorite: boolean;
}

export interface SpaceDetail {
    id: string;

    name: string;
    description: string;
    thumbnail: string;
    images: string[];

    pricePerHour: number;
    currency: string;

    rating: number;
    totalReviews: number;

    category: string;
    amenities: string[];

    location: {
        address: string;
        city: string;
        lat: number;
        lng: number;
    };

    owner: {
        id: string;
        name: string;
        avatar: string | null;
        phone: string | null;
        email: string;
        isVerified: boolean;
    };

    schedule: {
        openDays: number[];
        openTime: string;
        closeTime: string;
    };

    isOpenNow: boolean;
    isFavorite: boolean;

    distanceKm?: number;
    travelTimeMin?: number;
}

export interface SpaceListParams {
    page: number;
    limit: number;

    query?: string;

    minPrice?: number;
    maxPrice?: number;

    amenities?: string[];

    lat?: number;
    lng?: number;
    radiusKm?: number;

    sortBy?: 'distance' | 'price' | 'rating';
}

export interface FilterParams {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    category?: string;
    amenities?: string[];
}

export type SpaceListResponse = PaginatedResponse<SpaceListItem>;

export type SpaceDetailResponse = SpaceDetail;

export type SpaceReviewResponse = PaginatedResponse<Review>;
