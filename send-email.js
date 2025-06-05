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
const clientMessageHtml = `
<p>Hello ${name},</p>

<p>Congratulations! We’ve received your payment for a Juneteenth vendor space, and your spot is officially reserved.</p>

<p>To finalize your registration, please complete your Vendor Registration Form as soon as possible.</p>

<p>Your registration is not considered complete until we receive your form.</p>

<p>
<strong>Click on the Link:</strong><br>
<a href="https://form.jotform.com/Africatown_Community/juneteenth-2025" target="_blank">
https://form.jotform.com/Africatown_Community/juneteenth-2025
</a>
</p>

<p>If you have any questions, please contact us at <a href="mailto:info@kingcountyequity.com">info@kingcountyequity.com</a>.</p>

<p>Best regards,<br>
Africatown Land Trust Team</p>
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
    subject: "Vendor Registration Fee Payment Confirmation",
    html: clientMessageHtml,
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
