import express from "express";
import Stripe from 'stripe';
import cors from 'cors';
import { env } from "./config/config.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import spaceRoutes from "./routes/space.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

const app = express();
app.set('trust proxy', 1);
const stripe = new Stripe(env.stripe_client_secret);

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/spaces", spaceRoutes);
app.use("/", reviewRoutes);
app.use("/bookings", bookingRoutes);
app.use("/wallet", walletRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/settings", settingsRoutes);

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
    } catch (error: any) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(4000, "0.0.0.0", () => {
    console.log("Server running on port 4000");
});