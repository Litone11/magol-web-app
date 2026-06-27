import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { uploadImage } from "../lib/storage.js";
import { DEFAULTS, TEXT_FIELDS, IMAGE_FIELDS, normalizeBrands, normalizeTags, PRODUCT_TAGS } from "../lib/content.js";
import { El, s } from "../ui.jsx";

const card = "background:#16161A;border:1px solid #2A2A30;padding:22px;margin-bottom:18px;";
const btnRed = "background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:#fff;padding:11px 18px;";
const btnGhost = "background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:#fff;padding:11px 18px;";

// Mostra apenas erros — o "Guardado ✓" foi retirado (guarda-se automaticamente).
function Status({ text }) {
  if (!text) return null;
  return <span style={s("font-family:'Barlow',sans-serif;font-size:14px;margin-left:14px;color:#FF6B6B;")}>{text}</span>;
}

// Nota fixa: lembra que não há botão guardar.
function AutoSaveNote() {
  return <p style={s("font-family:'Barlow',sans-serif;font-size:13px;color:#6E6E78;margin:0 0 18px;display:flex;align-items:center;gap:7px;")}><span style={s("width:7px;height:7px;border-radius:50%;background:#5AD18A;display:inline-block;")} />As alterações são guardadas automaticamente.</p>;
}

