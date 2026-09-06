import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const ROW_ID = "main";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Public read of the shared site content. */
export const fetchSiteContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await publicClient()
      .from("site_content")
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { json: data?.data ? JSON.stringify(data.data) : null };
  },
);

/** Verifies the admin credentials against the stored password. */
export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { username: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("site_content")
      .select("admin_password")
      .eq("id", ROW_ID)
      .maybeSingle();
    const ok =
      data.username.trim().toLowerCase() === "ghighais" &&
      !!row &&
      data.password === (row as { admin_password: string }).admin_password;
    return { ok };
  });

/** Saves the whole site content after checking the admin password. */
export const persistSiteContent = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { password: string; content: string }) => input,
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("site_content")
      .select("admin_password")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (!row || data.password !== (row as { admin_password: string }).admin_password) {
      return { ok: false };
    }
    const { error } = await supabaseAdmin
      .from("site_content")
      .update({ data: JSON.parse(data.content), updated_at: new Date().toISOString() })
      .eq("id", ROW_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Changes the shared admin password. */
export const updateAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: { current: string; next: string }) => input)
  .handler(async ({ data }) => {
    if (data.next.length < 6) return { ok: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("site_content")
      .select("admin_password")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (!row || data.current !== (row as { admin_password: string }).admin_password) {
      return { ok: false };
    }
    const { error } = await supabaseAdmin
      .from("site_content")
      .update({ admin_password: data.next })
      .eq("id", ROW_ID);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
