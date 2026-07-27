import { supabase, isConfigured } from "./supabase.js";

// Grava um pedido vindo do formulario do site na tabela "leads".
// Em modo demo (sem Supabase) simula sucesso para o fluxo do site funcionar.
export async function submitLead(payload) {
  if (!isConfigured) return { ok: true, demo: true };
  const { error } = await supabase.from("leads").insert(payload);
  return { ok: !error, error };
  
}
