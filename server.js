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
        const { amount } = req.body;

        // Validate amount
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).send({ error: "Invalid amount provided" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // in cents
            currency: "usd",
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Stripe server running on port ${PORT}`);
});
