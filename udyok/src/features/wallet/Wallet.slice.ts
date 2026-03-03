import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { PaymentMethod, WalletState } from './wallet.types';

const initialState: WalletState = {
    balance: 0,
    paymentMethods: [],
    selectedPaymentMethod: null,
    loading: false,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload;
        },
        addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
            state.paymentMethods.push(action.payload);
        },
        removePaymentMethod: (state, action: PayloadAction<string>) => {
            state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
        },
        setSelectedPaymentMethod: (state, action: PayloadAction<PaymentMethod | null>) => {
            state.selectedPaymentMethod = action.payload;
        },
        setWalletLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setBalance, addPaymentMethod, removePaymentMethod, setSelectedPaymentMethod, setWalletLoading } = walletSlice.actions;
export default walletSlice.reducer;
