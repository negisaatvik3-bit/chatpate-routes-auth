/**
 * Authentication handlers for Chatpate Routes.
 *
 * These are intentionally NOT implemented with mock behaviour. Once Lovable
 * Cloud (Supabase Auth) is enabled, replace each throw with the real call, e.g.
 *
 *   import { supabase } from "@/integrations/supabase/client";
 *   await supabase.auth.signInWithPassword({ email, password });
 *
 * Redirect targets after real auth is connected:
 *   login   -> user dashboard
 *   signup  -> onboarding / dashboard
 *   admin   -> admin dashboard, only after the backend confirms admin role
 *              (never decide admin status in the frontend)
 */

const NOT_CONFIGURED =
  "Authentication isn't connected yet. Enable Lovable Cloud to activate sign-in.";

export class AuthNotConfiguredError extends Error {
  constructor() {
    super(NOT_CONFIGURED);
    this.name = "AuthNotConfiguredError";
  }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  fullName: string;
}

export async function handleLogin(_payload: LoginPayload): Promise<void> {
  throw new AuthNotConfiguredError();
}

export async function handleSignup(_payload: SignupPayload): Promise<void> {
  throw new AuthNotConfiguredError();
}

export async function handleAdminLogin(_payload: LoginPayload): Promise<void> {
  throw new AuthNotConfiguredError();
}

export async function handleGoogleLogin(): Promise<void> {
  throw new AuthNotConfiguredError();
}

export async function handleAppleLogin(): Promise<void> {
  throw new AuthNotConfiguredError();
}

export async function handleFacebookLogin(): Promise<void> {
  throw new AuthNotConfiguredError();
}
