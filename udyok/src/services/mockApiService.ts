/**
 * Mock API Service
 * 
 * Simulates API responses for development and testing
 * Toggle between mock and real API by changing the USE_MOCK_API flag
 */

import {
    mockCurrentUser,
    mockSpaces,
    mockBookings,
    mockPaymentMethods,
    mockTransactions,
    mockChats,
    mockMessages,
    mockSettings,
    mockFavoriteIds,
    delay,
    getSpaceById,
    getBookingById,
    getFilteredBookings,
    getFilteredSpaces,
    searchSpaces,
    calculateWalletBalance,
    mapToSpaceListItem,
} from './mockData';

// Create a local mutable copy of favorite IDs for this session
const localFavoriteIds = [...mockFavoriteIds];

import type { User } from '../features/user/user.types';
import type { SpaceListItem, SpaceDetail, SpaceListParams, SpaceListResponse } from '../features/spaces/spaces.types';
import type { Booking } from '../features/booking/booking.types';
import type { PaymentMethod, Transaction } from '../features/wallet/wallet.types';
import type { Chat, Message } from '../features/chat/chat.types';
import type { Settings } from '../features/settings/settings.types';
import type { PaginatedResponse } from '../features/pagination/pagination.type';
import type {
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyCodeRequest,
    VerifyCodeResponse,
    ResendCodeRequest
} from '../features/authentication/auth.types';
import type { Review, WriteReviewRequest, WriteReviewResponse } from '../features/reviews/review.type';

// ============================================================================
// CONFIGURATION
// ============================================================================

export const USE_MOCK_API = true; // Set to false when backend is ready
const MOCK_DELAY = 800; // Simulate network delay in ms

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const mockAuthService = {
    async login(credentials: LoginRequest) {
        await delay(MOCK_DELAY);
        const { email, password } = credentials;

        // Simulate validation
        if (email === 'test@udyok.com' && password === 'password123') {
            return {
                accessToken: 'mock_access_token_' + Date.now(),
                refreshToken: 'mock_refresh_token_' + Date.now(),
                user: mockCurrentUser,
            };
        }

        throw new Error('Invalid credentials');
    },

    async register(userData: RegisterRequest): Promise<RegisterResponse> {
        await delay(MOCK_DELAY);

        return {
            message: 'Registration successful. Verification code sent to your email.'
        };
    },

    async forgotPassword(data: ForgotPasswordRequest) {
        await delay(MOCK_DELAY);
        return { message: 'Password reset email sent' };
    },

    async resetPassword(data: ResetPasswordRequest) {
        await delay(MOCK_DELAY);
        return { message: 'Password reset successful' };
    },

    async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
        await delay(MOCK_DELAY);
        if (data.otp === '1234') {
            return {
                accessToken: 'mock_access_token_' + Date.now(),
                refreshToken: 'mock_refresh_token_' + Date.now(),
                user: {
                    id: '123',
                    email: data.email,
                    name: 'Tanmay',
                    location: null,
                    isVerified: true,
                    isProfileComplete: false,
                    isOnboarded: false
                }
            };
        }
        throw new Error('Invalid verification code');
    },

    async resendCode(data: ResendCodeRequest) {
        await delay(MOCK_DELAY);
        return { message: 'Verification code resent' };
    },

    async refreshToken() {
        await delay(MOCK_DELAY);
        return { token: 'mock_jwt_token_refreshed_' + Date.now() };
    },
};

// ============================================================================
// USER
// ============================================================================

export const mockUserService = {
    async getProfile(): Promise<User> {
        await delay(MOCK_DELAY);
        return mockCurrentUser;
    },

    async updateProfile(updates: Partial<User>): Promise<User> {
        await delay(MOCK_DELAY);
        return { ...mockCurrentUser, ...updates };
    },

    async uploadAvatar(file: any): Promise<{ avatarUrl: string }> {
        await delay(MOCK_DELAY);
        const newAvatar = 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70);
        mockCurrentUser.avatar = newAvatar; // Update mock data
        return { avatarUrl: newAvatar };
    },


    async updateLocation(data: any): Promise<any> {
        await delay(MOCK_DELAY);
        return {
            message: 'Location updated successfully',
            location: {
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city,
                country: data.country,
            },
        };
    },
};

