// Wallet API
import { baseApi } from '../../api/base.api';
import type {
    PaymentMethod,
    Transaction,
    WalletBalance,
    AddFundsRequest,
    AddPaymentMethodRequest,
} from './wallet.types';

export const walletApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBalance: builder.query<WalletBalance, void>({
            query: () => '/wallet/balance',
            providesTags: ['Wallet'],
        }),

        getTransactions: builder.query<Transaction[], void>({
            query: () => '/wallet/transactions',
            providesTags: ['Wallet'],
        }),

        addFunds: builder.mutation<WalletBalance, AddFundsRequest>({
            query: (data) => ({
                url: '/wallet/add-funds',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Wallet'],
        }),

        getPaymentMethods: builder.query<PaymentMethod[], void>({
            query: () => '/wallet/payment-methods',
            providesTags: ['Wallet'],
        }),

        addPaymentMethod: builder.mutation<PaymentMethod, AddPaymentMethodRequest>({
            query: (data) => ({
                url: '/wallet/payment-methods',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Wallet'],
        }),

        removePaymentMethod: builder.mutation<void, string>({
            query: (id) => ({
                url: `/wallet/payment-methods/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Wallet'],
        }),

        setDefaultPaymentMethod: builder.mutation<PaymentMethod, string>({
            query: (id) => ({
                url: `/wallet/payment-methods/${id}/default`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Wallet'],
        }),
    }),
});

export const {
    useGetBalanceQuery,
    useGetTransactionsQuery,
    useAddFundsMutation,
    useGetPaymentMethodsQuery,
    useAddPaymentMethodMutation,
    useRemovePaymentMethodMutation,
    useSetDefaultPaymentMethodMutation,
} = walletApi;
