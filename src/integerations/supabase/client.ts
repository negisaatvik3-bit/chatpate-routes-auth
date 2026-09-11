import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabasePublishableKey =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

// Keep pages renderable when a staging build is missing its public variables.
// Auth and data requests will still fail until the real values are supplied.
const clientUrl = supabaseUrl || "https://missing-supabase-config.invalid";
const clientKey = supabasePublishableKey || "missing-supabase-publishable-key";

export const supabase = createClient(
  clientUrl,
  clientKey,
);
