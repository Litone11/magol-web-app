import { supabase, isConfigured } from "./supabase.js";

// Bucket público onde ficam as imagens do site (ver supabase/storage.sql).
const BUCKET = "images";

// Carrega um ficheiro para o Storage e devolve o URL público.
export async function uploadImage(file) {
  if (!isConfigured) return { ok: false, error: "Supabase não está configurada." };
  if (!file.type || !file.type.startsWith("image/")) {
    return { ok: false, error: "O ficheiro tem de ser uma imagem." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: "Imagem demasiado grande (máx. 10 MB)." };
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `catalogo/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    const hint = /bucket/i.test(error.message)
      ? " (falta correr supabase/storage.sql para criar o bucket)"
      : "";
    return { ok: false, error: error.message + hint };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl, path };
}
