import { El, s } from "../ui.jsx";

const NAV = [
  ["home", "Início"],
  ["carrocarias", "Carroçarias"],
  ["drogaria", "Drogaria"],
  ["sobre", "Empresa"],
  ["contactos", "Contactos"],
];

export default function Footer({ contacts, go }) {
  return (
    <footer style={s("background:#08080A;border-top:1px solid #1F1F24;")}>
      <div style={s("max-width:1240px;margin:0 auto;padding:64px 32px 30px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:40px;")}>
        <div>
          <div style={s("display:inline-flex;align-items:center;margin-bottom:18px;line-height:0;")}>
            <span className="mg-logo" style={{ fontSize: "24px" }}>MAGOL<b>.</b></span>
          </div>
          <p style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.6;color:#7A7A82;margin:0;max-width:30ch;")}>Carroçarias e drogaria na Branca, Albergaria-a-Velha, Aveiro. Trabalho robusto desde 1985.</p>
        </div>
        <div>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:13px;color:#fff;margin-bottom:16px;")}>Navegação</div>
          <div style={s("display:flex;flex-direction:column;gap:10px;align-items:flex-start;")}>
            {NAV.map(([key, label]) => (
              <El key={key} tag="button" onClick={() => go(key)}
                css="background:none;border:none;cursor:pointer;font-family:'Barlow',sans-serif;font-size:15px;color:#9A9AA2;padding:0;"
                hover="color:#fff;">{label}</El>
            ))}
          </div>
        </div>
        <div>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:13px;color:#fff;margin-bottom:16px;")}>Contactos</div>
          <div style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.8;color:#9A9AA2;white-space:pre-line;")}>
            {contacts.address}{"\n"}{contacts.phoneLandline}{"\n"}{contacts.email}
          </div>
        </div>
      </div>
      <div style={s("border-top:1px solid #1F1F24;")}>
        <div style={s("max-width:1240px;margin:0 auto;padding:20px 32px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-family:'Barlow',sans-serif;font-size:13px;color:#5A5A62;")}>
          <span>© 2026 MAGOL – Leonel & Filhos, Lda. | NIF: 500 855 897 | Matriculada na CRC de Albergaria-a-Velha</span>
          <div style={s("display:flex;gap:14px;flex-wrap:wrap;")}>
            <El tag="button" onClick={() => go("privacidade")}
              css="background:none;border:none;cursor:pointer;font-family:'Barlow',sans-serif;font-size:13px;color:#9A9AA2;padding:0;text-decoration:underline;text-underline-offset:3px;"
              hover="color:#fff;">Política de Privacidade</El>
            <El tag="button" onClick={() => go("cookies")}
              css="background:none;border:none;cursor:pointer;font-family:'Barlow',sans-serif;font-size:13px;color:#9A9AA2;padding:0;text-decoration:underline;text-underline-offset:3px;"
              hover="color:#fff;">Política de Cookies</El>
            <El tag="button" onClick={() => go("termos")}
              css="background:none;border:none;cursor:pointer;font-family:'Barlow',sans-serif;font-size:13px;color:#9A9AA2;padding:0;text-decoration:underline;text-underline-offset:3px;"
              hover="color:#fff;">Termos e Condições</El>
          </div>
        </div>
      </div>
    </footer>
  );
}
