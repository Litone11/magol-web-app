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

// Quando o token de acesso expira (sessao parada ha mais de ~1h, separador em
// segundo plano, PC suspenso), o primeiro pedido a seguir falha com 401
// "JWT expired". Aqui, ao apanhar um 401 num pedido normal (nao de login),
// renovamos a sessao uma vez e repetimos o pedido — de forma transparente,
// sem o utilizador ter de recarregar a pagina nem voltar a entrar.
let client = null; // preenchido logo abaixo; usado dentro do fetch
async function fetchWithRefresh(input, init = {}) {
  const target = typeof input === "string" ? input : (input && input.url) || "";
  const res = await fetch(input, init);
  // So tentamos repetir pedidos normais com cabecalhos (REST/Storage), nunca os
  // de autenticacao (/auth/v1) — senao arriscavamos um ciclo ao renovar.
  if (res.status !== 401 || !client || !init.headers || target.includes("/auth/v1/")) return res;

  const { data, error } = await client.auth.refreshSession();
  const token = data && data.session && data.session.access_token;
  if (error || !token) return res; // nao deu para renovar -> devolve o 401 original

  const headers = new Headers(init.headers);
  headers.set("Authorization", "Bearer " + token);
  return fetch(input, { ...init, headers });
}

// A anon key e PUBLICA por design — pode viver no browser.
// Quem manda na escrita sao as policies RLS + a sessao do login.
export const supabase = isConfigured
  ? createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      global: { fetch: fetchWithRefresh },
    })
  : null;
client = supabase;
