const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const Resend = require("resend").default; // ✅ FIXED: Use default export

const app = express();
const port = 8081;

// Load API key
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error("❌ RESEND_API_KEY missing in .env");
  process.exit(1);
}
console.log("✅ RESEND_API_KEY loaded");

const resend = new Resend(resendApiKey); // ✅ Correctly initialized

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});

// Inquiry submission
app.post("/api/send-inquiry", async (req, res) => {
  const {
    name,
    email,
    phone,
    buyOrRent,
    houseType,
    area,
    zipCode,
    extraInput,
  } = req.body;

  try {
    // ✅ 1. Email to Admin
    const adminResponse = await resend.emails.send({
      from: "Cosmos Realty <onboarding@resend.dev>", // ✅ Replace with verified sender if needed
      to: "julapallivijay66@gmail.com",
      subject: "📩 New Property Inquiry",
      html: `
        <h2>New Property Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Buy or Rent:</strong> ${buyOrRent}</p>
        <p><strong>House Type:</strong> ${houseType}</p>
        <p><strong>Area:</strong> ${area}</p>
        <p><strong>ZIP Code:</strong> ${zipCode}</p>
        <p><strong>Message:</strong> ${extraInput}</p>
      `,
    });

    console.log("✅ Admin email result:", adminResponse);

    // ✅ 2. Email to Customer
    const customerResponse = await resend.emails.send({
      from: "Cosmos Realty <onboarding@resend.dev>",
      to: email,
      subject: "✅ We’ve received your inquiry",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting Cosmos Tech Realty LLC. We’ve received your request and will get back to you shortly.</p>
        <p>Best regards,<br/>Cosmos Tech Realty Team</p>
      `,
    });

    console.log("✅ Customer email result:", customerResponse);

    res.status(200).json({
      message: "Inquiry submitted successfully! Our local agent will reach out to you soon.",
    });
  } catch (error) {
    console.error("❌ Failed to send emails:", error);
    res.status(500).json({
      error: "Something went wrong while sending emails. Please try again later.",
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend server is running at http://localhost:${port}`);
});
