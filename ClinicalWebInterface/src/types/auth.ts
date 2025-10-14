export type UserRole = 'admin' | 'clinician' | 'nurse' | 'anesthesiologist' | 'staff' | string;

export interface User {
  id: string;
  name: string;
  role?: UserRole;
  email?: string;
}

export interface LoginPayload {
  identifier: string; // email or username
  password: string;
}

export interface LoginResponse {
  token?: string | null;
  user?: User | null;
  // Allow backend to include optional message or error
  message?: string;
  error?: string;
}
