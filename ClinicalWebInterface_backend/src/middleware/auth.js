import jwt from 'jsonwebtoken';

/**
 * PUBLIC_INTERFACE
 * authMiddleware verifies Bearer JWT in Authorization header and attaches user payload to req.user.
 * Returns 401 if missing/invalid or expired.
 */
export function authMiddleware(req, res, next) {
  const header = req.headers['authorization'] || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized: missing token' });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET not set' });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload; // { sub, email, role, name, iat, exp }
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
  }
}
