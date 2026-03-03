import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
}

interface UIState {
    isBottomSheetOpen: boolean;
    activeModal: string | null;
    toast: Toast | null;
    isDrawerOpen: boolean;
}

const initialState: UIState = {
    isBottomSheetOpen: false,
    activeModal: null,
    toast: null,
    isDrawerOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openBottomSheet: (state) => {
            state.isBottomSheetOpen = true;
        },
        closeBottomSheet: (state) => {
            state.isBottomSheetOpen = false;
        },
        openModal: (state, action: PayloadAction<string>) => {
            state.activeModal = action.payload;
        },
        closeModal: (state) => {
            state.activeModal = null;
        },
        showToast: (state, action: PayloadAction<Toast>) => {
            state.toast = action.payload;
        },
        hideToast: (state) => {
            state.toast = null;
        },
        toggleDrawer: (state) => {
            state.isDrawerOpen = !state.isDrawerOpen;
        },
    },
});

export const { openBottomSheet, closeBottomSheet, openModal, closeModal, showToast, hideToast, toggleDrawer } = uiSlice.actions;
export default uiSlice.reducer;
