import { createClient } from "@supabase/supabase-js";
const supabaseUrl ="https://jckjqrqlrxpytcwcqkcm.supabase.co";
const supabasePublishableKey = "sb_publishable_eGYsAvyxY2jNrJ_Gwu7_wA_NDcbKEdW";

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);