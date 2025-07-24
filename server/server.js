import path from "path";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from "./google-credentials.json" assert { type: "json" };

// Emulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 8081;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const sheetId = process.env.GOOGLE_SHEET_ID;

if (!user || !pass) {
  console.error("❌ EMAIL_USER or EMAIL_PASS not set in .env");
  process.exit(1);
}

app.use(
  cors({
    origin: "https://cosmostechreality.netlify.app",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.options("*", cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});

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
      <p>Thanks for contacting Cosmos Tech Realty LLC. Our nearest agent will contact you ASAP.</p>
      <p>Best Regards,<br/>Cosmos Tech Realty Team</p>
    `,
  };

  try {
    // 1. Send Emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(customerMail);

    // 2. Log to Google Sheet
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // first sheet

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const detailURL = `mailto:${email}?subject=Inquiry Follow-up - ${name}`;

    await sheet.addRow({
      Timestamp: timestamp,
      Name: name,
      Email: email,
      Phone: phone,
      "Buy/Rent": buyOrRent,
      "House Type": houseType,
      Area: area,
      "ZIP Code": zipCode,
      Message: extraInput,
      Status: "Not Finished",
      "Detail Link": detailURL,
    });

    res.status(200).json({ message: "Emails sent and inquiry logged successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
