import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';

// Configure environment
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

// Initialize Google Sheets API
let sheets;
try {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  sheets = google.sheets({ version: 'v4', auth });
} catch (error) {
  console.error('❌ Google Auth initialization failed:', error.message);
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Helper functions
const cleanSheetValue = (value) => {
  if (typeof value !== 'string') return value;
  // Remove commas from numbers and trim whitespace
  if (/^\d+,\d+$/.test(value)) return value.replace(/,/g, '');
  return value.trim();
};

const sendEmailWithRetry = async (mailOptions, maxAttempts = 3) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });

  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (error) {
      attempt++;
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

// Routes
app.post('/api/submit-inquiry', async (req, res) => {
  try {
    const { name, email, phone, buyOrRent, propertyType, location, budget, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !buyOrRent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare data for Sheets
    const rowData = [
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name,
      email,
      phone.replace(/\D/g, ''),
      buyOrRent,
      propertyType || 'Not specified',
      location || 'Not specified',
      cleanSheetValue(budget) || 'Not specified',
      message || 'No message',
      'New Inquiry',
      `${process.env.CLIENT_URL}/view?email=${encodeURIComponent(email)}`
    ];

    // Submit to Google Sheets with retry
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Leads!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
      retry: true
    });

    // Send emails
    await Promise.all([
      sendEmailWithRetry({
        from: `"Cosmos Realty" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: '📩 New Property Inquiry',
        html: `...` // Admin email template
      }),
      sendEmailWithRetry({
        from: `"Cosmos Realty" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✅ Inquiry Received',
        html: `...` // Customer email template
      })
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});