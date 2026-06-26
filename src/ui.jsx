import { useState } from "react";

// Converte uma string CSS ("background:#000;color:#fff") num objeto de estilo React.
// Permite portar a marcacao do design quase tal e qual, mantendo as cores/medidas exatas.
export function s(css) {
  const out = {};
  if (!css) return out;
  for (const decl of css.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    let key = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!key) continue;
    key = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = val;
  }
  return out;
}

// Elemento com estilo por string e estilo-hover opcional (substitui o "style-hover" do design).
export function El({ tag = "div", css = "", hover = "", children, ...rest }) {
  const [h, setH] = useState(false);
  const Tag = tag;
  const handlers = hover
    ? { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }
    : {};
  return (
    <Tag style={s(hover && h ? css + ";" + hover : css)} {...handlers} {...rest}>
      {children}
    </Tag>
  );
}
