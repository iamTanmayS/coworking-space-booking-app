export interface PaymentMethod {
    id: string;
    type: 'card' | 'upi' | 'wallet';
    details: string;
    isDefault: boolean;
}

export interface WalletState {
    balance: number;
    paymentMethods: PaymentMethod[];
    selectedPaymentMethod: PaymentMethod | null;
    loading: boolean;
}

export interface Transaction {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
}

export interface WalletBalance {
    balance: number;
}

export interface AddFundsRequest {
    amount: number;
    paymentMethodId: string;
}

export interface AddPaymentMethodRequest {
    type: 'card' | 'upi' | 'wallet';
    details: string;
}
