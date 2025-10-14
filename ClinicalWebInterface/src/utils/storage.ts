const LOCAL_KEY = 'auth_token';
const LOCAL_USER_KEY = 'auth_user';

/**
 * SafeStorage wraps Web Storage with try/catch and JSON handling.
 */
class SafeStorage {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  set(key: string, value: unknown) {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      this.storage.setItem(key, data);
    } catch {
      // no-op
    }
  }

  get<T = unknown>(key: string): T | null {
    try {
      const raw = this.storage.getItem(key);
      if (raw == null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch {
      return null;
    }
  }

  remove(key: string) {
    try {
      this.storage.removeItem(key);
    } catch {
      // no-op
    }
  }
}

export const local = new SafeStorage(window.localStorage);
export const session = new SafeStorage(window.sessionStorage);

export const keys = {
  TOKEN: LOCAL_KEY,
  USER: LOCAL_USER_KEY,
};
