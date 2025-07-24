import path from "path";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import { google } from "googleapis";
import { fileURLToPath } from "url";

// Emulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ✅ Load credentials without using assert (Render compatible)
const creds = JSON.parse(fs.readFileSync(path.join(__dirname, "google-credentials.json"), "utf-8"));

// ✅ Configure Google Sheets access
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: "v4", auth });

// Spreadsheet ID and range
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Inquiries"; // Make sure this sheet exists

// ✅ Email setup
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass || !SPREADSHEET_ID) {
  console.error("❌ EMAIL_USER, EMAIL_PASS, or SPREADSHEET_ID not set in .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

// ✅ Express app setup
const app = express();
const port = process.env.PORT || 8081;

app.use(cors({
  origin: "https://cosmostechreality.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.options("*", cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});

// ✅ Form submission
app.post("/api/send-inquiry", async (req, res) => {
  const { name, email, phone, buyOrRent, houseType, area, zipCode, extraInput } = req.body;

  const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const inquiryLink = `mailto:${email}?subject=Follow-up: Property Inquiry&body=Details:\nName: ${name}\nPhone: ${phone}\nArea: ${area}`;

  const row = [
    timestamp,
    name,
    email,
    phone,
    buyOrRent,
    houseType,
    area,
    zipCode,
    extraInput,
    "Not Finished", // Admin checklist column (editable)
    inquiryLink,
  ];

  try {
    // ✅ Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    // ✅ Send email to admin
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

    // ✅ Send confirmation to customer
    const customerMail = {
      from: `"Cosmos Realty" <${user}>`,
      to: email,
      subject: "✅ We've received your inquiry",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for contacting Cosmos Tech Realty LLC. Our agent will reach out to you shortly.</p>
        <p>Best,<br/>Cosmos Tech Realty Team</p>
      `,
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(customerMail);

    res.status(200).json({ message: "Emails sent and data logged to sheet." });
  } catch (error) {
    console.error("❌ Submission error:", error);
    res.status(500).json({ error: "Failed to send emails or log data." });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
