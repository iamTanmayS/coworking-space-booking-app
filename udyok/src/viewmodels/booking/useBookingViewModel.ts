import { useMemo } from 'react';
import { useGetBookingsQuery } from '@/features/booking/booking.api';
import { useGetSpacesQuery } from '@/features/spaces/spaces.api';
import { Booking } from '@/features/booking/booking.types';
import { SpaceListItem } from '@/features/spaces/spaces.types';

export interface BookingWithSpace extends Booking {
    space?: SpaceListItem;
}

export const useBookingViewModel = () => {
    const {
        data: bookings = [],
        isLoading: isBookingsLoading,
        error: bookingsError,
        refetch: refetchBookings
    } = useGetBookingsQuery();

    // Fetch all spaces to join with bookings
    const {
        data: spacesResponse,
        isLoading: isSpacesLoading
    } = useGetSpacesQuery({ page: 1, limit: 100 });

    const spaces = spacesResponse?.data || [];

    // Combine bookings with space details
    const enrichedBookings: BookingWithSpace[] = useMemo(() => {
        if (!bookings.length) return [];
        return bookings.map(booking => {
            const space = spaces.find(s => s.id === booking.spaceId);
            return {
                ...booking,
                space
            };
        });
    }, [bookings, spaces]);

    // ── Upcoming: confirmed/pending bookings whose start_time is still in the future
    const upcomingBookings = useMemo(() =>
        enrichedBookings.filter(b =>
            (b.status === 'confirmed' || b.status === 'pending') &&
            new Date(b.startDate) > new Date()
        ),
        [enrichedBookings]);

    // ── Ongoing: backend marks these as 'ongoing' via autoUpdateStatuses,
    //    but also catch any 'confirmed' that have already started (edge case before next auto-update)
    const ongoingBookings = useMemo(() =>
        enrichedBookings.filter(b => {
            if (b.status === 'ongoing') return true;
            // Confirmed booking that has already started but not yet ended
            if (b.status === 'confirmed') {
                const now = new Date();
                return new Date(b.startDate) <= now && new Date(b.endDate) > now;
            }
            return false;
        }),
        [enrichedBookings]);

    // ── Completed
    const completedBookings = useMemo(() =>
        enrichedBookings.filter(b => b.status === 'completed'),
        [enrichedBookings]);

    // ── Cancelled
    const cancelledBookings = useMemo(() =>
        enrichedBookings.filter(b => b.status === 'cancelled'),
        [enrichedBookings]);

    const isLoading = isBookingsLoading || isSpacesLoading;
    const error = bookingsError;

    return {
        bookings: enrichedBookings,
        upcomingBookings,
        ongoingBookings,
        completedBookings,
        cancelledBookings,
        isLoading,
        error,
        refetch: refetchBookings
    };
};
