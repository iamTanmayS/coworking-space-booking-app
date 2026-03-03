/**
 * Mock Data Service
 * 
 * Provides realistic mock data for all API endpoints based on openapi.yaml
 * Use this for UI development and testing before backend integration
 */


import type { User } from '../features/user/user.types';
import type { SpaceDetail, SpaceListItem } from '../features/spaces/spaces.types';
import type { Booking } from '../features/booking/booking.types';
import type { PaymentMethod, Transaction } from '../features/wallet/wallet.types';
import type { Chat, Message } from '../features/chat/chat.types';
import type { Settings } from '../features/settings/settings.types';
import { SpecialOfferCardProps } from '@/components/reusable_components/cards/SpecialOfferCard';
// ============================================================================
// USERS
// ============================================================================

export const mockUsers: User[] = [
    {
        id: 'user_001',
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '+91 98765 43210',
        avatar: 'https://i.pravatar.cc/150?img=12',
        location: {
            latitude: 19.0760,
            longitude: 72.8777,
            city: 'Mumbai',
            country: 'India',
        },
        isVerified: true,
        isProfileComplete: true,
        isOnboarded: true,
    },
    {
        id: 'user_002',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        phone: '+91 98765 43211',
        avatar: 'https://i.pravatar.cc/150?img=45',
        location: {
            latitude: 12.9716,
            longitude: 77.5946,
            city: 'Bangalore',
            country: 'India',
        },
        isVerified: true,
        isProfileComplete: true,
        isOnboarded: true,
    },
];

export const mockCurrentUser = mockUsers[0];

// ============================================================================
// SPACES
// ============================================================================

