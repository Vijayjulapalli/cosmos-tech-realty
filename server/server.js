import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env config
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 8080;

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const spreadsheetId = process.env.SPREADSHEET_ID;
const credsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;

if (!user || !pass || !spreadsheetId || !credsBase64) {
  console.error("❌ Missing one or more required environment variables");
  process.exit(1);
}

// ✅ Decode GOOGLE_CREDENTIALS_BASE64 and write to a temporary file
const decodedCreds = Buffer.from(credsBase64, "base64").toString("utf-8");
const credsPath = path.join(os.tmpdir(), "google-creds.json");
fs.writeFileSync(credsPath, decodedCreds);

// ✅ Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  keyFile: credsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

app.use(express.json());

// ✅ CORS for frontend
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});

app.post("/api/send-inquiry", async (req, res) => {
  const { name, email, phone, buyOrRent, houseType, area, zipCode, extraInput } = req.body;
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const uniqueUrl = `${process.env.CLIENT_URL}/view?email=${encodeURIComponent(email)}`;

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
      <p>Thanks for contacting Cosmos Tech Realty LLC. Our agent will reach out to you shortly.</p>
    `,
  };

  try {
    // ✅ Send emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail(adminMail);
    await transporter.sendMail(customerMail);

    // ✅ Save to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [timestamp, name, email, phone, buyOrRent, houseType, area, zipCode, extraInput, "Not Finished", uniqueUrl],
        ],
      },
    });

    res.status(200).json({ message: "Inquiry sent and saved to Google Sheets." });
  } catch (error) {
    console.error("❌ Submission failed:", error);
    res.status(500).json({ error: "Failed to send email or save to Sheets" });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
