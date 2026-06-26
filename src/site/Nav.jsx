import { useState } from "react";
import { El, s } from "../ui.jsx";
import { useIsMobile } from "../lib/useIsMobile.js";

const ITEMS = [
  ["home", "Início"],
  ["carrocarias", "Carroçarias"],
  ["drogaria", "Drogaria"],
  ["sobre", "Empresa"],
  ["contactos", "Contactos"],
];

export default function Nav({ page, go }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navTo = (k) => { setOpen(false); go(k); };
  const askQuote = () => navTo("contactos");

  return (
    <header style={s("position:sticky;top:0;z-index:60;background:#0F0F11;border-bottom:1px solid #26262C;")}>
      <div style={s("max-width:1240px;margin:0 auto;padding:0 " + (isMobile ? "20px" : "32px") + ";height:" + (isMobile ? "62px" : "74px") + ";display:flex;align-items:center;justify-content:space-between;gap:16px;")}>
        <button onClick={() => navTo("home")} style={s("display:flex;align-items:center;background:none;border:none;cursor:pointer;padding:0;line-height:0;")}>
          <span className="mg-logo" style={{ fontSize: isMobile ? "24px" : "28px" }}>MAGOL<b>.</b></span>
        </button>

        {isMobile ? (
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}
            style={s("background:none;border:none;cursor:pointer;color:#fff;font-size:26px;line-height:1;padding:6px;")}>
            {open ? "✕" : "☰"}
          </button>
        ) : (
          <nav style={s("display:flex;align-items:center;gap:2px;flex-wrap:wrap;justify-content:flex-end;")}>
            {ITEMS.map(([key, label]) => (
              <button key={key} onClick={() => navTo(key)}
                style={s(`background:none;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#EDEDED;padding:10px 14px;border-bottom:2px solid ${page === key ? "#E01E26" : "transparent"};`)}>
                {label}
              </button>
            ))}
            <El tag="button" onClick={askQuote}
              css="margin-left:12px;background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#fff;padding:12px 20px;"
              hover="background:#B0151B;">Contactar</El>
          </nav>
        )}
      </div>

      {isMobile && open ? (
        <nav style={s("background:#0F0F11;border-top:1px solid #26262C;padding:6px 20px 16px;display:flex;flex-direction:column;")}>
          {ITEMS.map(([key, label]) => (
            <button key={key} onClick={() => navTo(key)}
              style={s(`background:none;border:none;cursor:pointer;text-align:left;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:17px;color:${page === key ? "#E01E26" : "#EDEDED"};padding:15px 4px;border-bottom:1px solid #1C1C22;`)}>
              {label}
            </button>
          ))}
          <button onClick={askQuote}
            style={s("margin-top:16px;background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:16px;color:#fff;padding:15px 20px;width:100%;")}>
            Contactar
          </button>
        </nav>
      ) : null}
    </header>
  );
}
