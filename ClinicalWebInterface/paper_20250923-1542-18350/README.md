# paper_20250923-1542-18350

Logout/session handling (ClinicalWebInterface)
- Auth is tracked client-side via localStorage key `auth.isAuthenticated`.
- Private routes are protected by a guard and `/` redirects to `/dashboard` if authenticated, otherwise `/login`.
- A Logout button in the top navigation clears auth state and navigates to `/login`.
