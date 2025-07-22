// server/server.js

import path from "path";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Emulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = 8081;

// Get credentials from .env
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass) {
  console.error("❌ EMAIL_USER or EMAIL_PASS not set in .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});

// Inquiry submission
app.post("/api/send-inquiry", async (req, res) => {
  const { name, email, phone, buyOrRent, houseType, area, zipCode, extraInput } = req.body;

  const adminMail = {
    from: `"Cosmos Realty" <${user}>`,
    to: user,
    subject: "📩 New Property Inquiry",
    html: `
      <h2>New Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Buy/Rent:</strong> ${buyOrRent}</p>
      <p><strong>House Type:</strong> ${houseType}</p>
      <p><strong>Area:</strong> ${area}</p>
      <p><strong>ZIP Code:</strong> ${zipCode}</p>
      <p><strong>Message:</strong> ${extraInput}</p>
    `,
  };

  const customerMail = {
    from: `"Cosmos Realty" <${user}>`,
    to: email,
    subject: "✅ We've received your inquiry",
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for contacting Cosmos Tech Realty LLC. We'll get back to you soon.</p>
      <p>Best,<br/>Cosmos Tech Realty Team</p>
    `,
  };

  try {
    await transporter.sendMail(adminMail);
    await transporter.sendMail(customerMail);

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ error: "Failed to send emails. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
