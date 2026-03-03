import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { Booking, DraftBooking, BookingState } from './booking.types';

const initialBookingState: BookingState = {
    bookings: [],
    selectedBooking: null,
    draftBooking: {},
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState: initialBookingState,
    reducers: {
        setBookings: (state, action: PayloadAction<Booking[]>) => {
            state.bookings = action.payload;
        },
        addBooking: (state, action: PayloadAction<Booking>) => {
            state.bookings.push(action.payload);
        },
        updateBooking: (state, action: PayloadAction<Booking>) => {
            const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
            if (index !== -1) {
                state.bookings[index] = action.payload;
            }
        },
        removeBooking: (state, action: PayloadAction<string>) => {
            state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
        },
        setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
            state.selectedBooking = action.payload;
        },
        setBookingLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updateDraftBooking: (state, action: PayloadAction<Partial<DraftBooking>>) => {
            state.draftBooking = { ...state.draftBooking, ...action.payload };
        },
        clearDraftBooking: (state) => {
            state.draftBooking = {};
        },
        setBookingError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        confirmBooking: (state, action: PayloadAction<Booking>) => {
            state.bookings.push(action.payload);
            state.draftBooking = {};
            state.selectedBooking = action.payload;
        },
    },
});


export const { setBookings, addBooking, updateBooking, removeBooking, setSelectedBooking, setBookingLoading, updateDraftBooking, clearDraftBooking, setBookingError, confirmBooking } = bookingSlice.actions;

export default bookingSlice.reducer;