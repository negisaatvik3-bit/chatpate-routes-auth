import { supabase } from "../integerations/supabase/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  fullName: string;
}

export async function handleLogin(
  payload: LoginPayload
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function handleSignup(
  payload: SignupPayload
): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = "/",
): string {
  const candidate = value?.trim();

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  return candidate;
}

export async function handleGoogleLogin(options: {
  returnPath?: string;
  admin?: boolean;
} = {}): Promise<void> {
  const returnPath = getSafeRedirectPath(options.returnPath, "/");
  const callbackParams = new URLSearchParams({ next: returnPath });

  if (options.admin) {
    callbackParams.set("admin", "1");
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?${callbackParams.toString()}`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function handleLogout(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
export async function handleAppleLogin(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function handleFacebookLogin(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
export async function handleAdminLogin(
  payload: LoginPayload
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // IMPORTANT:
  // Actual admin authorization will be handled
  // by the user's role in the database/RLS.
}
