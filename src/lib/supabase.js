import { createClient } from "@supabase/supabase-js";

const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// O cliente supabase-js quer SO o URL base do projeto (https://xxxx.supabase.co)
// — ele proprio acrescenta /auth/v1, /rest/v1, /storage/v1. Se por engano colarem
// o URL com "/rest/v1" ou uma barra no fim, o login rebenta com
// "Invalid path specified in request URL". Limpamos isso aqui.
const url = (import.meta.env.VITE_SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "")        // tira barras finais
  .replace(/\/rest\/v1$/i, "") // tira um "/rest/v1" final
  .replace(/\/+$/, "");        // e barras que tenham sobrado

// "Configurado" = as duas variaveis existem e ja nao tem os placeholders.
export const isConfigured = Boolean(
  url && key && !/YOUR_|your_|placeholder/.test(url + key)
);

// A anon key e PUBLICA por design — pode viver no browser.
// Quem manda na escrita sao as policies RLS + a sessao do login.
export const supabase = isConfigured ? createClient(url, key) : null;
