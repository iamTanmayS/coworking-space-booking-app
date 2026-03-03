import { PaginatedResponse } from "@/features/pagination/pagination.type";
import { SpaceListItem } from "@/features/spaces/spaces.types";

export type FavoritesResponse = PaginatedResponse<SpaceListItem>;

export interface FavoritesParams {
    page?: number;
    limit?: number;
    query?: string;
    lat?: number;
    lng?: number;
}

// Redux Slice State (UI only)
export interface FavoritesUiState {
    searchQuery: string;
}
