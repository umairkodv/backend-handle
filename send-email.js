const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send-confirmation-email", async (req, res) => {
  const { business_organization, name, email, phone, boothType, totalPrice } = req.body;

  // Check for missing or empty fields
  if (!name || !email || !phone || !boothType || !totalPrice) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const message = `
    New Vendor Registration:

    Business/Organization Name: ${business_organization}
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Booth Type: ${boothType}
    Total Paid: $${totalPrice}
  `;

  const msg = {
    to: [
      "zubairkhanyousafzaie@gmail.com",
      "backendtmw@gmail.com"
    ],
    from: "marketing@africatownlandtrust.org",
    subject: "New Vendor Registration",
    text: message
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: "Email sent." });
  } catch (error) {
    console.error("SendGrid Error:", error);
    if (error.response) {
      console.error("SendGrid response body:", error.response.body);
    }
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

module.exports = router;
