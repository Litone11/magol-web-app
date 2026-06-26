// Constroi o URL de embed do Google Maps a partir das definicoes de contactos.
// Aceita: URL de "Incorporar" (usado tal e qual), coordenadas/morada, ou cai na morada.
// Sem API key.
export function mapEmbedSrc(contacts) {
  const raw = (((contacts && contacts.map) || "").trim()) || (contacts && contacts.address) || "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://maps.google.com/maps?q=${encodeURIComponent(raw.replace(/\n/g, ", "))}&z=16&output=embed`;
}