export const mockSpaces: SpaceDetail[] = [
    {
        id: 'space_001',
        name: 'Modern Conference Room',
        description: 'Spacious conference room with state-of-the-art AV equipment, perfect for team meetings and presentations.',
        pricePerHour: 500,
        currency: '₹',
        rating: 4.8,
        totalReviews: 124,
        category: 'Conference',
        images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        amenities: ['WiFi', 'Projector', 'Whiteboard', 'AC', 'Coffee Machine'],
        location: {
            address: 'Bandra West',
            city: 'Mumbai',
            lat: 19.0596,
            lng: 72.8295,
        },
        owner: {
            id: 'user_002',
            name: 'Jane Smith',
            avatar: 'https://i.pravatar.cc/150?img=45',
            phone: '+91 98765 43211',
            email: 'jane.smith@example.com',
            isVerified: true,
        },
        schedule: {
            openDays: [1, 2, 3, 4, 5],
            openTime: '09:00',
            closeTime: '18:00',
        },
        isOpenNow: true,
        isFavorite: true,
        distanceKm: 1.2,
        travelTimeMin: 10,
    },
    {
        id: 'space_002',
        name: 'Creative Studio Space',
        description: 'Bright and inspirfdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddding studio space ideal for creative teams, workshops, and brainstorming sessions.',
        pricePerHour: 750,
        currency: '₹',
        rating: 4.9,
        totalReviews: 89,
        category: 'Studio',
        images: [
            'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',

            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        amenities: ['WiFi', 'Natural Light', 'Standing Desks', 'Art Supplies', 'Lounge Area'],
        location: {
            address: 'Koramangala',
            city: 'Bangalore',
            lat: 12.9352,
            lng: 77.6245,
        },
        owner: {
            id: 'user_001',
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?img=12',
            phone: '+91 98765 43210',
            email: 'john.doe@example.com',
            isVerified: true,
        },
        schedule: {
            openDays: [1, 2, 3, 4, 5, 6],
            openTime: '10:00',
            closeTime: '20:00',
        },
        isOpenNow: true,
        isFavorite: false,
        distanceKm: 3.5,
        travelTimeMin: 25,
    },
    {
        id: 'space_003',
        name: 'Executive Boardroom',
        description: 'Premium boardroom with panoramic city views, perfect for high-level meetings and client presentations.',
        pricePerHour: 1200,
        currency: '₹',
        rating: 5.0,
        totalReviews: 45,
        category: 'Conference',
        images: [
            'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800',
            'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        amenities: ['WiFi', '4K Display', 'Video Conferencing', 'Catering Service', 'Reception'],
        location: {
            address: 'Nariman Point',
            city: 'Mumbai',
            lat: 18.9218,
            lng: 72.8228,
        },
        owner: {
            id: 'user_002',
            name: 'Jane Smith',
            avatar: 'https://i.pravatar.cc/150?img=45',
            phone: '+91 98765 43211',
            email: 'jane.smith@example.com',
            isVerified: true,
        },
        schedule: {
            openDays: [1, 2, 3, 4, 5],
            openTime: '08:00',
            closeTime: '17:00',
        },
        isOpenNow: false,
        isFavorite: true,
        distanceKm: 0.8,
        travelTimeMin: 5,
    },
    {
        id: 'space_004',
        name: 'Cozy Coworking Cafe',
        description: 'A relaxed cafe-style coworking space with premium coffee and comfortable seating. Great for freelancers.',
        pricePerHour: 200,
        currency: '₹',
        rating: 4.5,
        totalReviews: 210,
        category: 'Open Space',
        images: [
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        amenities: ['WiFi', 'Coffee Machine', 'Sofa', 'Outdoor Seating'],
        location: {
            address: 'Indiranagar',
            city: 'Bangalore',
            lat: 12.9716,
            lng: 77.6412,
        },
        owner: {
            id: 'user_003',
            name: 'Coffee & Code',
            avatar: 'https://i.pravatar.cc/150?img=10',
            phone: '+91 98765 43212',
            email: 'hello@coffeecode.com',
            isVerified: true,
        },
        schedule: {
            openDays: [1, 2, 3, 4, 5, 6, 0],
            openTime: '08:00',
            closeTime: '22:00',
        },
        isOpenNow: true,
        isFavorite: false,
        distanceKm: 2.1,
        travelTimeMin: 15,
    },
    {
        id: 'space_005',
        name: 'Tech Hub Private Office',
        description: 'Secure and private office space for startups. Includes access to meeting rooms and high-speed internet.',
        pricePerHour: 1500,
        currency: '₹',
        rating: 4.7,
        totalReviews: 55,
        category: 'Private',
        images: [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        amenities: ['WiFi', 'Printer', 'Meeting Room', 'Biometric Access', 'Pantry'],
        location: {
            address: 'Hitech City',
            city: 'Hyderabad',
            lat: 17.4435,
            lng: 78.3772,
        },
        owner: {
            id: 'user_004',
            name: 'TechSpaces',
            avatar: 'https://i.pravatar.cc/150?img=20',
            phone: '+91 98765 43213',
            email: 'contact@techspaces.com',
            isVerified: true,
        },
        schedule: {
            openDays: [1, 2, 3, 4, 5],
            openTime: '09:00',
            closeTime: '19:00',
        },
        isOpenNow: true,
        isFavorite: true,
        distanceKm: 5.0,
        travelTimeMin: 30,
    },
    {
        id: 'space_006',
        name: 'Artist Loft',
        description: 'Open plan loft with abundant natural light, perfect for painters, designers, and photographers.',
        pricePerHour: 600,
        currency: '₹',
        rating: 4.6,
        totalReviews: 32,
        category: 'Studio',
        images: [
            'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800',
        amenities: ['Natural Light', 'Sink', 'Storage', 'WiFi'],
        location: {
            address: 'Colaba',
            city: 'Mumbai',
            lat: 18.9067,
            lng: 72.8147,
        },
        owner: {
            id: 'user_005',
            name: 'Art Collective',
            avatar: 'https://i.pravatar.cc/150?img=33',
            phone: '+91 98765 43214',
            email: 'info@artcollective.com',
            isVerified: false,
        },
        schedule: {
            openDays: [1, 2, 3, 4, 5, 6],
            openTime: '10:00',
            closeTime: '18:00',
        },
        isOpenNow: false,
        isFavorite: false,
        distanceKm: 12.0,
        travelTimeMin: 45,
    },
];

/**
 * Maps SpaceDetail to SpaceListItem
 */
export const mapToSpaceListItem = (space: SpaceDetail): SpaceListItem => ({
    id: space.id,
    category: space.category,
    name: space.name,
    thumbnail: space.images[0],
    pricePerHour: space.pricePerHour,
    currency: space.currency,
    rating: space.rating,
    totalReviews: space.totalReviews,
    city: space.location.city,
    isOpenNow: space.isOpenNow,
    isFavorite: space.isFavorite,
    distanceKm: space.distanceKm,
    travelTimeMin: space.travelTimeMin,
});

// ============================================================================
// BOOKINGS
// ============================================================================

export const mockBookings: Booking[] = [
    {
        id: 'booking_001',
        userId: 'user_001',
        spaceId: 'space_001',
        startDate: '2026-02-15',
        endDate: '2026-02-15',
        startTime: '14:00',
        endTime: '17:00',
        status: 'confirmed',
        paymentMethodId: 'pm_001',
        totalAmount: 1500,
        notes: 'Team quarterly review meeting',
    },
    {
        id: 'booking_002',
        userId: 'user_001',
        spaceId: 'space_002',
        startDate: '2026-02-20',
        endDate: '2026-02-20',
        startTime: '10:00',
        endTime: '13:00',
        status: 'pending',
        paymentMethodId: 'pm_002',
        totalAmount: 2250,
        notes: 'Design workshop with clients',
    },
    {
        id: 'booking_003',
        userId: 'user_001',
        spaceId: 'space_003',
        startDate: '2026-02-10',
        endDate: '2026-02-10',
        startTime: '09:00',
        endTime: '12:00',
        status: 'completed',
        paymentMethodId: 'pm_001',
        totalAmount: 3600,
        notes: 'Board meeting',
    },
    {
        id: 'booking_004',
        userId: 'user_001',
        spaceId: 'space_004',
        startDate: '2026-02-25',
        endDate: '2026-02-25',
        startTime: '15:00',
        endTime: '16:00',
        status: 'confirmed',
        paymentMethodId: 'pm_001',
        totalAmount: 300,
        notes: '1-on-1 with team lead',
    },
];

// ============================================================================
// PAYMENT METHODS
// ============================================================================

export const mockPaymentMethods: PaymentMethod[] = [
    {
        id: 'pm_001',
        type: 'card',
        details: '**** **** **** 4242',
        isDefault: true,
    },
    {
        id: 'pm_002',
        type: 'upi',
        details: 'john.doe@paytm',
        isDefault: false,
    },
    {
        id: 'pm_003',
        type: 'wallet',
        details: 'Udyok Wallet',
        isDefault: false,
    },
];

// ============================================================================
// TRANSACTIONS
// ============================================================================

export const mockTransactions: Transaction[] = [
    {
        id: 'txn_001',
        amount: 1500,
        type: 'debit',
        description: 'Booking payment for Modern Conference Room',
        timestamp: '2026-02-15T14:00:00Z',
        status: 'completed',
    },
    {
        id: 'txn_002',
        amount: 5000,
        type: 'credit',
        description: 'Wallet top-up',
        timestamp: '2026-02-14T10:30:00Z',
        status: 'completed',
    },
    {
        id: 'txn_003',
        amount: 2250,
        type: 'debit',
        description: 'Booking payment for Creative Studio Space',
        timestamp: '2026-02-13T16:45:00Z',
        status: 'pending',
    },
    {
        id: 'txn_004',
        amount: 3600,
        type: 'debit',
        description: 'Booking payment for Executive Boardroom',
        timestamp: '2026-02-10T09:00:00Z',
        status: 'completed',
    },
];

// ============================================================================
// CHATS
// ============================================================================

export const mockChats: Chat[] = [];

export const mockMessages: Record<string, Message[]> = {};

// ============================================================================
// SETTINGS
// ============================================================================

export const mockSettings: Settings = {
    theme: 'light',
    notifications: true,
    language: 'en',
    timezone: 'Asia/Kolkata',
    emailNotifications: true,
    smsNotifications: false,
};

// ============================================================================
// REVIEWS
// ============================================================================

export interface MockReview {
    reviewId: string;
    title: string;
    description: string;
    rating: number;
    images: string[];
    createdAt: string;
    user: {
        userId: string;
        username: string;
        userImage: string;
    };
}

export const mockReviews: Record<string, { reviews: MockReview[]; summary: { averageRating: number; totalReviews: number; summary: string } }> = {
    '123232': {
        summary: {
            averageRating: 4.8,
            totalReviews: 365,
            summary: 'Customers love the professional atmosphere, excellent amenities, and convenient location. Highly recommended for productive work.',
        },
        reviews: [
            {
                reviewId: '1',
                title: 'Amazing workspace!',
                description: 'This is hands down the best coworking space I\'ve been to. The atmosphere is professional yet relaxed, and the amenities are top-notch.',
                rating: 5,
                images: [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
                    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
                ],
                createdAt: '2024-02-10T10:30:00Z',
                user: {
                    userId: 'user1',
                    username: 'John Smith',
                    userImage: 'https://i.pravatar.cc/150?u=john',
                },
            },
            {
                reviewId: '2',
                title: 'Great location and facilities',
                description: 'Perfect spot for remote work. The location is convenient and the space is well-maintained.',
                rating: 4,
                images: [],
                createdAt: '2024-02-08T14:20:00Z',
                user: {
                    userId: 'user2',
                    username: 'Sarah Johnson',
                    userImage: 'https://i.pravatar.cc/150?u=sarah',
                },
            },
        ],
    },
};

// ============================================================================
// FAVORITES
// ============================================================================


export const mockFavoriteIds: string[] = ['space_001', 'space_003', 'space_005'];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Simulate API delay
 */
export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get space by ID
 */
export const getSpaceById = (id: string): SpaceDetail | undefined => {
    return mockSpaces.find(space => space.id === id);
};

/**
 * Get booking by ID
 */
export const getBookingById = (id: string): Booking | undefined => {
    return mockBookings.find(booking => booking.id === id);
};

/**
 * Get bookings with filters
 */
export const getFilteredBookings = (filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
}): Booking[] => {
    let filtered = [...mockBookings];

    if (filters?.status) {
        filtered = filtered.filter(b => b.status === filters.status);
    }

    if (filters?.startDate) {
        filtered = filtered.filter(b => b.startDate >= filters.startDate!);
    }

    if (filters?.endDate) {
        filtered = filtered.filter(b => b.endDate <= filters.endDate!);
    }

    return filtered;
};

/**
 * Get spaces with filters
 */
export const getFilteredSpaces = (filters?: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
}): SpaceDetail[] => {
    let filtered = [...mockSpaces];

    if (filters?.location) {
        filtered = filtered.filter(s =>
            s.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
            s.location.address.toLowerCase().includes(filters.location!.toLowerCase())
        );
    }

    if (filters?.minPrice !== undefined) {
        filtered = filtered.filter(s => s.pricePerHour >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
        filtered = filtered.filter(s => s.pricePerHour <= filters.maxPrice!);
    }

    if (filters?.amenities && filters.amenities.length > 0) {
        filtered = filtered.filter(s =>
            filters.amenities!.every(amenity => s.amenities.includes(amenity))
        );
    }

    return filtered;
};

/**
 * Search spaces by query
 */
export const searchSpaces = (query: string): SpaceDetail[] => {
    const lowerQuery = query.toLowerCase();
    return mockSpaces.filter(
        space =>
            space.name.toLowerCase().includes(lowerQuery) ||
            space.description.toLowerCase().includes(lowerQuery) ||
            space.location.city.toLowerCase().includes(lowerQuery) ||
            space.location.address.toLowerCase().includes(lowerQuery)
    );
};

/**
 * Calculate wallet balance from transactions
 */
export const calculateWalletBalance = (): number => {
    return mockTransactions.reduce((balance, txn) => {
        if (txn.status !== 'completed') return balance;
        return txn.type === 'credit' ? balance + txn.amount : balance - txn.amount;
    }, 0);
};



// Special card mock data ||
//---------------------------
//---------------------------


export const MOCK_OFFERS: SpecialOfferCardProps[] = [
    {
        title: 'Weekend Special',
        subtitle: 'Get 30% off on all conference rooms this weekend.',
        discount: '30',
        badgeText: 'Limited Time',
        image: { uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' },
    },
    {
        title: 'New User Bonus',
        subtitle: 'Flat 50% off on your first booking with us.',
        discount: '50',
        badgeText: 'New Users',
        image: { uri: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800' },
    },
    {
        title: 'Coworking Day',
        subtitle: 'Book a desk for a day and get free coffee.',
        discount: '20',
        badgeText: 'Hot Deal',
        image: { uri: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800' },
    },
];


export interface Category {
    id: string;
    name: string;
    icon: string;
    library: 'ionicons' | 'material' | 'fontawesome';
}

export const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Dedicated', icon: 'person', library: 'ionicons' },
    { id: '2', name: 'Conference', icon: 'people', library: 'ionicons' },
    { id: '3', name: 'Private', icon: 'file-tray-full', library: 'ionicons' },
    { id: '4', name: 'Open Space', icon: 'planet', library: 'ionicons' },
];

// ============================================================================
// DERIVED LISTS FOR CARDS
// ============================================================================

/**
 * Unified list of space items for cards (Home, Explore, etc.)
 * Derived from mockSpaces to ensure consistency between details and cards.
 */
export const MOCK_SPACE_CARDS: SpaceListItem[] = mockSpaces.map(mapToSpaceListItem);

