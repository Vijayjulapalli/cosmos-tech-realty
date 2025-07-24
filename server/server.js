import path from "path";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 8081;

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const spreadsheetId = process.env.SPREADSHEET_ID;
const credsJson = process.env.GOOGLE_CREDENTIALS;

if (!user || !pass || !spreadsheetId || !credsJson) {
  console.error("❌ Missing EMAIL_USER, EMAIL_PASS, SPREADSHEET_ID, or GOOGLE_CREDENTIALS");
  process.exit(1);
}

// ✅ Write GOOGLE_CREDENTIALS env variable to temp file
const credsPath = path.join(__dirname, "temp-creds.json");
fs.writeFileSync(credsPath, credsJson);

// ✅ Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  keyFile: credsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

app.use(cors({
  origin: "https://cosmostechreality.netlify.app",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});

app.post("/api/send-inquiry", async (req, res) => {
  const { name, email, phone, buyOrRent, houseType, area, zipCode, extraInput } = req.body;
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const uniqueUrl = `https://cosmostechreality.netlify.app/view?email=${encodeURIComponent(email)}`;

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
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail(adminMail);
    await transporter.sendMail(customerMail);

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
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Failed to send email or save to Sheets because of error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
