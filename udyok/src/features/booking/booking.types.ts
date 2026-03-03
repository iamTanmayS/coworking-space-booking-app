export interface Booking {
    id: string;
    userId: string;
    spaceId: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'ongoing' | 'cancelled' | 'completed';
    paymentMethodId?: string;
    totalAmount: number;
    notes?: string;
}

export interface DraftBooking {
    spaceId?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    paymentMethodId?: string;
    notes?: string;
}

export interface BookingState {
    bookings: Booking[];
    selectedBooking: Booking | null;
    draftBooking: DraftBooking;
    loading: boolean;
    error: string | null;
}


export interface CreateBookingRequest {
    spaceId: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    paymentMethodId?: string;
    notes?: string;
}

export interface UpdateBookingRequest {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
}

export interface BookingFilters {
    status?: 'pending' | 'confirmed' | 'ongoing' | 'cancelled' | 'completed';
    startDate?: string;
    endDate?: string;
}

