const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    next();
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'your_stripe_test_key_here');

// Health check endpoint
app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.json({ status: 'ok', message: 'Server is running' });
});

// Simple test endpoint
app.get('/test', (req, res) => {
    console.log('Test endpoint hit!');
    res.json({ message: 'Hi from backend!', timestamp: new Date().toISOString() });
});

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log('Creating payment intent for amount:', amount);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'inr',
            automatic_payment_methods: { enabled: true },
        });

        console.log('Payment intent created:', paymentIntent.id);

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Listen on all interfaces (0.0.0.0) so Android emulator can connect
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
    console.log('Accessible from Android emulator at http://10.0.2.2:3000');
    console.log('Health check: http://10.0.2.2:3000/health');
});