// Auto-guardar: corre `fn(value)` ~0,7s depois da última alteração de `value`,
// ignorando o primeiro valor (o que vem do carregamento inicial). `fn` nunca deve
// alterar o próprio `value` (senão entra em ciclo).
function useAutoSave(value, fn, delay = 700) {
  const first = useRef(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    if (value === null || value === undefined) return;
    if (first.current) { first.current = false; return; }
    const t = setTimeout(() => fnRef.current(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
}

// Campo de imagem: caixa de URL + botão para carregar ficheiro do computador.
function ImageField({ def, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  async function pick(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // permite re-selecionar o mesmo ficheiro
    if (!file) return;
    setErr("");
    setBusy(true);
    const res = await uploadImage(file);
    setBusy(false);
    if (res.ok) onChange(res.url);
    else setErr(res.error || "Falha no upload.");
  }

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <label className="adm-label">{def.label || "Imagem"}</label>
      <div style={s("display:flex;gap:8px;flex-wrap:wrap;align-items:center;")}>
        {value ? <img src={value} alt="" style={s("width:54px;height:40px;object-fit:cover;background:#0F0F11;border:1px solid #2A2A30;flex-shrink:0;")} /> : null}
        <input className="adm-input" style={{ flex: "1 1 180px" }} type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="URL da imagem, ou carrega um ficheiro →" />
        <El tag="button" type="button" onClick={() => inputRef.current && inputRef.current.click()} disabled={busy}
          css="background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:#fff;padding:11px 16px;white-space:nowrap;"
          hover="border-color:#E01E26;color:#E01E26;">{busy ? "A carregar…" : "Carregar ficheiro"}</El>
        <input ref={inputRef} type="file" accept="image/*" onChange={pick} style={{ display: "none" }} />
      </div>
      {err ? <div style={s("font-family:'Barlow',sans-serif;font-size:13px;color:#FF6B6B;margin-top:6px;")}>{err}</div> : null}
    </div>
  );
}

// Campo de varias imagens: lista de fotos (preview + URL + remover) e carregar varias.
function MultiImageField({ def, value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  const setAt = (i, url) => onChange(list.map((u, j) => (j === i ? url : u)));
  const removeAt = (i) => onChange(list.filter((_, j) => j !== i));
  const addUrl = () => onChange([...list, ""]);

  async function pick(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // permite re-selecionar os mesmos ficheiros
    if (!files.length) return;
    setErr("");
    setBusy(true);
    const uploaded = [];
    for (const file of files) {
      const res = await uploadImage(file);
      if (res.ok) uploaded.push(res.url);
      else setErr(res.error || "Falha no upload.");
    }
    setBusy(false);
    if (uploaded.length) onChange([...list, ...uploaded]);
  }

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <label className="adm-label">{def.label || "Fotos"}</label>
      {list.length > 0 && (
        <div style={s("display:grid;gap:10px;margin-bottom:10px;")}>
          {list.map((u, i) => (
            <div key={i} style={s("display:flex;gap:8px;align-items:center;flex-wrap:wrap;")}>
              <img src={u} alt="" style={s("width:54px;height:54px;object-fit:cover;background:#0F0F11;border:1px solid #2A2A30;flex-shrink:0;")} />
              <input className="adm-input" style={{ flex: "1 1 180px" }} type="text" value={u ?? ""} onChange={(e) => setAt(i, e.target.value)} placeholder="URL da imagem" />
              <El tag="button" type="button" onClick={() => removeAt(i)}
                css="background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:#fff;padding:10px 14px;white-space:nowrap;"
                hover="border-color:#E01E26;color:#E01E26;">Remover</El>
            </div>
          ))}
        </div>
      )}
      <div style={s("display:flex;gap:8px;flex-wrap:wrap;align-items:center;")}>
        <El tag="button" type="button" onClick={() => inputRef.current && inputRef.current.click()} disabled={busy}
          css="background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:#fff;padding:11px 16px;white-space:nowrap;"
          hover="border-color:#E01E26;color:#E01E26;">{busy ? "A carregar…" : "Carregar fotos"}</El>
        <El tag="button" type="button" onClick={addUrl}
          css="background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:#fff;padding:11px 16px;white-space:nowrap;"
          hover="border-color:#fff;">+ Adicionar por URL</El>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={pick} style={{ display: "none" }} />
      </div>
      {err ? <div style={s("font-family:'Barlow',sans-serif;font-size:13px;color:#FF6B6B;margin-top:6px;")}>{err}</div> : null}
    </div>
  );
}

// Campo de destaques: chips que se ligam/desligam (multi-seleção).
function TagsField({ def, value, onChange }) {
  const selected = normalizeTags(value);
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((t) => t !== id) : [...selected, id]);
  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <label className="adm-label">{def.label || "Destaques"}</label>
      <div style={s("display:flex;gap:8px;flex-wrap:wrap;")}>
        {PRODUCT_TAGS.map((t) => {
          const on = selected.includes(t.id);
          return (
            <button key={t.id} type="button" onClick={() => toggle(t.id)} style={s(
              "cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;padding:9px 14px;" +
              "border:1px solid " + (on ? t.bg : "#45454C") + ";background:" + (on ? t.bg : "transparent") + ";color:" + (on ? t.fg : "#fff") + ";"
            )}>{(on ? "✓ " : "+ ") + t.label}</button>
          );
        })}
      </div>
    </div>
  );
}

function Field({ def, value, onChange }) {
  if (def.type === "image") return <ImageField def={def} value={value} onChange={onChange} />;
  if (def.type === "images") return <MultiImageField def={def} value={value} onChange={onChange} />;
  if (def.type === "tags") return <TagsField def={def} value={value} onChange={onChange} />;
  return (
    <div style={def.full ? { gridColumn: "1 / -1" } : undefined}>
      <label className="adm-label">{def.label}</label>
      {def.type === "textarea" ? (
        <textarea className="adm-input" rows={def.rows || 3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{ resize: "vertical" }} />
      ) : def.type === "select" ? (
        <select className="adm-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {(def.options || []).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      ) : (
        <input className="adm-input" type={def.type || "text"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

// -------- Editor genérico de catálogo (Carroçarias / Drogaria) --------
export function CatalogueEditor({ table, fields, newRow, title }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const rowsRef = useRef([]);
  const timers = useRef({});
  rowsRef.current = rows;

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order("pos", { ascending: true });
    if (error) setStatus("Erro ao carregar: " + error.message);
    setRows(data || []);
    setLoading(false);
  }
  useEffect(() => { reload(); }, [table]);
  useEffect(() => () => { Object.values(timers.current).forEach(clearTimeout); }, []);

  async function saveRow(row) {
    const payload = {};
    fields.forEach((f) => {
      if (f.type === "number") payload[f.key] = Number(row[f.key]) || 0;
      else if (f.type === "images") payload[f.key] = Array.isArray(row[f.key]) ? row[f.key].filter((u) => u && u.trim()) : [];
      else payload[f.key] = row[f.key] ?? "";
    });
    const { error } = await supabase.from(table).update(payload).eq("id", row.id);
    setStatus(error ? "Erro ao guardar: " + error.message : "");
  }

  // Guarda a linha ~0,7s depois da última alteração (auto-save).
  const scheduleSave = (id) => {
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => {
      const r = rowsRef.current.find((x) => x.id === id);
      if (r) saveRow(r);
    }, 700);
  };

  const setField = (id, key, val) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
    scheduleSave(id);
  };

  async function addRow() {
    const pos = rows.length ? Math.max(...rows.map((r) => r.pos || 0)) + 1 : 1;
    const { error } = await supabase.from(table).insert({ ...newRow, pos });
    setStatus(error ? "Erro ao adicionar: " + error.message : "");
    if (!error) reload();
  }

  async function delRow(row) {
    if (!window.confirm("Apagar “" + (row.title || "este item") + "”?")) return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    setStatus(error ? "Erro ao apagar: " + error.message : "");
    if (!error) reload();
  }

  if (loading) return <Loading />;

  return (
    <div>
      <Header title={title} action={<El tag="button" onClick={addRow} css={btnRed} hover="background:#B0151B;">+ Adicionar</El>} status={status} />
      <AutoSaveNote />
      {rows.map((row) => (
        <div key={row.id} style={s(card)}>
          <div style={s("display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;")}>
            <img src={row.image_url} alt="" style={s("width:120px;height:84px;object-fit:cover;background:#0F0F11;border:1px solid #2A2A30;flex-shrink:0;")} />
            <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;flex:1;min-width:240px;")}>
              {fields.map((f) => (
                <Field key={f.key} def={f} value={row[f.key]} onChange={(v) => setField(row.id, f.key, v)} />
              ))}
            </div>
          </div>
          <div style={s("display:flex;gap:10px;margin-top:16px;")}>
            <El tag="button" onClick={() => delRow(row)} css={btnGhost} hover="border-color:#E01E26;color:#E01E26;">Apagar</El>
          </div>
        </div>
      ))}
    </div>
  );
}

// -------- Contactos & horário --------
export function ContactsEditor() {
  const [val, setVal] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.from("settings").select("value").eq("key", "contacts").maybeSingle()
      .then(({ data }) => setVal({ ...DEFAULTS.contacts, ...(data?.value || {}) }));
  }, []);

  const upd = (k) => (v) => setVal((c) => ({ ...c, [k]: v }));

  useAutoSave(val, async (v) => {
    const { error } = await supabase.from("settings").upsert({ key: "contacts", value: v, updated_at: new Date().toISOString() });
    setStatus(error ? "Erro ao guardar: " + error.message : "");
  });

  if (!val) return <Loading />;

  const FIELDS = [
    { key: "address", label: "Morada", type: "textarea", full: true },
    { key: "phoneLandline", label: "Telefone (fixo)" },
    { key: "phoneMobile", label: "Telemóvel" },
    { key: "email", label: "Email" },
    { key: "hours", label: "Horário", type: "textarea", full: true },
    { key: "map", label: "Mapa — coordenadas, morada, ou link 'Incorporar' do Google Maps (vazio = usa a morada)", type: "textarea", full: true },
  ];

  return (
    <div>
      <Header title="Contactos & horário" status={status} />
      <AutoSaveNote />
      <div style={s(card)}>
        <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;")}>
          {FIELDS.map((f) => <Field key={f.key} def={f} value={val[f.key]} onChange={upd(f.key)} />)}
        </div>
      </div>
    </div>
  );
}

// -------- Estatísticas & textos --------
export function StatsTextsEditor() {
  const [stats, setStats] = useState(null);
  const [texts, setTexts] = useState(null);
  const [status, setStatus] = useState("");
  const first = useRef(true);

  useEffect(() => {
    supabase.from("settings").select("key,value").in("key", ["stats", "texts"]).then(({ data }) => {
      const m = {}; (data || []).forEach((r) => { m[r.key] = r.value; });
      setStats(Array.isArray(m.stats) && m.stats.length ? m.stats : DEFAULTS.stats);
      setTexts({ ...DEFAULTS.texts, ...(m.texts || {}) });
    });
  }, []);

  // Auto-save dos dois (números + textos) ~0,7s depois da última alteração.
  useEffect(() => {
    if (!stats || !texts) return;
    if (first.current) { first.current = false; return; }
    const t = setTimeout(async () => {
      const now = new Date().toISOString();
      const { error } = await supabase.from("settings").upsert([
        { key: "stats", value: stats, updated_at: now },
        { key: "texts", value: texts, updated_at: now },
      ]);
      setStatus(error ? "Erro ao guardar: " + error.message : "");
    }, 700);
    return () => clearTimeout(t);
  }, [stats, texts]);

  if (!stats || !texts) return <Loading />;

  const setStat = (i, k, v) => setStats((ss) => ss.map((st, j) => (j === i ? { ...st, [k]: v } : st)));
  const addStat = () => setStats((ss) => [...ss, { value: "", label: "" }]);
  const delStat = (i) => setStats((ss) => ss.filter((_, j) => j !== i));
  const setText = (k) => (v) => setTexts((t) => ({ ...t, [k]: v }));

  return (
    <div>
      <Header title="Estatísticas & textos" status={status} />
      <AutoSaveNote />

      <div style={s(card)}>
        <div style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;color:#fff;font-size:16px;margin-bottom:16px;")}>Números (Início)</div>
        <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;")}>
          {stats.map((st, i) => (
            <div key={i} style={s("border:1px solid #2A2A30;padding:14px;")}>
              <Field def={{ label: "Valor (ex: 40+)" }} value={st.value} onChange={(v) => setStat(i, "value", v)} />
              <div style={{ height: 10 }} />
              <Field def={{ label: "Legenda" }} value={st.label} onChange={(v) => setStat(i, "label", v)} />
              <div style={s("margin-top:10px;")}><El tag="button" onClick={() => delStat(i)} css={btnGhost} hover="border-color:#E01E26;color:#E01E26;">Remover</El></div>
            </div>
          ))}
        </div>
        <div style={s("margin-top:16px;")}><El tag="button" onClick={addStat} css={btnGhost} hover="border-color:#fff;">+ Adicionar número</El></div>
      </div>

      <div style={s(card)}>
        <div style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;color:#fff;font-size:16px;margin-bottom:16px;")}>Textos das páginas</div>
        <div style={s("display:grid;gap:16px;")}>
          {TEXT_FIELDS.map(([key, label]) => (
            <Field key={key} def={{ label, type: "textarea", rows: 2, full: true }} value={texts[key]} onChange={setText(key)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// -------- Imagens do site (fundos de topo, cartões, foto da Empresa) --------
export function SiteImagesEditor() {
  const [val, setVal] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.from("settings").select("value").eq("key", "images").maybeSingle()
      .then(({ data }) => setVal({ ...DEFAULTS.images, ...(data?.value || {}) }));
  }, []);

  const upd = (k) => (v) => setVal((c) => ({ ...c, [k]: v }));

  useAutoSave(val, async (v) => {
    const { error } = await supabase.from("settings").upsert({ key: "images", value: v, updated_at: new Date().toISOString() });
    setStatus(error ? "Erro ao guardar: " + error.message : "");
  });

  if (!val) return <Loading />;

  return (
    <div>
      <Header title="Imagens do site" status={status} />
      <AutoSaveNote />
      <p style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.6;color:#8A8A92;margin:0 0 18px;max-width:70ch;")}>
        Estas são as fotos fixas do site: os fundos do topo de cada página, os dois cartões da página inicial e a foto principal da página <b style={{ color: "#fff" }}>Empresa</b>. Carrega um ficheiro do computador ou cola um URL. Se deixares um campo vazio, volta automaticamente à imagem por omissão.
      </p>
      <div style={s(card)}>
        <div style={s("display:grid;gap:20px;")}>
          {IMAGE_FIELDS.map(([key, label]) => (
            <Field key={key} def={{ label, type: "image", full: true }} value={val[key]} onChange={upd(key)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Linha de marca: logo (preview + carregar/URL) + nome + remover.
function BrandRow({ brand, onName, onLogo, onRemove }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  async function pick(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setErr("");
    setBusy(true);
    const res = await uploadImage(file);
    setBusy(false);
    if (res.ok) onLogo(res.url);
    else setErr(res.error || "Falha no upload.");
  }

  return (
    <div style={s("display:flex;gap:8px;align-items:center;flex-wrap:wrap;border:1px solid #2A2A30;padding:10px;")}>
      <div style={s("width:46px;height:46px;background:#fff;border:1px solid #2A2A30;display:grid;place-items:center;overflow:hidden;flex-shrink:0;")}>
        {brand.logo ? <img src={brand.logo} alt="" style={s("max-width:100%;max-height:100%;object-fit:contain;")} /> : <span style={s("font-family:'Barlow',sans-serif;font-size:10px;color:#9A9AA2;")}>logo</span>}
      </div>
      <input className="adm-input" style={{ flex: "1 1 140px" }} type="text" value={brand.name ?? ""} onChange={(e) => onName(e.target.value)} placeholder="Nome da marca (ex: Bosch)" />
      <input className="adm-input" style={{ flex: "1 1 160px" }} type="text" value={brand.logo ?? ""} onChange={(e) => onLogo(e.target.value)} placeholder="URL do logo, ou carrega →" />
      <El tag="button" type="button" onClick={() => inputRef.current && inputRef.current.click()} disabled={busy}
        css="background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:#fff;padding:11px 16px;white-space:nowrap;"
        hover="border-color:#E01E26;color:#E01E26;">{busy ? "A carregar…" : "Carregar logo"}</El>
      <El tag="button" type="button" onClick={onRemove}
        css="background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:#fff;padding:11px 16px;white-space:nowrap;"
        hover="border-color:#E01E26;color:#E01E26;">Remover</El>
      <input ref={inputRef} type="file" accept="image/*" onChange={pick} style={{ display: "none" }} />
      {err ? <div style={s("font-family:'Barlow',sans-serif;font-size:13px;color:#FF6B6B;width:100%;")}>{err}</div> : null}
    </div>
  );
}

// -------- Marcas da Drogaria (lista gerida, com logo) --------
export function BrandsEditor() {
  const [list, setList] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.from("settings").select("value").eq("key", "brands").maybeSingle()
      .then(({ data }) => setList(normalizeBrands(data && data.value)));
  }, []);

  // Auto-save: limpa vazios/duplicados e grava (sem mexer na lista visível).
  useAutoSave(list, async (l) => {
    const seen = new Set();
    const out = [];
    l.forEach((b) => {
      const name = (b.name || "").trim();
      if (!name) return;
      const k = name.toLowerCase();
      if (seen.has(k)) return;
      seen.add(k);
      out.push({ name, logo: (b.logo || "").trim() });
    });
    const { error } = await supabase.from("settings").upsert({ key: "brands", value: out, updated_at: new Date().toISOString() });
    setStatus(error ? "Erro ao guardar: " + error.message : "");
  });

  if (!list) return <Loading />;

  const setName = (i, v) => setList((l) => l.map((x, j) => (j === i ? { ...x, name: v } : x)));
  const setLogo = (i, v) => setList((l) => l.map((x, j) => (j === i ? { ...x, logo: v } : x)));
  const add = () => setList((l) => [...l, { name: "", logo: "" }]);
  const del = (i) => setList((l) => l.filter((_, j) => j !== i));

  // Junta a lista as marcas que ja existem nos produtos (sem duplicar). Grava sozinho.
  async function importFromProducts() {
    const { data, error } = await supabase.from("drogaria_items").select("brand");
    if (error) { setStatus("Erro ao importar: " + error.message); return; }
    const fromItems = [...new Set((data || []).map((r) => (r.brand || "").trim()).filter(Boolean))];
    setList((l) => {
      const seen = new Set(l.map((x) => (x.name || "").trim().toLowerCase()).filter(Boolean));
      const merged = [...l];
      fromItems.forEach((b) => { const k = b.toLowerCase(); if (!seen.has(k)) { seen.add(k); merged.push({ name: b, logo: "" }); } });
      return merged;
    });
  }

  return (
    <div>
      <Header title="Drogaria · marcas" status={status} />
      <AutoSaveNote />
      <p style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.6;color:#8A8A92;margin:0 0 18px;max-width:70ch;")}>
        Cada marca pode ter um <b style={{ color: "#fff" }}>logo</b> (mini imagem) que aparece no card e na página do produto. As marcas ficam disponíveis na lista ao editar cada produto. No site, só aparecem como filtro as marcas que tiverem produtos.
      </p>
      <div style={s(card)}>
        {list.length === 0 && <p style={s("font-family:'Barlow',sans-serif;color:#8A8A92;margin:0 0 14px;")}>Ainda não há marcas. Adiciona a primeira →</p>}
        <div style={s("display:grid;gap:10px;")}>
          {list.map((b, i) => (
            <BrandRow key={i} brand={b} onName={(v) => setName(i, v)} onLogo={(v) => setLogo(i, v)} onRemove={() => del(i)} />
          ))}
        </div>
        <div style={s("display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;")}>
          <El tag="button" onClick={add} css={btnGhost} hover="border-color:#fff;">+ Adicionar marca</El>
          <El tag="button" onClick={importFromProducts} css={btnGhost} hover="border-color:#fff;">Importar dos produtos</El>
        </div>
      </div>
    </div>
  );
}

// Checkboxes de destaques para a vista de lista (toggle rápido por produto).
function TagChecks({ value, onToggle }) {
  const sel = normalizeTags(value);
  return (
    <div style={s("display:flex;gap:14px;flex-wrap:wrap;align-items:center;flex-shrink:0;")}>
      {PRODUCT_TAGS.map((t) => {
        const on = sel.includes(t.id);
        return (
          <label key={t.id} title={t.label} style={s("display:inline-flex;align-items:center;gap:6px;cursor:pointer;user-select:none;font-family:'Barlow',sans-serif;font-size:13px;color:" + (on ? "#fff" : "#8A8A92") + ";")}>
            <input type="checkbox" checked={on} onChange={() => onToggle(t.id)} style={{ accentColor: t.bg, width: 15, height: 15, cursor: "pointer", margin: 0 }} />
            <span style={s("width:9px;height:9px;flex-shrink:0;background:" + t.bg + ";display:inline-block;")} />
            {t.label}
          </label>
        );
      })}
    </div>
  );
}

// -------- Produtos da Drogaria (itens por categoria) --------
export function DrogariaItemsEditor() {
  const [cats, setCats] = useState([]);
  const [rows, setRows] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null); // null = vista de lista
  const rowsRef = useRef([]);
  const timers = useRef({});
  rowsRef.current = rows;

  async function reload() {
    setLoading(true);
    const [c, items, brandsRow] = await Promise.all([
      supabase.from("drogaria").select("id,title").order("pos", { ascending: true }),
      supabase.from("drogaria_items").select("*").order("pos", { ascending: true }),
      supabase.from("settings").select("value").eq("key", "brands").maybeSingle(),
    ]);
    if (c.error) setStatus("Erro ao carregar: " + c.error.message);
    if (items.error) setStatus("Erro ao carregar: " + items.error.message);
    setCats(c.data || []);
    setBrands(normalizeBrands(brandsRow.data && brandsRow.data.value).map((b) => b.name));
    setRows((items.data || []).map((it) => ({ ...it, images: Array.isArray(it.images) ? it.images : [], tags: normalizeTags(it.tags) })));
    setLoading(false);
  }
  useEffect(() => { reload(); }, []);
  useEffect(() => () => { Object.values(timers.current).forEach(clearTimeout); }, []);

  async function saveRow(row) {
    const payload = {
      category_id: row.category_id || null,
      title: row.title ?? "",
      brand: row.brand ?? "",
      reference: row.reference ?? "",
      description: row.description ?? "",
      images: Array.isArray(row.images) ? row.images.filter((u) => u && u.trim()) : [],
      tags: normalizeTags(row.tags),
      pos: Number(row.pos) || 0,
    };
    const { error } = await supabase.from("drogaria_items").update(payload).eq("id", row.id);
    setStatus(error ? "Erro ao guardar: " + error.message : "");
  }

  // Guarda o produto ~0,7s depois da última alteração (auto-save).
  const scheduleSave = (id) => {
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => {
      const r = rowsRef.current.find((x) => x.id === id);
      if (r) saveRow(r);
    }, 700);
  };

  const setField = (id, key, val) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
    scheduleSave(id);
  };

  async function addRow() {
    const pos = rows.length ? Math.max(...rows.map((r) => r.pos || 0)) + 1 : 1;
    const category_id = filter !== "all" ? filter : (cats[0] && cats[0].id) || null;
    const { data, error } = await supabase.from("drogaria_items").insert({ title: "Novo produto", category_id, images: [], tags: [], pos }).select().single();
    setStatus(error ? "Erro ao adicionar: " + error.message : "");
    if (!error) { await reload(); if (data) setSelectedId(data.id); } // abre logo para editar
  }

  async function delRow(row) {
    if (!window.confirm("Apagar “" + (row.title || "este produto") + "”?")) return;
    const { error } = await supabase.from("drogaria_items").delete().eq("id", row.id);
    setStatus(error ? "Erro ao apagar: " + error.message : "");
    if (!error) { setSelectedId(null); reload(); }
  }

  // Liga/desliga um destaque direto na lista (guarda sozinho, como tudo o resto).
  const toggleTag = (row, id) => {
    const cur = normalizeTags(row.tags);
    setField(row.id, "tags", cur.includes(id) ? cur.filter((t) => t !== id) : [...cur, id]);
  };

  if (loading) return <Loading />;

  const catOptions = [["", "— Sem categoria —"], ...cats.map((c) => [c.id, c.title])];
  const catName = (id) => (cats.find((c) => c.id === id) || {}).title || "Sem categoria";
  const visible = filter === "all" ? rows : rows.filter((r) => r.category_id === filter);

  // Opcoes de marca = lista gerida + a marca atual do produto (caso ja nao esteja na lista).
  const brandOptions = (current) => {
    const names = [...brands];
    const cur = (current || "").trim();
    if (cur && !names.some((n) => n.toLowerCase() === cur.toLowerCase())) names.unshift(cur);
    return [["", "— Sem marca —"], ...names.map((n) => [n, n])];
  };

  const fieldsTop = (row) => [
    { key: "category_id", label: "Categoria", type: "select", options: catOptions },
    { key: "title", label: "Nome do produto" },
    { key: "brand", label: "Marca", type: "select", options: brandOptions(row.brand) },
    { key: "reference", label: "Referência(s)" },
    { key: "pos", label: "Ordem", type: "number" },
  ];

  const selected = selectedId ? rows.find((r) => r.id === selectedId) : null;

  // ---- Vista de edição: só aparece depois de selecionar um produto na lista ----
  if (selected) {
    return (
      <div>
        <div style={s("display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:20px;")}>
          <El tag="button" onClick={() => setSelectedId(null)} css={btnGhost} hover="border-color:#fff;">← Voltar à lista</El>
          <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:20px;color:#fff;margin:0;")}>{selected.title || "Produto"}<Status text={status} /></h2>
        </div>
        <div style={s(card)}>
          <div style={s("display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;")}>
            <img src={(selected.images && selected.images[0]) || ""} alt="" style={s("width:120px;height:90px;object-fit:cover;background:#0F0F11;border:1px solid #2A2A30;flex-shrink:0;")} />
            <div style={s("flex:1;min-width:240px;")}>
              <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;")}>
                {fieldsTop(selected).map((f) => (
                  <Field key={f.key} def={f} value={selected[f.key]} onChange={(v) => setField(selected.id, f.key, v)} />
                ))}
              </div>
              <div style={s("margin-top:14px;")}>
                <Field def={{ key: "description", label: "Descrição", type: "textarea", rows: 3, full: true }} value={selected.description} onChange={(v) => setField(selected.id, "description", v)} />
              </div>
              <div style={s("margin-top:14px;")}>
                <Field def={{ key: "tags", label: "Destaques (promoção, produto da semana, mais comprado)", type: "tags" }} value={selected.tags} onChange={(v) => setField(selected.id, "tags", v)} />
              </div>
              <div style={s("margin-top:14px;")}>
                <Field def={{ key: "images", label: "Fotos do produto", type: "images" }} value={selected.images} onChange={(v) => setField(selected.id, "images", v)} />
              </div>
            </div>
          </div>
          <div style={s("display:flex;gap:10px;margin-top:16px;align-items:center;")}>
            <El tag="button" onClick={() => delRow(selected)} css={btnGhost} hover="border-color:#E01E26;color:#E01E26;">Apagar</El>
          </div>
        </div>
      </div>
    );
  }

  // ---- Vista de lista: produtos em linha; tags por checkbox; clicar para editar ----
  return (
    <div>
      <Header title="Produtos" action={<El tag="button" onClick={addRow} css={btnRed} hover="background:#B0151B;">+ Adicionar produto</El>} status={status} />
      <AutoSaveNote />

      {cats.length === 0 && (
        <p style={s("font-family:'Barlow',sans-serif;font-size:15px;color:#FFB46B;margin:0 0 18px;")}>
          Ainda não há categorias. Cria primeiro categorias no separador <b>Categorias</b> e depois adiciona aqui os produtos.
        </p>
      )}

      <div style={s("display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;")}>
        <span style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:#8A8A92;")}>Ver categoria:</span>
        <select className="adm-input" style={{ width: "auto", minWidth: 200 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todas ({rows.length})</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.title} ({rows.filter((r) => r.category_id === c.id).length})</option>)}
        </select>
      </div>

      {visible.length === 0 && <p style={s("font-family:'Barlow',sans-serif;color:#8A8A92;")}>Sem produtos nesta vista.</p>}

      {visible.map((row) => (
        <div key={row.id} style={s("background:#16161A;border:1px solid #2A2A30;margin-bottom:8px;")}>
          <div style={s("display:flex;gap:14px;align-items:center;flex-wrap:wrap;padding:10px 14px;")}>
            <img src={(row.images && row.images[0]) || ""} alt="" style={s("width:60px;height:46px;object-fit:cover;background:#0F0F11;border:1px solid #2A2A30;flex-shrink:0;")} />
            <button onClick={() => setSelectedId(row.id)} style={s("flex:1;min-width:180px;text-align:left;background:none;border:none;cursor:pointer;padding:4px 0;")}>
              <span style={s("display:block;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;font-size:15px;color:#fff;line-height:1.2;")}>{row.title || "Sem nome"}</span>
              <span style={s("display:block;font-family:'Barlow',sans-serif;font-size:12px;color:#8A8A92;margin-top:3px;")}>{catName(row.category_id)}{row.brand ? " · " + row.brand : ""}{row.reference ? " · Ref: " + row.reference : ""}</span>
            </button>
            <TagChecks value={row.tags} onToggle={(id) => toggleTag(row, id)} />
            <div style={s("display:flex;gap:8px;flex-shrink:0;")}>
              <El tag="button" onClick={() => setSelectedId(row.id)} css={btnGhost} hover="border-color:#fff;">Editar</El>
              <El tag="button" onClick={() => delRow(row)} css={btnGhost} hover="border-color:#E01E26;color:#E01E26;">Apagar</El>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// -------- Pedidos recebidos (leads) --------
export function LeadsViewer() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) setStatus("Erro: " + error.message);
    setRows(data || []);
    setLoading(false);
  }
  useEffect(() => { reload(); }, []);

  async function del(id) {
    if (!window.confirm("Apagar este pedido?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    setStatus(error ? "Erro: " + error.message : "Apagado ✓");
    if (!error) reload();
  }

  if (loading) return <Loading />;

  return (
    <div>
      <Header title={"Pedidos recebidos (" + rows.length + ")"} action={<El tag="button" onClick={reload} css={btnGhost} hover="border-color:#fff;">Atualizar</El>} status={status} />
      {rows.length === 0 && <p style={s("font-family:'Barlow',sans-serif;color:#8A8A92;")}>Ainda não há pedidos.</p>}
      {rows.map((r) => (
        <div key={r.id} style={s(card)}>
          <div style={s("display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:baseline;")}>
            <strong style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;color:#fff;font-size:16px;")}>{r.subject || "Pedido"}</strong>
            <span style={s("font-family:'Barlow',sans-serif;font-size:13px;color:#8A8A92;")}>{new Date(r.created_at).toLocaleString("pt-PT")}</span>
          </div>
          <div style={s("font-family:'Barlow',sans-serif;font-size:15px;color:#C7C7CC;margin-top:10px;line-height:1.6;")}>
            <div><b style={{ color: "#fff" }}>{r.name}</b> · {r.email}{r.phone ? " · " + r.phone : ""}</div>
            {r.message ? <div style={s("margin-top:6px;white-space:pre-line;")}>{r.message}</div> : null}
          </div>
          <div style={s("margin-top:14px;")}><El tag="button" onClick={() => del(r.id)} css={btnGhost} hover="border-color:#E01E26;color:#E01E26;">Apagar</El></div>
        </div>
      ))}
    </div>
  );
}

// -------- helpers --------
function Header({ title, action, status }) {
  return (
    <div style={s("display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px;")}>
      <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:24px;color:#fff;margin:0;")}>{title}<Status text={status} /></h2>
      {action}
    </div>
  );
}

function Loading() {
  return <p style={s("font-family:'Barlow',sans-serif;color:#8A8A92;")}>A carregar…</p>;
}

// Esquemas dos catálogos
export const CARRO_FIELDS = [
  { key: "pos", label: "Ordem", type: "number" },
  { key: "title", label: "Título" },
  { key: "tag", label: "Etiqueta" },
  { key: "image_url", label: "Imagem de capa", type: "image", full: true },
  { key: "images", label: "Galeria de trabalhos (exemplos que aparecem na página do serviço)", type: "images", full: true },
  { key: "description", label: "Descrição", type: "textarea", full: true },
];
export const CARRO_NEW = { title: "Novo serviço", tag: "", description: "", image_url: "https://loremflickr.com/640/420/truck?lock=99", images: [] };

export const DROG_FIELDS = [
  { key: "pos", label: "Ordem", type: "number" },
  { key: "title", label: "Título" },
  { key: "count_label", label: "Badge (ex: +200 ref.)" },
  { key: "image_url", label: "Imagem", type: "image", full: true },
  { key: "description", label: "Descrição", type: "textarea", full: true },
];
export const DROG_NEW = { title: "Nova categoria", count_label: "", description: "", image_url: "https://loremflickr.com/520/360/hardware?lock=98" };
