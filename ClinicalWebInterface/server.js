const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 4000;

// Simple in-memory token store for demo purposes
const VALID_EMAIL = 'login@papaer.com';
const VALID_PASS = 'Pass@123';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Allow CORS from CRA dev server
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Utility to build a mock token (not secure; demo only)
function buildToken(email) {
  return Buffer.from(`${email}|${Date.now()}`).toString('base64');
}

 // PUBLIC_INTERFACE
 // POST /api/login - validate hardcoded credentials and return success + token
 app.post('/api/login', (req, res) => {
   /**
    * Login endpoint
    * Body: { email: string, password: string }
    * Success: 200 { success: true, token: string, user: { id, email, name } }
    * Failure: 401 { success: false, message: 'Invalid credentials' }
    */
   let { email, password } = req.body || {};
 
   // Minimal diagnostic logging (mask password length only)
   try {
     const maskedLen = typeof password === 'string' ? password.length : 0;
     console.log('[POST /api/login] payload:', {
       email: typeof email === 'string' ? email : typeof email,
       password_len: maskedLen,
     });
   } catch (_) {
     // ignore logging failures
   }
 
   // Normalize basic input (trim to avoid accidental spaces)
   if (typeof email === 'string') email = email.trim();
   if (typeof password === 'string') password = password.trim();
 
   if (email === VALID_EMAIL && password === VALID_PASS) {
     const token = buildToken(email);
     const user = { id: 'demo-user-1', email, name: 'Demo User' };
     // For simplicity, also set a non-httpOnly cookie (demo only)
     res.cookie('demo_token', token, { sameSite: 'Lax' });
     return res.json({ success: true, token, user });
   }
   return res.status(401).json({ success: false, message: 'Invalid credentials' });
 });

// PUBLIC_INTERFACE
// GET /api/me - validate token presence (cookie or Authorization header) and return a mock user
app.get('/api/me', (req, res) => {
  /**
   * Returns the current user if a demo token is present.
   * Checks demo_token cookie or Bearer token.
   */
  const cookieToken = req.cookies?.demo_token;
  const auth = req.headers['authorization'] || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const token = cookieToken || bearer;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  // Decode email from token (not secure, demo only)
  let email = VALID_EMAIL;
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    email = raw.split('|')[0] || VALID_EMAIL;
  } catch {
    // ignore parse errors; still allow for demo
  }
  return res.json({ success: true, user: { id: 'demo-user-1', email, name: 'Demo User' } });
});

// PUBLIC_INTERFACE
// POST /api/logout - clear cookie
app.post('/api/logout', (req, res) => {
  res.clearCookie('demo_token');
  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Auth demo API running on http://localhost:${PORT}`);
});
