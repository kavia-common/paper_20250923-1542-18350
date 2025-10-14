//
// Thin API client that wraps the existing services/http.ts to meet the requested
// files_to_create_or_modify contract. Prefer importing from here for new APIs.
//
import { http as coreHttp, getBaseUrl } from '../services/http';

// PUBLIC_INTERFACE
export const apiBaseUrl = getBaseUrl();

// PUBLIC_INTERFACE
export const http = coreHttp;

/**
 * PUBLIC_INTERFACE
 * buildApiPath ensures API paths are prefixed with "api/" without leading slashes.
 * Pass only the path segment, e.g., "auth/login" -> "api/auth/login"
 */
export function buildApiPath(path: string): string {
  const trimmed = path.replace(/^\/*/, '');
  return `api/${trimmed}`;
}
