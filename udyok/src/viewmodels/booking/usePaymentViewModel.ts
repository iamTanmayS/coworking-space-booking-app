import { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { createPaymentIntent, convertToPaise } from '@/services/payment.api';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { clearDraftBooking } from '@/features/booking/Booking.slice';
import { useCreateBookingMutation } from '@/features/booking/booking.api';

export const usePaymentViewModel = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const stripe = useStripe();
    const dispatch = useAppDispatch();
    const draftBooking = useAppSelector(state => state.booking.draftBooking);
    const currentUser = useAppSelector(state => state.user.profile);
    const [createBookingMutation] = useCreateBookingMutation();

    /**
     * Process payment and create booking
     */
    const processPayment = async (
        totalAmount: number,
        spaceId: string,
        paymentMethodId?: string
    ): Promise<{ success: boolean; bookingId?: string }> => {
        setIsProcessing(true);
        setError(null);

        try {
            // Step 1: Create payment intent for backend
            const amountInPaise = convertToPaise(totalAmount);
            console.log('Creating payment intent for ₹', totalAmount, '(', amountInPaise, 'paise)');

            const clientSecret = await createPaymentIntent(amountInPaise);
            console.log('Payment intent created:', clientSecret);

            // Step 2: Confirm payment with Stripe
            let paymentParam: any = {};

            // Check for mock payment methods
            const mockMethods = ['wallet', 'paypal', 'apple', 'google'];
            if (paymentMethodId && mockMethods.includes(paymentMethodId)) {
                console.log('Using mock payment method:', paymentMethodId);
                // Simulate success for mock methods without calling Stripe
                const payload = {
                    spaceId: spaceId,
                    startDate: new Date(draftBooking.startDate || Date.now()).toISOString(),
                    endDate: new Date(draftBooking.startDate || Date.now()).toISOString(),
                    startTime: draftBooking.startTime || '',
                    endTime: draftBooking.endTime || '',
                    totalAmount,
                    paymentMethodId: paymentMethodId,
                    notes: draftBooking.notes,
                };

                const booking = await createBookingMutation(payload).unwrap();
                dispatch(clearDraftBooking());

                setIsProcessing(false);
                return { success: true, bookingId: booking.id };
            }

            if (paymentMethodId) {
                // If we have a real Stripe payment method ID (from Add Card)
                // We MUST provide paymentMethodType: 'Card' along with the ID
                paymentParam = {
                    paymentMethodId,
                    paymentMethodType: 'Card',
                };
            } else {
                // Default to collecting card details from CardField present on screen
                paymentParam = { paymentMethodType: 'Card' };
            }

            console.log('Confirming payment with params:', JSON.stringify(paymentParam));
            const { error: paymentError, paymentIntent } = await stripe.confirmPayment(clientSecret, paymentParam);

            if (paymentError) {
                console.error('Payment failed:', paymentError);
                setError(paymentError.message || 'Payment failed');
                setIsProcessing(false);
                return { success: false };
            }

            if (paymentIntent && paymentIntent.status === 'Succeeded') {
                console.log('Payment succeeded:', paymentIntent.id);

                // Step 3: Create booking
                const payload = {
                    spaceId: spaceId,
                    startDate: new Date(draftBooking.startDate || Date.now()).toISOString(),
                    endDate: new Date(draftBooking.startDate || Date.now()).toISOString(),
                    startTime: draftBooking.startTime || '',
                    endTime: draftBooking.endTime || '',
                    totalAmount,
                    paymentMethodId: paymentIntent.id,
                    notes: draftBooking.notes,
                };

                // Save booking to Backend
                const booking = await createBookingMutation(payload).unwrap();
                dispatch(clearDraftBooking());

                console.log('Booking created:', booking.id);

                setIsProcessing(false);
                return { success: true, bookingId: booking.id };
            } else {
                setError('Payment was not successful');
                setIsProcessing(false);
                return { success: false };
            }


        } catch (err: any) {
            console.error('Payment processing error:', err);
            setError(err.message || 'An error occurred during payment');
            setIsProcessing(false);
            return { success: false };
        }
    };

    return {
        processPayment,
        isProcessing,
        error,
        clearError: () => setError(null),
    };
};
