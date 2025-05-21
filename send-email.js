const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send-confirmation-email", async (req, res) => {
  const {
    name,
    email,
    phone,
    boothType,
    totalPrice
  } = req.body;

  const message = `
    New Vendor Registration:

    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Booth Type: ${boothType}
    Total Paid: $${totalPrice}

    Please follow up with the registrant accordingly.
  `;

  const msg = {
    to: [
      "zubairkhanyousafzaie@gmail.com",
      "backendtmw@gmail.com"
    ],
    from: "events@africatownlandtrust.org", // must be verified with SendGrid
    subject: "New Vendor Registration",
    text: message
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: "Email sent." });
  } catch (error) {
    console.error("SendGrid Error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

module.exports = router;
