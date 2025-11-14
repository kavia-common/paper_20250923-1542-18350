import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { authMiddleware } from '../middleware/auth.js';
import { findUserByEmail, publicProfile } from '../users/demoUsers.js';

const router = express.Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(1).required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password must not be empty',
  }),
});

/**
 * Helper to sign access token (1h)
 */
function signAccessToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error('Server misconfiguration: JWT_SECRET not set'), { status: 500 });
  }
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '1h' });
}

/**
 * Helper to sign refresh token (7d) - scaffold for future use
 */
function signRefreshToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error('Server misconfiguration: JWT_SECRET not set'), { status: 500 });
  }
  const payload = {
    sub: user.id,
    type: 'refresh',
  };
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '7d' });
}

/**
 * PUBLIC_INTERFACE
 * POST /auth/login
 * Summary: Authenticate user and return JWT access token with basic profile.
 * Request body: { email: string, password: string }
 * Responses:
 *  - 200: { token: string, user: { id, email, role, name }, refreshToken?: string }
 *  - 400: { error: string } on invalid input
 *  - 401: { error: string } on bad credentials
 */
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body || {}, { abortEarly: true, stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { email, password } = value;

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signAccessToken(user);
    // Include refresh scaffolding in response for future use (client may ignore)
    const refreshToken = signRefreshToken(user);

    return res.status(200).json({
      token,
      user: publicProfile(user),
      refreshToken,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * PUBLIC_INTERFACE
 * GET /auth/me
 * Summary: Return current user info if Authorization: Bearer <token> is valid.
 * Responses:
 *  - 200: { user: { id, email, role, name } }
 *  - 401: { error: string } on invalid token
 */
router.get('/me', authMiddleware, (req, res) => {
  const { sub: id, email, role, name } = req.user || {};
  return res.status(200).json({ user: { id, email, role, name } });
});

/**
 * PUBLIC_INTERFACE
 * POST /auth/logout
 * Summary: Client-side logout hook. No-op on server; instruct client to delete token.
 * Responses:
 *  - 200: { success: true }
 */
router.post('/logout', (req, res) => {
  // No server-side state for JWT. Client should delete stored tokens.
  return res.status(200).json({ success: true, message: 'Logged out. Delete tokens on client.' });
});

/**
 * PUBLIC_INTERFACE
 * POST /auth/refresh
 * Summary: Exchange a valid refresh token for a new access token. (Scaffold)
 * Request body: { refreshToken: string }
 * Responses:
 *  - 200: { token: string }
 *  - 400/401 on invalid/expired token
 */
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(400).json({ error: 'refreshToken is required' });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET not set' });
  }
  try {
    const payload = jwt.verify(refreshToken, secret);
    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    // In real implementation, verify token against DB/whitelist/rotation.
    // For demo, reissue access token with known user id (email/role lookup optional).
    const userId = payload.sub;
    // Demo lookup by id is omitted; use email-less token creation as scaffold
    // If needed, fallback to limited info; clients primarily need auth for protected APIs.
    // For now, return 400 if user not found to keep consistent.
    return res.status(200).json({ token: jwt.sign({ sub: userId }, secret, { algorithm: 'HS256', expiresIn: '1h' }) });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;
