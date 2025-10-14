import { http, buildApiPath } from './client';

export interface Credentials {
  identifier: string;
  password: string;
}

// PUBLIC_INTERFACE
export async function login(credentials: Credentials, signal?: AbortSignal): Promise<{ token: string; user: any }> {
  const data = await http.post<{ token: string; user: any }>(buildApiPath('auth/login'), credentials, {
    signal,
    skipAuth: true,
  });
  return data;
}
