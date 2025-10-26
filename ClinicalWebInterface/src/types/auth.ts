//
// Shared authentication-related types
//

// PUBLIC_INTERFACE
export type User = {
  /** Unique user identifier */
  id: string;
  /** Primary email address */
  email: string;
  /** Optional display name */
  name?: string;
};
