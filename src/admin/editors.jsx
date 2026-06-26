import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { uploadImage } from "../lib/storage.js";
import { DEFAULTS, TEXT_FIELDS } from "../lib/content.js";
import { El, s } from "../ui.jsx";

const card = "background:#16161A;border:1px solid #2A2A30;padding:22px;margin-bottom:18px;";
const btnRed = "background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:#fff;padding:11px 18px;";
const btnGhost = "background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:#fff;padding:11px 18px;";

function Status({ text }) {
  if (!text) return null;
  const err = text.startsWith("Erro");
  return <span style={s("font-family:'Barlow',sans-serif;font-size:14px;margin-left:14px;color:" + (err ? "#FF6B6B" : "#5AD18A") + ";")}>{text}</span>;
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

function Field({ def, value, onChange }) {
  if (def.type === "image") return <ImageField def={def} value={value} onChange={onChange} />;
  return (
    <div style={def.full ? { gridColumn: "1 / -1" } : undefined}>
      <label className="adm-label">{def.label}</label>
      {def.type === "textarea" ? (
        <textarea className="adm-input" rows={def.rows || 3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{ resize: "vertical" }} />
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

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order("pos", { ascending: true });
    if (error) setStatus("Erro: " + error.message);
    setRows(data || []);
    setLoading(false);
  }
  useEffect(() => { reload(); }, [table]);

  const setField = (id, key, val) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: val } : r)));

  async function saveRow(row) {
    setStatus("A guardar…");
    const payload = {};
    fields.forEach((f) => { payload[f.key] = f.type === "number" ? Number(row[f.key]) || 0 : row[f.key] ?? ""; });
    const { error } = await supabase.from(table).update(payload).eq("id", row.id);
    setStatus(error ? "Erro: " + error.message : "Guardado ✓");
  }

  async function addRow() {
    const pos = rows.length ? Math.max(...rows.map((r) => r.pos || 0)) + 1 : 1;
    const { error } = await supabase.from(table).insert({ ...newRow, pos });
    setStatus(error ? "Erro: " + error.message : "Adicionado ✓");
    if (!error) reload();
  }

  async function delRow(row) {
    if (!window.confirm("Apagar “" + (row.title || "este item") + "”?")) return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    setStatus(error ? "Erro: " + error.message : "Apagado ✓");
    if (!error) reload();
  }

  if (loading) return <Loading />;

  return (
    <div>
      <Header title={title} action={<El tag="button" onClick={addRow} css={btnRed} hover="background:#B0151B;">+ Adicionar</El>} status={status} />
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
            <El tag="button" onClick={() => saveRow(row)} css={btnRed} hover="background:#B0151B;">Guardar</El>
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

  if (!val) return <Loading />;
  const upd = (k) => (v) => setVal((c) => ({ ...c, [k]: v }));

  async function save() {
    setStatus("A guardar…");
    const { error } = await supabase.from("settings").upsert({ key: "contacts", value: val, updated_at: new Date().toISOString() });
    setStatus(error ? "Erro: " + error.message : "Guardado ✓");
  }

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
      <div style={s(card)}>
        <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;")}>
          {FIELDS.map((f) => <Field key={f.key} def={f} value={val[f.key]} onChange={upd(f.key)} />)}
        </div>
        <div style={s("margin-top:18px;")}><El tag="button" onClick={save} css={btnRed} hover="background:#B0151B;">Guardar contactos</El></div>
      </div>
    </div>
  );
}

// -------- Estatísticas & textos --------
export function StatsTextsEditor() {
  const [stats, setStats] = useState(null);
  const [texts, setTexts] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.from("settings").select("key,value").in("key", ["stats", "texts"]).then(({ data }) => {
      const m = {}; (data || []).forEach((r) => { m[r.key] = r.value; });
      setStats(Array.isArray(m.stats) && m.stats.length ? m.stats : DEFAULTS.stats);
      setTexts({ ...DEFAULTS.texts, ...(m.texts || {}) });
    });
  }, []);

  if (!stats || !texts) return <Loading />;

  const setStat = (i, k, v) => setStats((ss) => ss.map((st, j) => (j === i ? { ...st, [k]: v } : st)));
  const addStat = () => setStats((ss) => [...ss, { value: "", label: "" }]);
  const delStat = (i) => setStats((ss) => ss.filter((_, j) => j !== i));
  const setText = (k) => (v) => setTexts((t) => ({ ...t, [k]: v }));

  async function save() {
    setStatus("A guardar…");
    const now = new Date().toISOString();
    const { error } = await supabase.from("settings").upsert([
      { key: "stats", value: stats, updated_at: now },
      { key: "texts", value: texts, updated_at: now },
    ]);
    setStatus(error ? "Erro: " + error.message : "Guardado ✓");
  }

  return (
    <div>
      <Header title="Estatísticas & textos" action={<El tag="button" onClick={save} css={btnRed} hover="background:#B0151B;">Guardar tudo</El>} status={status} />

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
  { key: "no", label: "Nº" },
  { key: "title", label: "Título" },
  { key: "tag", label: "Etiqueta" },
  { key: "image_url", label: "Imagem", type: "image", full: true },
  { key: "description", label: "Descrição", type: "textarea", full: true },
];
export const CARRO_NEW = { no: "", title: "Novo serviço", tag: "", description: "", image_url: "https://loremflickr.com/640/420/truck?lock=99" };

export const DROG_FIELDS = [
  { key: "pos", label: "Ordem", type: "number" },
  { key: "title", label: "Título" },
  { key: "count_label", label: "Badge (ex: +200 ref.)" },
  { key: "image_url", label: "Imagem", type: "image", full: true },
  { key: "description", label: "Descrição", type: "textarea", full: true },
];
export const DROG_NEW = { title: "Nova categoria", count_label: "", description: "", image_url: "https://loremflickr.com/520/360/hardware?lock=98" };
