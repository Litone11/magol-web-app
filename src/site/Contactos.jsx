import { useState } from "react";
import { El, s } from "../ui.jsx";
import { mapEmbedSrc } from "../lib/mapEmbed.js";

const EMPTY = { name: "", email: "", phone: "", subject: "Carroçarias", message: "" };
const fieldCss = "background:#1C1C22;border:1px solid #33333A;color:#fff;font-family:'Barlow',sans-serif;font-size:15px;padding:14px 16px;";

function buildMailto(to, { name, email, phone, subject, message }) {
  const body = `Nome: ${name}\nEmail: ${email}\nTelefone: ${phone || "-"}\n\nMensagem:\n${message}`;
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${to}?${query}`;
}

function InfoRow({ label, children, top }) {
  return (
    <div style={s("padding:24px 26px;background:#fff;" + (top ? "border-top:1px solid #E4E4E0;" : ""))}>
      <div style={s("font-family:'Barlow',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:12px;color:#E01E26;margin-bottom:6px;")}>{label}</div>
      <div style={s("font-family:'Barlow',sans-serif;font-size:17px;line-height:1.55;color:#16161A;white-space:pre-line;")}>{children}</div>
    </div>
  );
}

export default function Contactos({ content, go }) {
  const { contacts } = content;
  const mapSrc = mapEmbedSrc(contacts);
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!privacyAccepted) return;
    const payload = { ...form, subject: "Contacto — " + form.subject };
    window.location.href = buildMailto(contacts.email, payload);
    setSent(true);
  }

  return (
    <main>
      <section style={s("background:#0F0F11;")}>
        <div style={s("max-width:1240px;margin:0 auto;padding:74px 32px 70px;")}>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:14px;")}>Contactos</div>
          <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;color:#fff;font-size:clamp(38px,5.5vw,66px);line-height:1.02;margin:0;")}>Falamos consigo</h1>
          <p style={s("font-family:'Barlow',sans-serif;font-size:18px;color:#C7C7CC;margin:20px 0 0;max-width:52ch;")}>Tire uma dúvida, peça informações ou venha à loja. Respondemos sempre.</p>
        </div>
        <div style={s("height:7px;background:repeating-linear-gradient(45deg,#E01E26 0 16px,#0F0F11 16px 32px);")}></div>
      </section>

      <section style={s("max-width:1240px;margin:0 auto;padding:72px 32px 90px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:50px;align-items:start;")}>
        {/* INFO */}
        <div>
          <div style={s("display:grid;gap:2px;border:1px solid #E4E4E0;")}>
            <InfoRow label="Morada">{contacts.address}</InfoRow>
            <InfoRow label="Telefone" top>
              {contacts.phoneLandline} <span style={{ color: "#8A8A92" }}>(fixo)</span>{"\n"}
              {contacts.phoneMobile} <span style={{ color: "#8A8A92" }}>(telemóvel)</span>
            </InfoRow>
            <InfoRow label="Email" top>{contacts.email}</InfoRow>
            <InfoRow label="Horário" top>{contacts.hours}</InfoRow>
          </div>
          <div style={s("margin-top:20px;position:relative;height:300px;background:#F4F4F2;border:1px solid #E4E4E0;")}>
            <iframe title="Localização MAGOL" src={mapSrc} style={s("position:absolute;inset:0;width:100%;height:100%;border:0;")} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
          </div>
        </div>

        {/* FORM */}
        <div style={s("background:#0F0F11;padding:38px 34px;")}>
          {sent ? (
            <div style={s("text-align:center;padding:40px 10px;")}>
              <div style={s("width:64px;height:64px;background:#E01E26;display:grid;place-items:center;margin:0 auto 22px;font-family:'Oswald',sans-serif;font-weight:700;font-size:34px;color:#fff;")}>✓</div>
              <h3 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:26px;color:#fff;margin:0 0 10px;")}>Pedido enviado</h3>
              <p style={s("font-family:'Barlow',sans-serif;font-size:16px;color:#B6B6BD;margin:0 0 24px;")}>Obrigado! Entraremos em contacto o mais breve possível.</p>
              <El tag="button" onClick={() => { setSent(false); setForm(EMPTY); setPrivacyAccepted(false); }}
                css="background:none;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#fff;padding:13px 24px;"
                hover="border-color:#fff;">Enviar outro pedido</El>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:24px;color:#fff;margin:0 0 6px;")}>Contacte-nos</h3>
              <p style={s("font-family:'Barlow',sans-serif;font-size:15px;color:#B6B6BD;margin:0 0 24px;")}>Preencha e nós tratamos do resto.</p>
              <div style={s("display:grid;gap:16px;")}>
                <input required placeholder="Nome" value={form.name} onChange={upd("name")} style={s(fieldCss)} />
                <input required type="email" placeholder="Email" value={form.email} onChange={upd("email")} style={s(fieldCss)} />
                <input placeholder="Telefone" value={form.phone} onChange={upd("phone")} style={s(fieldCss)} />
                <select value={form.subject} onChange={upd("subject")} style={s(fieldCss)}>
                  <option>Carroçarias</option>
                  <option>Drogaria</option>
                  <option>Outro assunto</option>
                </select>
                <textarea required rows="4" placeholder="Descreva o que precisa" value={form.message} onChange={upd("message")} style={s(fieldCss + "resize:vertical;")}></textarea>
                <div style={s("display:flex;align-items:flex-start;gap:10px;font-family:'Barlow',sans-serif;font-size:14px;line-height:1.45;color:#C7C7CC;")}>
                  <input
                    required
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    style={s("flex:0 0 18px;width:18px;height:18px;margin:1px 0 0;cursor:pointer;accent-color:#E01E26;")}
                  />
                  <span>Li e aceito a <El tag="button" type="button" onClick={() => go("privacidade")}
                    css="background:none;border:none;cursor:pointer;font:inherit;color:#fff;padding:0;text-decoration:underline;text-underline-offset:3px;"
                    hover="color:#E01E26;">política de privacidade</El> e os <El tag="button" type="button" onClick={() => go("termos")}
                    css="background:none;border:none;cursor:pointer;font:inherit;color:#fff;padding:0;text-decoration:underline;text-underline-offset:3px;"
                    hover="color:#E01E26;">termos e condições</El>.</span>
                </div>
                <El tag="button" type="submit"
                  css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:#fff;padding:16px 24px;"
                  hover="background:#B0151B;">Enviar mensagem →</El>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
