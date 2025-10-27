 // PUBLIC_INTERFACE
 export function setAuthenticated(flag: boolean): void {
   try {
     localStorage.setItem('auth.isAuthenticated', flag ? 'true' : 'false');
   } catch {}
 }

 // PUBLIC_INTERFACE
 export function isAuthenticated(): boolean {
   try {
     return localStorage.getItem('auth.isAuthenticated') === 'true';
   } catch {
     return false;
   }
 }

 // PUBLIC_INTERFACE
 export function clearAuth(): void {
   try {
     localStorage.removeItem('auth.isAuthenticated');
     localStorage.removeItem('auth.token');
     localStorage.removeItem('auth.user');
   } catch {}
 }
