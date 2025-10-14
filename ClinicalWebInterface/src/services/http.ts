//
// HTTP client wrapper centralizing base URL, token injection, and error extraction.
// Uses fetch under the hood to avoid adding dependencies.
//
// Base URL resolution order:
/**
 * 1) process.env.REACT_APP_API_BASE_URL
 * 2) window.location.origin (fallback)
 * 3) 'http://localhost:3000' (final fallback)
 *
 * Note: Our backend routes are under /api; callers should pass paths without leading slash,
 * e.g., 'api/auth/login'. The buildUrl helper will not add '/api' automatically to avoid
 * double-prefixing when absolute URLs are provided.
 */
//
// Notes:
// - To run against Docker/K8s container networking, set REACT_APP_API_BASE_URL to
//   http://BackendServices:3001 (or your service DNS).
// - CORS: This client uses Bearer token in Authorization headers. Credentials/cookies
//   are not required by default; ensure your backend allows Authorization headers
//   and CORS for your UI origin.
//
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpError extends Error {
  status?: number;
  details?: unknown;
}

const envBase = (process.env.REACT_APP_API_BASE_URL || '').trim().replace(/\/+$/, '');
const originFallback = (typeof window !== 'undefined' && window.location?.origin) ? window.location.origin : '';
const defaultBase = 'http://localhost:3000';

// Prefer env, then origin-relative, then localhost
const resolvedBaseUrl = envBase || originFallback || defaultBase;

/**
 * PUBLIC_INTERFACE
 * getBaseUrl returns the resolved API base URL being used by the client.
 */
export function getBaseUrl(): string {
  return resolvedBaseUrl;
}

let tokenProvider: () => string | null = () => null;

/**
 * PUBLIC_INTERFACE
 * setTokenProvider registers a function that returns the current auth token.
 * This allows the HTTP wrapper to include Authorization: Bearer <token> automatically.
 */
export function setTokenProvider(provider: () => string | null) {
  tokenProvider = provider;
}

export interface RequestOptions extends RequestInit {
  // If true, do not attach Authorization header automatically
  skipAuth?: boolean;
  // Optional AbortSignal passthrough
  signal?: AbortSignal;
  // Plain object body, auto JSON-encoded when present
  body?: any;
}

function buildUrl(path: string): string {
  // If caller provided an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;

  // Normalize and ensure single slash between base and path
  const trimmedBase = resolvedBaseUrl.replace(/\/*$/, '');
  const trimmedPath = path.replace(/^\/*/, '');
  return `${trimmedBase}/${trimmedPath}`;
}

function extractErrorMessage(data: any, fallback: string): string {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.error === 'string') return data.error;
  if (typeof data.message === 'string') return data.message;
  return fallback;
}

/**
 * PUBLIC_INTERFACE
 * httpRequest performs a fetch with base URL, JSON handling, auth header injection,
 * and normalized error surface.
 * @param path - Relative or absolute URL (if absolute, base will not be prefixed)
 * @param method - HTTP method
 * @param options - Request options including headers, body, skipAuth, and signal
 * @returns Parsed JSON or text coerced to T on success; throws HttpError on failure
 */
export async function httpRequest<T = any>(path: string, method: HttpMethod, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path);
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  // Attach Authorization Bearer token unless explicitly skipped
  if (!options.skipAuth) {
    const token = tokenProvider();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let body: BodyInit | undefined = options.body as BodyInit | undefined;
  const hasBody = method !== 'GET' && method !== 'DELETE';
  if (hasBody && options.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    if (headers['Content-Type'].includes('application/json') && typeof options.body !== 'string') {
      body = JSON.stringify(options.body);
    }
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body,
      signal: options.signal,
      // CORS note: We default to simple Authorization header only. If your backend
      // uses cookies, enable: credentials: 'include' and configure CORS accordingly.
      // credentials: 'include',
    });

    const text = await res.text();
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') && text ? JSON.parse(text) : (text || null);

    if (!res.ok) {
      const err: HttpError = new Error(extractErrorMessage(data, `Request failed with status ${res.status}`));
      err.status = res.status;
      err.details = data;
      throw err;
    }

    return data as T;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      const abortErr: HttpError = new Error('Request cancelled');
      abortErr.status = 499;
      throw abortErr;
    }
    // Network or other error
    const netErr: HttpError = new Error(err?.message || 'Network error');
    netErr.status = err?.status;
    netErr.details = err?.details;
    throw netErr;
  }
}

/**
 * PUBLIC_INTERFACE
 * Helpers for common methods
 */
export const http = {
  get: <T = any>(path: string, options?: RequestOptions) => httpRequest<T>(path, 'GET', options),
  post: <T = any>(path: string, body?: any, options?: RequestOptions) =>
    httpRequest<T>(path, 'POST', { ...(options || {}), body }),
  put:  <T = any>(path: string, body?: any, options?: RequestOptions) =>
    httpRequest<T>(path, 'PUT', { ...(options || {}), body }),
  patch:<T = any>(path: string, body?: any, options?: RequestOptions) =>
    httpRequest<T>(path, 'PATCH', { ...(options || {}), body }),
  delete:<T = any>(path: string, options?: RequestOptions) => httpRequest<T>(path, 'DELETE', options),
};

// README note for environment:
// .env.example
// REACT_APP_API_BASE_URL=http://localhost:3000
// # For container networking (e.g., docker-compose/k8s):
// # REACT_APP_API_BASE_URL=http://BackendServices:3000
