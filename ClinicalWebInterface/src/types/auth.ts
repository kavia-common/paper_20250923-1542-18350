export type UserRole = 'admin' | 'clinician' | 'nurse' | 'anesthesiologist' | 'staff' | string;

export interface User {
  id: string;
  name: string;
  email?: string;
  role?: UserRole;
  // Allow additional backend-provided properties without breaking typing
  [key: string]: any;
}

export interface LoginPayload {
  identifier: string; // email or username
  password: string;
}

export interface LoginResponse {
  token?: string | null;
  user?: User | null;
  // Optional backend-provided message or error to surface to UI
  message?: string;
  error?: string;
  [key: string]: any;
}
