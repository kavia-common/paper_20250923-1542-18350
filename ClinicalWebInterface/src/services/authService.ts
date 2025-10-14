import { LoginPayload, LoginResponse, User } from '../types/auth';
import { http, setTokenProvider } from './http';
import { keys, local, session } from '../utils/storage';

/**
 * Storage helpers for token/user persistence
 */
function readToken(): string | null {
  return (local.get<string>(keys.TOKEN) || session.get<string>(keys.TOKEN)) ?? null;
}
function readUser(): User | null {
  return (local.get<User>(keys.USER) || session.get<User>(keys.USER)) ?? null;
}

/**
 * Ensure HTTP wrapper knows how to fetch the latest token for Authorization header injection.
 */
setTokenProvider(() => readToken());

// PUBLIC_INTERFACE
export async function login(payload: LoginPayload, signal?: AbortSignal): Promise<LoginResponse> {
  try {
    // Backend endpoints (no leading slash in http wrapper path)
    // Acceptance criteria expects: POST /auth/login -> { token, user }
    const data = await http.post<LoginResponse>('auth/login', payload, { signal, skipAuth: true });

    const token = data?.token ?? null;
    const user = (data?.user as User | undefined) ?? null;

    if (!token || !user) {
      return { token: null, user: null, error: 'Invalid response from server.' };
    }

    return { token, user };
  } catch (e: any) {
    const message = e?.message || 'Unable to reach server';
    return { token: null, user: null, error: message };
  }
}

// PUBLIC_INTERFACE
export async function logout(signal?: AbortSignal): Promise<void> {
  try {
    // Best-effort server logout
    await http.post('auth/logout', undefined, { signal });
  } catch {
    // ignore failures; proceed to clear client state
  }
}

/**
 * PUBLIC_INTERFACE
 * getMe fetches the current user session if token exists; returns User or null
 */
export async function getMe(signal?: AbortSignal): Promise<User | null> {
  const t = readToken();
  if (!t) return null;
  try {
    const data = await http.get<{ user: User }>('auth/me', { signal });
    const user = data?.user;
    if (user && user.id) {
      return user;
    }
    return null;
  } catch (e: any) {
    // Surface 401 for callers to handle (e.g., redirect to login)
    if (e?.status === 401) {
      throw e;
    }
    return null;
  }
}

// Expose small helpers for other modules if needed
export const authStorage = {
  readToken,
  readUser,
};
