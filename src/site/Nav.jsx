import { El, s } from "../ui.jsx";

const ITEMS = [
  ["home", "Início"],
  ["carrocarias", "Carroçarias"],
  ["drogaria", "Drogaria"],
  ["sobre", "Empresa"],
  ["contactos", "Contactos"],
];

export default function Nav({ page, go, openQuote }) {
  return (
    <header style={s("position:sticky;top:0;z-index:60;background:#0F0F11;border-bottom:1px solid #26262C;")}>
      <div style={s("max-width:1240px;margin:0 auto;padding:0 32px;height:74px;display:flex;align-items:center;justify-content:space-between;gap:20px;")}>
        <button onClick={() => go("home")} style={s("display:flex;align-items:center;background:none;border:none;cursor:pointer;padding:0;line-height:0;")}>
          <span className="mg-logo" style={{ fontSize: "28px" }}>MAGOL<b>.</b></span>
        </button>
        <nav style={s("display:flex;align-items:center;gap:2px;flex-wrap:wrap;justify-content:flex-end;")}>
          {ITEMS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => go(key)}
              style={s(`background:none;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#EDEDED;padding:10px 14px;border-bottom:2px solid ${page === key ? "#E01E26" : "transparent"};`)}
            >
              {label}
            </button>
          ))}
          <El
            tag="button"
            onClick={() => openQuote("")}
            css="margin-left:12px;background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#fff;padding:12px 20px;"
            hover="background:#B0151B;"
          >
            Pedir Orçamento
          </El>
        </nav>
      </div>
    </header>
  );
}
