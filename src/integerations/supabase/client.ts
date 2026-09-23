import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env["VITE_SUPABASE_URL"] ||
  "https://jckjqrqlrxpytcwcqkcm.supabase.co";
const supabasePublishableKey =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  "sb_publishable_eGYsAvyxY2jNrJ_Gwu7_wA_NDcbKEdW";

const clientUrl = supabaseUrl;
const clientKey = supabasePublishableKey;

export const supabase = createClient(
  clientUrl,
  clientKey,
);
