import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
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
}));
app.use(express.json());

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
});
