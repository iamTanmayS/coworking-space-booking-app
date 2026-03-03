/**
 * Payment API Service
 * Handles communication with Stripe backend
 */

import { config } from '@/config';

const PAYMENT_SERVER_URL = config.apiUrl;

export interface PaymentIntentResponse {
    clientSecret: string;
}

/**
 * Test server connection
 */
export const testConnection = async (): Promise<boolean> => {
    try {
        console.log('[Payment API] Testing connection to:', `${PAYMENT_SERVER_URL}/test`);
        const response = await fetch(`${PAYMENT_SERVER_URL}/test`, {
            method: 'GET',
        });
        const data = await response.json();
        console.log('[Payment API] Connection test SUCCESS:', data);
        return response.ok;
    } catch (error) {
        console.error('[Payment API] Connection test FAILED:', error);
        return false;
    }
};

/**
 * Create a payment intent on the backend
 * @param amount - Amount in paise (₹500 = 50000 paise)
 * @returns Client secret for confirming payment
 */
export const createPaymentIntent = async (amount: number): Promise<string> => {
    try {
        console.log('[Payment API] Creating payment intent for amount:', amount);
        console.log('[Payment API] URL:', `${PAYMENT_SERVER_URL}/create-payment-intent`);

        const response = await fetch(`${PAYMENT_SERVER_URL}/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        });

        console.log('[Payment API] Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Payment API] Error response:', errorText);
            throw new Error(`Failed to create payment intent: ${response.status}`);
        }

        const data: PaymentIntentResponse = await response.json();
        console.log('[Payment API] Payment intent created successfully');
        return data.clientSecret;
    } catch (error) {
        console.error('[Payment API] Payment intent creation failed:', error);
        throw error;
    }
};

/**
 * Convert rupees to paise for Stripe
 * @param rupees - Amount in rupees (₹500)
 * @returns Amount in paise (50000)
 */
export const convertToPaise = (rupees: number): number => {
    return Math.round(rupees * 100);
};
