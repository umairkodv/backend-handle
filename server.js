const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

require("dotenv").config();
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Debug test route (optional)
app.get("/test", (req, res) => {
    res.send({
        message: "Server is live",
        stripeKeyLoaded: !!process.env.STRIPE_SECRET_KEY
    });
});

app.post("/create-payment-intent", async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);
        console.log("Stripe secret key exists:", !!process.env.STRIPE_SECRET_KEY);

        const { amount } = req.body;

        if (!amount || typeof amount !== "number") {
            throw new Error("Invalid amount provided");
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // in cents
            currency: "usd",
        });

        console.log("PaymentIntent created:", paymentIntent.id);

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error("Error creating PaymentIntent:", err.message);
        res.status(500).send({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Stripe server running on port ${PORT}`);
});
