import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { SpaceListParams } from "@/features/spaces/spaces.types"

export interface SpaceUiState {
    params: SpaceListParams;
}

const initialState: SpaceUiState = {
    params: {
        page: 1,
        limit: 10,
    },
}

export const spaceSlice = createSlice({
    name: "space",
    initialState,
    reducers: {
        setParams: (state, action: PayloadAction<Partial<SpaceListParams>>) => {
            state.params = {
                ...state.params,
                ...action.payload,
            }
        },
        resetParams: (state) => {
            state.params = initialState.params;
        },
    }
})

export const { setParams, resetParams } = spaceSlice.actions;
export default spaceSlice.reducer;
