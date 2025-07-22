const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

// Check environment variables
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass) {
  console.error("❌ EMAIL_USER or EMAIL_PASS missing in .env");
  process.exit(1);
}

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend API is running with Nodemailer!");
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

  const adminHtml = `
    <h2>New Property Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Buy or Rent:</strong> ${buyOrRent}</p>
    <p><strong>House Type:</strong> ${houseType}</p>
    <p><strong>Area:</strong> ${area}</p>
    <p><strong>ZIP Code:</strong> ${zipCode}</p>
    <p><strong>Message:</strong> ${extraInput}</p>
  `;

  const customerHtml = `
    <p>Hi ${name},</p>
    <p>Thank you for contacting Cosmos Tech Realty LLC. We’ve received your request and will get back to you shortly.</p>
    <p>Best regards,<br/>Cosmos Tech Realty Team</p>
  `;

  try {
    // Email to Admin
    await transporter.sendMail({
      from: `"Cosmos Realty" <${user}>`,
      to: user,
      subject: "📩 New Property Inquiry",
      html: adminHtml,
    });

    // Confirmation Email to Customer
    await transporter.sendMail({
      from: `"Cosmos Realty" <${user}>`,
      to: email,
      subject: "✅ We’ve received your inquiry",
      html: customerHtml,
    });

    res.status(200).json({
      message:
        "Inquiry submitted successfully! Our local agent will reach out to you soon.",
    });
  } catch (error) {
    console.error("❌ Failed to send emails:", error);
    res.status(500).json({
      error:
        "Something went wrong while sending emails. Please try again later.",
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend server is running at http://localhost:${port}`);
});
