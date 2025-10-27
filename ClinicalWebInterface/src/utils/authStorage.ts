 // PUBLIC_INTERFACE
 export function setAuthenticated(flag: boolean): void {
   /**
    * Sets the client-side authentication flag in localStorage.
    * Consumers should call this after a successful login.
    */
   try {
     localStorage.setItem('auth.isAuthenticated', flag ? 'true' : 'false');
   } catch {}
 }

 // PUBLIC_INTERFACE
 export function isAuthenticated(): boolean {
   /**
    * Returns true if the client considers the user authenticated.
    * Based on the localStorage flag set during login.
    */
   try {
     return localStorage.getItem('auth.isAuthenticated') === 'true';
   } catch {
     return false;
   }
 }

 // PUBLIC_INTERFACE
 export function clearAuth(): void {
   /**
    * Clears all client-side auth artifacts such as flags, token, and user info.
    */
   try {
     localStorage.removeItem('auth.isAuthenticated');
     localStorage.removeItem('auth.token');
     localStorage.removeItem('auth.user');
   } catch {}
 }

 // PUBLIC_INTERFACE
 export function logout(): void {
   /**
    * Logs out on the client by clearing auth artifacts.
    * This function intentionally does not call any backend.
    */
   clearAuth();
 }
