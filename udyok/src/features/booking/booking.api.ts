// Booking API

import type {
    Booking,
    BookingFilters,
    CreateBookingRequest,
    UpdateBookingRequest,
} from './booking.types';

import { baseApi } from '../../api/base.api';

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<Booking[], BookingFilters | void>({
            query: (filters) => ({
                url: '/bookings',
                params: filters || undefined,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Booking' as const, id })),
                        { type: 'Booking', id: 'LIST' },
                    ]
                    : [{ type: 'Booking', id: 'LIST' }],
        }),

        getBooking: builder.query<Booking, string>({
            query: (id) => `/bookings/${id}`,
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),

        createBooking: builder.mutation<Booking, CreateBookingRequest>({
            query: (data) => ({
                url: '/bookings',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
        }),

        updateBooking: builder.mutation<Booking, { id: string; data: UpdateBookingRequest }>({
            query: ({ id, data }) => ({
                url: `/bookings/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' },
            ],
        }),

        cancelBooking: builder.mutation<void, string>({
            query: (id) => ({
                url: `/bookings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetBookingsQuery,
    useGetBookingQuery,
    useCreateBookingMutation,
    useUpdateBookingMutation,
    useCancelBookingMutation,
} = bookingApi;
