import bcrypt from 'bcryptjs';

/**
 * In-memory user store for local preview. Replace with DB integration later.
 * Passwords are pre-hashed using bcrypt.
 */
const demoPasswordPlain = 'Password123!';
const demoHash = bcrypt.hashSync(demoPasswordPlain, 10);

/** Demo users */
export const users = [
  {
    id: 'u-1001',
    email: 'anesth@example.com',
    name: 'Dr. A. Anesthesiologist',
    role: 'anesthesiologist',
    passwordHash: demoHash,
  },
  {
    id: 'u-1002',
    email: 'nurse@example.com',
    name: 'Nina Nurse',
    role: 'nurse',
    passwordHash: demoHash,
  },
  {
    id: 'u-1003',
    email: 'surgeon@example.com',
    name: 'Sam Surgeon',
    role: 'surgeon',
    passwordHash: demoHash,
  },
];

/**
 * PUBLIC_INTERFACE
 * findUserByEmail returns a user record for given email or undefined.
 */
export function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
}

/**
 * PUBLIC_INTERFACE
 * publicProfile maps a user record to a safe profile object exposed to clients.
 */
export function publicProfile(user) {
  if (!user) return undefined;
  const { id, email, name, role } = user;
  return { id, email, name, role };
}
