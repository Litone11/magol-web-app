import { useEffect } from "react";
import { s } from "../ui.jsx";

// Visor em ecrã cheio: ver cada foto em grande e navegar entre elas.
// Usado na galeria das Carroçarias e na página de produto da Drogaria.
export default function Lightbox({ images, index, onClose, onIndex }) {
  const n = images.length;
  const prev = (e) => { e.stopPropagation(); onIndex((index - 1 + n) % n); };
  const next = (e) => { e.stopPropagation(); onIndex((index + 1) % n); };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && n > 1) onIndex((index - 1 + n) % n);
      else if (e.key === "ArrowRight" && n > 1) onIndex((index + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onClose, onIndex]);

  const arrow = "position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:none;cursor:pointer;color:#fff;font-size:34px;line-height:1;width:54px;height:54px;display:grid;place-items:center;";

  return (
    <div onClick={onClose} style={s("position:fixed;inset:0;z-index:1000;background:rgba(8,8,10,.93);display:grid;place-items:center;padding:40px;")}>
      <button onClick={onClose} style={s("position:absolute;top:18px;right:22px;background:none;border:none;cursor:pointer;color:#fff;font-size:30px;line-height:1;")}>✕</button>
      {n > 1 && <button onClick={prev} style={s(arrow + "left:18px;")} aria-label="Anterior">‹</button>}
      <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()} style={s("max-width:90vw;max-height:84vh;object-fit:contain;display:block;")} />
      {n > 1 && <button onClick={next} style={s(arrow + "right:18px;")} aria-label="Seguinte">›</button>}
      {n > 1 && <div style={s("position:absolute;bottom:22px;left:0;right:0;text-align:center;font-family:'Barlow',sans-serif;font-size:14px;color:#C7C7CC;")}>{index + 1} / {n}</div>}
    </div>
  );
}