export const mockChatService = {
    async getChats(): Promise<Chat[]> {
        await delay(MOCK_DELAY);
        return mockChats;
    },

    async getMessages(chatId: string): Promise<Message[]> {
        await delay(MOCK_DELAY);
        return mockMessages[chatId] || [];
    },

    async sendMessage(chatId: string, text: string): Promise<Message> {
        await delay(MOCK_DELAY);
        const newMessage: Message = {
            _id: `msg_${Date.now()}`,
            conversationId: chatId,
            senderId: 'user_001', // Current user
            text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            type: 'text',
            readBy: [],
        };

        if (!mockMessages[chatId]) {
            mockMessages[chatId] = [];
        }
        mockMessages[chatId].push(newMessage);

        // Update last message in chat list
        const chatIndex = mockChats.findIndex(c => c._id === chatId);
        if (chatIndex !== -1) {
            mockChats[chatIndex].lastMessage = text;
            mockChats[chatIndex].lastMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return newMessage;
    },

    async markAsRead(chatId: string): Promise<void> {
        await delay(MOCK_DELAY);
        const chatIndex = mockChats.findIndex(c => c._id === chatId);
        if (chatIndex !== -1) {
            mockChats[chatIndex].unreadCounts = {};
        }
    },
};

// ============================================================================
// SPACES
// ============================================================================

export const mockSpacesService = {
    async getSpaces(params?: SpaceListParams): Promise<SpaceListResponse> {
        await delay(MOCK_DELAY);

        let filtered = params?.query ? searchSpaces(params.query) : getFilteredSpaces(params);

        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;

        const paginatedData = filtered.slice(start, end).map(mapToSpaceListItem);

        return {
            data: paginatedData,
            total: filtered.length,
            page,
            totalPages: Math.ceil(filtered.length / limit),
            limit,
        };
    },

    async getSpace(id: string): Promise<SpaceDetail> {
        await delay(MOCK_DELAY);

        const space = getSpaceById(id);
        if (!space) {
            throw new Error('Space not found');
        }

        return space;
    },

    async searchSpaces(query: string, filters?: any): Promise<SpaceListItem[]> {
        await delay(MOCK_DELAY);
        return searchSpaces(query).map(mapToSpaceListItem);
    },

    async createSpace(data: any): Promise<SpaceDetail> {
        await delay(MOCK_DELAY);

        const newSpace: SpaceDetail = {
            id: 'space_' + Date.now(),
            ...data,
            rating: 0,
        };

        return newSpace;
    },

    async updateSpace(id: string, data: any): Promise<SpaceDetail> {
        await delay(MOCK_DELAY);

        const space = getSpaceById(id);
        if (!space) {
            throw new Error('Space not found');
        }

        return { ...space, ...data };
    },

    async deleteSpace(id: string): Promise<void> {
        await delay(MOCK_DELAY);
    },
};

// ============================================================================
// BOOKINGS
// ============================================================================

export const mockBookingsService = {
    async getBookings(filters?: {
        status?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<Booking[]> {
        await delay(MOCK_DELAY);
        return getFilteredBookings(filters);
    },

    async getBooking(id: string): Promise<Booking> {
        await delay(MOCK_DELAY);

        const booking = getBookingById(id);
        if (!booking) {
            throw new Error('Booking not found');
        }

        return booking;
    },

    async createBooking(data: any): Promise<Booking> {
        await delay(MOCK_DELAY);

        const newBooking: Booking = {
            id: 'booking_' + Date.now(),
            userId: mockCurrentUser.id,
            status: 'pending',
            totalAmount: 0,
            ...data,
        };

        return newBooking;
    },

    async updateBooking(id: string, data: any): Promise<Booking> {
        await delay(MOCK_DELAY);

        const booking = getBookingById(id);
        if (!booking) {
            throw new Error('Booking not found');
        }

        return { ...booking, ...data };
    },

    async cancelBooking(id: string): Promise<void> {
        await delay(MOCK_DELAY);
    },
};

// ============================================================================
// WALLET
// ============================================================================

export const mockWalletService = {
    async getBalance(): Promise<{ balance: number }> {
        await delay(MOCK_DELAY);
        return { balance: calculateWalletBalance() };
    },

    async getTransactions(): Promise<Transaction[]> {
        await delay(MOCK_DELAY);
        return mockTransactions;
    },

    async addFunds(amount: number, paymentMethodId: string): Promise<{ balance: number }> {
        await delay(MOCK_DELAY);
        return { balance: calculateWalletBalance() + amount };
    },

    async getPaymentMethods(): Promise<PaymentMethod[]> {
        await delay(MOCK_DELAY);
        return mockPaymentMethods;
    },

    async addPaymentMethod(data: any): Promise<PaymentMethod> {
        await delay(MOCK_DELAY);

        const newMethod: PaymentMethod = {
            id: 'pm_' + Date.now(),
            isDefault: false,
            ...data,
        };

        return newMethod;
    },

    async removePaymentMethod(id: string): Promise<void> {
        await delay(MOCK_DELAY);
    },

    async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
        await delay(MOCK_DELAY);

        const method = mockPaymentMethods.find(m => m.id === id);
        if (!method) {
            throw new Error('Payment method not found');
        }

        return { ...method, isDefault: true };
    },
};

// ============================================================================
// FAVORITES
// ============================================================================

export const mockFavoritesService = {
    async getFavorites(filters?: {
        page?: number;
        limit?: number;
        query?: string;
    }): Promise<PaginatedResponse<SpaceListItem>> {
        await delay(MOCK_DELAY);

        // 1. Get all favorite spaces
        // Use localFavoriteIds instead of imported constant
        let relevantSpaces = mockSpaces.filter(space => localFavoriteIds.includes(space.id));

        // 2. Apply Search Filter
        if (filters?.query) {
            const q = filters.query.toLowerCase();
            relevantSpaces = relevantSpaces.filter(space =>
                space.name.toLowerCase().includes(q) ||
                space.location.city.toLowerCase().includes(q)
            );
        }

        // 3. Pagination
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;

        return {
            data: relevantSpaces.slice(start, end).map(mapToSpaceListItem),
            total: relevantSpaces.length,
            page,
            totalPages: Math.ceil(relevantSpaces.length / limit),
            limit
        };
    },

    async addFavorite(spaceId: string): Promise<void> {
        await delay(MOCK_DELAY);
        if (!localFavoriteIds.includes(spaceId)) {
            localFavoriteIds.push(spaceId);
            // Also update the mock space object to reflect change
            const space = mockSpaces.find(s => s.id === spaceId);
            if (space) space.isFavorite = true;
        }
    },

    async removeFavorite(spaceId: string): Promise<void> {
        await delay(MOCK_DELAY);
        const index = localFavoriteIds.indexOf(spaceId);
        if (index > -1) {
            localFavoriteIds.splice(index, 1);
            // Also update the mock space object
            const space = mockSpaces.find(s => s.id === spaceId);
            if (space) space.isFavorite = false;
        }
    },
};



// ============================================================================
// SETTINGS
// ============================================================================

export const mockSettingsService = {
    async getSettings(): Promise<Settings> {
        await delay(MOCK_DELAY);
        return mockSettings;
    },

    async updateSettings(updates: Partial<Settings>): Promise<Settings> {
        await delay(MOCK_DELAY);
        return { ...mockSettings, ...updates };
    },
};

// ============================================================================
// REVIEWS
// ============================================================================

export const mockReviewsService = {
    async getReviews(spaceId: string, page: number = 1): Promise<PaginatedResponse<Review>> {
        await delay(MOCK_DELAY);
        // Return empty reviews for now — real data will come from backend
        return {
            data: [],
            total: 0,
            page,
            limit: 10,
            totalPages: 0,
        };
    },

    async createReview(spaceId: string, data: WriteReviewRequest): Promise<WriteReviewResponse> {
        await delay(MOCK_DELAY);
        return {
            reviewId: 'review_' + Date.now(),
            message: 'Review submitted successfully',
        };
    },
};

