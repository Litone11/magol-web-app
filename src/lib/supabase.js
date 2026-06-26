import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// "Configurado" = as duas variaveis existem e ja nao tem os placeholders.
export const isConfigured = Boolean(
  url && key && !/YOUR_|your_|placeholder/.test(url + key)
);

// A anon key e PUBLICA por design — pode viver no browser.
// Quem manda na escrita sao as policies RLS + a sessao do login.
export const supabase = isConfigured ? createClient(url, key) : null;
