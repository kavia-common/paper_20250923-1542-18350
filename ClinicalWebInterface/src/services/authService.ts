import { LoginPayload, LoginResponse, User } from '../types/auth';

const baseUrl = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/+$/, ''); // trim trailing slash

// PUBLIC_INTERFACE
export async function login(payload: LoginPayload, signal?: AbortSignal): Promise<LoginResponse> {
  const url = `${baseUrl}/api/auth/login`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });

    const data = (await res.json().catch(() => ({}))) as LoginResponse | Record<string, unknown>;

    if (!res.ok) {
      const message =
        (data as LoginResponse)?.error ||
        (data as LoginResponse)?.message ||
        `Login failed with status ${res.status}`;
      return { token: null, user: null, error: String(message) };
    }

    const token = (data as LoginResponse)?.token ?? null;
    const user = (data as LoginResponse)?.user ?? null;

    if (!token || !user) {
      return { token: null, user: null, error: 'Invalid response from server.' };
    }

    return { token, user: user as User };
  } catch (e: any) {
    const message = e?.name === 'AbortError' ? 'Request cancelled' : 'Unable to reach server';
    return { token: null, user: null, error: message };
  }
}

// PUBLIC_INTERFACE
export async function logout(): Promise<void> {
  // For now, client-only. If backend needs a call, add it here.
  return Promise.resolve();
}
