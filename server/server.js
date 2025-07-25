import path from "path";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { google } from "googleapis";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
<<<<<<< HEAD
const port = process.env.PORT || 10000;

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const spreadsheetId = process.env.SPREADSHEET_ID;
const credsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;

if (!user || !pass || !spreadsheetId || !credsBase64) {
  console.error("❌ Missing EMAIL_USER, EMAIL_PASS, SPREADSHEET_ID, or GOOGLE_CREDENTIALS_BASE64");
  process.exit(1);
}

// 🔐 Decode base64 JSON credentials
const decodedCredentials = Buffer.from(credsBase64, 'base64').toString('utf8');

// ✅ Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(decodedCredentials),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
=======
const PORT = process.env.PORT || 10000;

// Validate environment variables
const requiredVars = ['EMAIL_USER', 'EMAIL_PASS', 'SPREADSHEET_ID', 'GOOGLE_CREDENTIALS', 'CLIENT_URL'];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

// Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
>>>>>>> e5399d559a76d8480139a94047de52226bf28242
}));
app.options("*", cors());
app.use(express.json());

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.send("✅ Cosmos Realty Backend is Running");
});

app.post("/api/submit-inquiry", async (req, res) => {
  const {
    name, email, phone, buyOrRent,
    propertyType, location, zipCode, budget, message
  } = req.body;

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
      <p><strong>Property Type:</strong> ${propertyType}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>ZIP:</strong> ${zipCode}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  const customerMail = {
    from: `"Cosmos Realty" <${user}>`,
    to: email,
    subject: "✅ We've received your inquiry",
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for contacting Cosmos Tech Realty. We'll get back to you soon.</p>
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
          [timestamp, name, email, phone, buyOrRent, propertyType, location, zipCode, budget, message, "Pending", uniqueUrl],
        ],
      },
    });

    res.status(200).json({ message: "Inquiry submitted successfully!" });
  } catch (err) {
    console.error("❌ Submission failed:", err);
    res.status(500).json({ error: "Failed to send or save inquiry." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
=======
// Routes
app.post('/api/submit-inquiry', async (req, res) => {
  try {
    const { name, email, phone, buyOrRent, propertyType, location, zipCode, budget, message } = req.body;

    if (!name || !email || !phone || !buyOrRent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const url = `${process.env.CLIENT_URL}/view?email=${encodeURIComponent(email)}`;
    const rowData = [
      timestamp, name, email, phone.replace(/\D/g, ''), buyOrRent,
      propertyType || 'Not specified', location || 'Not specified',
      budget?.replace(/[^0-9]/g, '') || 'Not specified',
      message || 'No message', 'New Lead', url
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Leads!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] }
    });

    // Send emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminEmail = {
      from: `"Cosmos Realty" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '📩 New Property Inquiry',
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Type:</strong> ${buyOrRent}</p>
             <p><strong>Property:</strong> ${propertyType}</p>
             <p><strong>Location:</strong> ${location}</p>
             <p><strong>ZIP:</strong> ${zipCode}</p>
             <p><strong>Budget:</strong> ${budget}</p>
             <p><strong>Message:</strong> ${message}</p>`
    };

    const customerEmail = {
      from: `"Cosmos Realty" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We've received your inquiry",
      html: `<p>Hi ${name},</p>
             <p>Thanks for contacting Cosmos Tech Realty. We'll be in touch soon.</p>`
    };

    await transporter.sendMail(adminEmail);
    await transporter.sendMail(customerEmail);

    res.status(200).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('❌ Submission failed:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
>>>>>>> e5399d559a76d8480139a94047de52226bf28242
});
