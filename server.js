require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Ensure environment variables are set
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, PARENT_PHONE_NUMBER } = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER || !PARENT_PHONE_NUMBER) {
    console.error("❌ Missing Twilio environment variables! Check your .env file.");
    process.exit(1);
}

// Initialize Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// POST /alert endpoint
app.post("/alert", async (req, res) => {
    try {
        const { keywords, phoneNumber } = req.body;

        // Validate keywords
        if (!Array.isArray(keywords) || keywords.length === 0) {
            return res.status(400).json({ success: false, error: "Invalid or empty keywords array" });
        }

        // Validate phone number format
        if (!phoneNumber || !/^\+\d{10,15}$/.test(phoneNumber)) {
            return res.status(400).json({ success: false, error: "Invalid phone number format" });
        }

        // Ensure "To" and "From" numbers are not the same
        if (phoneNumber === TWILIO_PHONE_NUMBER) {
            return res.status(400).json({ success: false, error: "To and From numbers cannot be the same" });
        }

        // Create message string
        const message = `Alert! Your child may have viewed explicit content: ${keywords.join(", ")}`;

        // Send SMS using Twilio
        const response = await client.messages.create({
            body: message,
            from:+14708375974,
            to: +918714463747 // Send the message to parent's number from .env
        });

        console.log("✅ Message sent:", response.sid);
        res.status(200).json({ success: true, message: "Alert sent successfully" });

    } catch (error) {
        console.error("❌ Twilio Error:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error", details: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
