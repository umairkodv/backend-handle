const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send-confirmation-email", async (req, res) => {
  const { business_organization, name, email, phone, boothType, totalPrice } = req.body;

  if (!name || !email || !phone || !boothType || !totalPrice) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // Message to admin
  const adminMessage = `
    New Vendor Registration:

    Business/Organization Name: ${business_organization}
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Booth Type: ${boothType}
    Total Paid: $${totalPrice}
  `;

  // Message to client
  const clientMessage = `
    Hello ${name},

    Thank you for registering as a vendor with Africatown Land Trust!

    We’ve received your payment of $${totalPrice} and your registration details:

    Business/Organization Name: ${business_organization}
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Booth Type: ${boothType}
    Total Paid: $${totalPrice}

    We look forward to seeing you at the event!

    Best regards,  
    Africatown Land Trust Team
  `;

  const adminEmail = {
    to: "marketing@africatownlandtrust.org",
    from: "marketing@africatownlandtrust.org",
    subject: "New Vendor Registration",
    text: adminMessage
  };

  const clientEmail = {
    to: email,
    from: "marketing@africatownlandtrust.org",
    subject: "Thank You for Registering with Africatown",
    text: clientMessage
  };

  try {
    // Send both emails
    await sgMail.send(adminEmail);
    await sgMail.send(clientEmail);

    res.status(200).json({ success: true, message: "Emails sent." });
  } catch (error) {
    console.error("SendGrid Error:", error);
    if (error.response) {
      console.error("SendGrid response body:", error.response.body);
    }
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

module.exports = router;
