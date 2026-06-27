import { useEffect, useState } from "react";
import { supabase, isConfigured } from "../lib/supabase.js";
import { El, s } from "../ui.jsx";
import {
  CatalogueEditor, ContactsEditor, StatsTextsEditor, SiteImagesEditor, LeadsViewer,
  CARRO_FIELDS, CARRO_NEW, DROG_FIELDS, DROG_NEW,
} from "./editors.jsx";

const TABS = [
  ["carro", "Carroçarias"],
  ["drog", "Drogaria"],
  ["contactos", "Contactos"],
  ["definicoes", "Estatísticas & textos"],
  ["imagens", "Imagens"],
  ["pedidos", "Pedidos"],
];

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = ainda a verificar
  const [tab, setTab] = useState("carro");

  useEffect(() => {
    if (!isConfigured) { setSession(null); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isConfigured) return <NotConfigured />;
  if (session === undefined) return <Shell><p style={s("color:#8A8A92;font-family:'Barlow',sans-serif;")}>A carregar…</p></Shell>;
  if (!session) return <Login />;

  return (
    <Shell
      email={session.user?.email}
      onLogout={() => supabase.auth.signOut()}
      tabs={
        <div style={s("display:flex;gap:4px;flex-wrap:wrap;")}>
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={s(`background:${tab === key ? "#E01E26" : "transparent"};border:1px solid ${tab === key ? "#E01E26" : "#33333A"};cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:#fff;padding:10px 16px;`)}>
              {label}
            </button>
          ))}
        </div>
      }
    >
      {tab === "carro" && <CatalogueEditor table="carrocarias" fields={CARRO_FIELDS} newRow={CARRO_NEW} title="Catálogo · Carroçarias" />}
      {tab === "drog" && <CatalogueEditor table="drogaria" fields={DROG_FIELDS} newRow={DROG_NEW} title="Catálogo · Drogaria" />}
      {tab === "contactos" && <ContactsEditor />}
      {tab === "definicoes" && <StatsTextsEditor />}
      {tab === "imagens" && <SiteImagesEditor />}
      {tab === "pedidos" && <LeadsViewer />}
    </Shell>
  );
}

// ---------------- Shell ----------------
function Shell({ children, email, onLogout, tabs }) {
  return (
    <div style={s("min-height:100vh;background:#0F0F11;color:#fff;")}>
      <header style={s("background:#08080A;border-bottom:1px solid #1F1F24;")}>
        <div style={s("max-width:1080px;margin:0 auto;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;")}>
          <div style={s("display:flex;align-items:baseline;gap:14px;")}>
            <span className="mg-logo" style={{ fontSize: "22px" }}>MAGOL<b>.</b></span>
            <span style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.14em;font-size:12px;color:#8A8A92;")}>Gestão</span>
          </div>
          <div style={s("display:flex;align-items:center;gap:14px;")}>
            <a href="#" style={s("font-family:'Barlow',sans-serif;font-size:14px;color:#9A9AA2;text-decoration:none;")}>← Ver site</a>
            {email && <span style={s("font-family:'Barlow',sans-serif;font-size:13px;color:#6E6E78;")}>{email}</span>}
            {onLogout && <El tag="button" onClick={onLogout} css="background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:#fff;padding:8px 14px;" hover="border-color:#E01E26;color:#E01E26;">Sair</El>}
          </div>
        </div>
        {tabs && <div style={s("max-width:1080px;margin:0 auto;padding:0 24px 18px;")}>{tabs}</div>}
      </header>
      <main style={s("max-width:1080px;margin:0 auto;padding:32px 24px 80px;")}>{children}</main>
    </div>
  );
}

// ---------------- Login ----------------
function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setBusy(false);
    if (error) setErr(error.message);
  }

  return (
    <div style={s("min-height:100vh;background:#0F0F11;display:flex;align-items:center;justify-content:center;padding:24px;")}>
      <div style={s("width:100%;max-width:400px;")}>
        <div style={s("text-align:center;margin-bottom:26px;")}>
          <span className="mg-logo" style={{ fontSize: "30px" }}>MAGOL<b>.</b></span>
          <div style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.16em;font-size:12px;color:#8A8A92;margin-top:8px;")}>Painel de gestão</div>
        </div>
        <form onSubmit={submit} style={s("background:#16161A;border:1px solid #2A2A30;padding:30px;display:grid;gap:16px;")}>
          <div>
            <label className="adm-label">Email</label>
            <input className="adm-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="adm-label">Palavra-passe</label>
            <input className="adm-input" type="password" required value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          {err && <div style={s("font-family:'Barlow',sans-serif;font-size:14px;color:#FF6B6B;")}>{err}</div>}
          <El tag="button" type="submit" disabled={busy}
            css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:#fff;padding:15px 24px;"
            hover="background:#B0151B;">{busy ? "A entrar…" : "Entrar"}</El>
        </form>
        <p style={s("text-align:center;font-family:'Barlow',sans-serif;font-size:13px;color:#5A5A62;margin-top:18px;")}>
          <a href="#" style={s("color:#9A9AA2;")}>← Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}

// ---------------- Sem Supabase configurada ----------------
function NotConfigured() {
  return (
    <div style={s("min-height:100vh;background:#0F0F11;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;")}>
      <div style={s("max-width:560px;background:#16161A;border:1px solid #2A2A30;padding:34px;")}>
        <span className="mg-logo" style={{ fontSize: "26px" }}>MAGOL<b>.</b></span>
        <h2 style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;color:#fff;margin:20px 0 12px;")}>Falta ligar a Supabase</h2>
        <p style={s("font-family:'Barlow',sans-serif;font-size:16px;line-height:1.6;color:#B6B6BD;margin:0 0 14px;")}>
          O site está a correr em <b>modo demo</b> (dados locais, sem gravar). Para ativar o painel de gestão, cria um projeto Supabase e preenche o ficheiro <code style={{ color: "#E01E26" }}>.env.local</code> com o URL e a anon key.
        </p>
        <p style={s("font-family:'Barlow',sans-serif;font-size:15px;color:#8A8A92;margin:0;")}>Passo a passo completo no <code style={{ color: "#fff" }}>README.md</code> do projeto.</p>
        <p style={s("margin-top:22px;")}><a href="#" style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#E01E26;text-decoration:none;")}>← Voltar ao site</a></p>
      </div>
    </div>
  );
}
