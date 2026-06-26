import { useEffect, useState } from "react";
import { El, s } from "../ui.jsx";
import { submitLead } from "../lib/leads.js";

const EMPTY = { name: "", email: "", phone: "", message: "" };
const fieldCss = "background:#1C1C22;border:1px solid #33333A;color:#fff;font-family:'Barlow',sans-serif;font-size:15px;padding:14px 16px;";

export default function QuoteModal({ open, subject, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  function close() {
    setForm(EMPTY);
    setSent(false);
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    await submitLead({ ...form, subject: subject || "Pedido geral" });
    setBusy(false);
    setSent(true);
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      style={s("position:fixed;inset:0;z-index:100;background:rgba(8,8,10,.72);display:flex;align-items:center;justify-content:center;padding:24px;")}
    >
      <div style={s("background:#0F0F11;width:100%;max-width:520px;max-height:92vh;overflow:auto;border:1px solid #2A2A30;")}>
        <div style={s("height:6px;background:repeating-linear-gradient(45deg,#E01E26 0 16px,#0F0F11 16px 32px);")}></div>
        <div style={s("padding:34px;")}>
          <div style={s("display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:8px;")}>
            <h3 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:26px;color:#fff;margin:0;")}>Pedir orçamento</h3>
            <El tag="button" onClick={close}
              css="background:none;border:1px solid #33333A;color:#fff;cursor:pointer;width:38px;height:38px;font-size:18px;flex-shrink:0;"
              hover="border-color:#E01E26;">✕</El>
          </div>

          {subject ? (
            <div style={s("display:inline-block;background:#1C1C22;border:1px solid #33333A;color:#E01E26;font-family:'Barlow',sans-serif;font-weight:600;font-size:13px;padding:7px 13px;margin-bottom:18px;")}>{subject}</div>
          ) : null}

          {sent ? (
            <div style={s("text-align:center;padding:30px 10px;")}>
              <div style={s("width:60px;height:60px;background:#E01E26;display:grid;place-items:center;margin:0 auto 20px;font-family:'Oswald',sans-serif;font-weight:700;font-size:32px;color:#fff;")}>✓</div>
              <h4 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:22px;color:#fff;margin:0 0 10px;")}>Pedido enviado</h4>
              <p style={s("font-family:'Barlow',sans-serif;font-size:15px;color:#B6B6BD;margin:0 0 22px;")}>Obrigado! Entraremos em contacto em breve.</p>
              <El tag="button" onClick={close}
                css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#fff;padding:13px 26px;"
                hover="background:#B0151B;">Fechar</El>
            </div>
          ) : (
            <form onSubmit={submit} style={s("display:grid;gap:14px;margin-top:6px;")}>
              <input required placeholder="Nome" value={form.name} onChange={upd("name")} style={s(fieldCss)} />
              <input required type="email" placeholder="Email" value={form.email} onChange={upd("email")} style={s(fieldCss)} />
              <input placeholder="Telefone" value={form.phone} onChange={upd("phone")} style={s(fieldCss)} />
              <textarea required rows="4" placeholder="Descreva o que precisa" value={form.message} onChange={upd("message")} style={s(fieldCss + "resize:vertical;")}></textarea>
              <El tag="button" type="submit" disabled={busy}
                css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:#fff;padding:16px 24px;"
                hover="background:#B0151B;">{busy ? "A enviar…" : "Enviar pedido →"}</El>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
