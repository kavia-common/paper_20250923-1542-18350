export type LoginResponse = { success: boolean; token?: string; user?: { id: string; email: string; name?: string } };

// PUBLIC_INTERFACE
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let message = 'Invalid credentials';
    try {
      const j = await res.json();
      if (j?.message) message = j.message;
    } catch {}
    const err = new Error(message);
    // @ts-ignore
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function me() {
  const res = await fetch('/api/me', { credentials: 'include' });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

// PUBLIC_INTERFACE
export async function logout() {
  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
}
