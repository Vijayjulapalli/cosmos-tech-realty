import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 8081;

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'SPREADSHEET_ID', 'GOOGLE_CREDENTIALS'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
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

// Configure middleware
app.use(cors({
  origin: 'https://cosmostechreality.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('🚀 Cosmos Tech Realty Server is running');
});

// Form submission endpoint
app.post('/api/submit-inquiry', async (req, res) => {
  const {
    name,
    email,
    phone,
    buyOrRent,
    propertyType,
    location,
    budget,
    message
  } = req.body;

  // Validate required fields
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const profileUrl = `https://cosmostechreality.netlify.app/view?email=${encodeURIComponent(email)}`;

  try {
    // Save to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Leads!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          timestamp,
          name,
          email,
          phone,
          buyOrRent || 'Not specified',
          propertyType || 'Not specified',
          location || 'Not specified',
          budget || 'Not specified',
          message || 'No message',
          'New Inquiry',
          profileUrl
        ]]
      }
    });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send emails
    await Promise.all([
      // Admin notification
      transporter.sendMail({
        from: `"Cosmos Tech Realty" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Inquiry: ${name} - ${propertyType || 'Property'}`,
        html: `
          <h2>New Property Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Interest:</strong> ${buyOrRent || 'Not specified'}</p>
          <p><strong>Property Type:</strong> ${propertyType || 'Not specified'}</p>
          <p><strong>Location:</strong> ${location || 'Not specified'}</p>
          <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Message:</strong> ${message || 'No message'}</p>
          <p><strong>Profile URL:</strong> <a href="${profileUrl}">View Details</a></p>
        `
      }),
      // Customer confirmation
      transporter.sendMail({
        from: `"Cosmos Tech Realty" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'We Received Your Inquiry',
        html: `
          <p>Dear ${name},</p>
          <p>Thank you for contacting Cosmos Tech Realty. We've received your inquiry:</p>
          <ul>
            <li><strong>Type:</strong> ${buyOrRent || 'Not specified'}</li>
            <li><strong>Property:</strong> ${propertyType || 'Not specified'}</li>
            <li><strong>Location:</strong> ${location || 'Not specified'}</li>
            <li><strong>Budget:</strong> ${budget || 'Not specified'}</li>
          </ul>
          <p>Our agent will contact you within 24 hours.</p>
          <p>You can view your inquiry details <a href="${profileUrl}">here</a>.</p>
          <p>Best regards,<br>Cosmos Tech Realty Team</p>
        `
      })
    ]);

    res.status(200).json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      error: 'Failed to process inquiry',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});