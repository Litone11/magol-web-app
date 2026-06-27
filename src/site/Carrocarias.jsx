import { useState } from "react";
import { El, s } from "../ui.jsx";
import Lightbox from "./Lightbox.jsx";

const STEPS = [
  ["01", "Levantamento", "Avaliamos o veículo e a sua necessidade de carga."],
  ["02", "Projeto", "Desenhamos a carroçaria à medida e orçamentamos."],
  ["03", "Fabrico", "Construímos na nossa oficina, com materiais de qualidade."],
  ["04", "Entrega", "Entregamos pronto a trabalhar, com acompanhamento."],
];

// Fotos da galeria de um serviço: galeria definida no painel -> capa -> nada.
function galleryOf(item) {
  const g = (Array.isArray(item.images) ? item.images : []).filter(Boolean);
  if (g.length) return g;
  return item.image_url ? [item.image_url] : [];
}

// Página "portfolio" de um serviço: descrição + galeria de trabalhos feitos.
function CarroDetail({ item, onBack, go }) {
  const gallery = galleryOf(item);
  const [light, setLight] = useState(-1); // -1 = fechado

  return (
    <div>
      <button onClick={onBack} style={s("background:none;border:none;cursor:pointer;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;font-size:13px;color:#55555E;padding:0 0 22px;")}>← Voltar às carroçarias</button>

      <div style={s("max-width:760px;margin:0 0 38px;")}>
        {item.tag ? <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:12px;color:#E01E26;margin-bottom:12px;")}>{item.tag}</div> : null}
        <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(30px,4.5vw,52px);line-height:1.05;margin:0;color:#16161A;")}>{item.title}</h1>
        {item.description ? <p style={s("font-family:'Barlow',sans-serif;font-size:18px;line-height:1.7;color:#33333A;margin:20px 0 0;white-space:pre-line;")}>{item.description}</p> : null}
      </div>

      {gallery.length > 0 ? (
        <>
          <div style={s("display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px;")}>
            <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(20px,2.6vw,28px);line-height:1;margin:0;color:#16161A;")}>Trabalhos feitos</h2>
            <span style={s("font-family:'Barlow',sans-serif;font-size:14px;color:#8A8A92;")}>{gallery.length} {gallery.length === 1 ? "foto" : "fotos"}</span>
          </div>
          <div style={s("display:grid;grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr));gap:14px;")}>
            {gallery.map((u, i) => (
              <El key={i} tag="button" onClick={() => setLight(i)}
                css="position:relative;padding:0;border:1px solid #E4E4E0;background:#F4F4F2;cursor:pointer;overflow:hidden;aspect-ratio:4/3;"
                hover="border-color:#16161A;">
                <img src={u} alt="" style={s("width:100%;height:100%;object-fit:cover;display:block;")} />
              </El>
            ))}
          </div>
        </>
      ) : (
        <div style={s("border:1px dashed #D6D6D0;background:#F4F4F2;padding:48px 24px;text-align:center;")}>
          <p style={s("font-family:'Barlow',sans-serif;font-size:16px;color:#55555E;margin:0;")}>Ainda não há fotos de trabalhos para mostrar nesta área.</p>
        </div>
      )}

      <div style={s("margin-top:44px;background:#0F0F11;color:#fff;padding:34px 32px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;")}>
        <div>
          <h3 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:24px;margin:0 0 8px;")}>Quer uma destas para o seu veículo?</h3>
          <p style={s("font-family:'Barlow',sans-serif;font-size:16px;color:#B6B6BD;margin:0;")}>Diga-nos o que precisa e fazemos à medida.</p>
        </div>
        <El tag="button" onClick={() => go("contactos")}
          css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:#fff;padding:16px 28px;"
          hover="background:#B0151B;">Pedir informação →</El>
      </div>

      {light >= 0 && <Lightbox images={gallery} index={light} onClose={() => setLight(-1)} onIndex={setLight} />}
    </div>
  );
}

export default function Carrocarias({ content, go }) {
  const [selected, setSelected] = useState(null);
  const open = (item) => { setSelected(item); window.scrollTo(0, 0); };

  return (
    <main>
      <section style={s("position:relative;background:#0F0F11;overflow:hidden;")}>
        <img src={content.images.carroHero} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
        <div style={s("position:absolute;inset:0;background:linear-gradient(95deg,rgba(15,15,17,.94) 0%,rgba(15,15,17,.80) 50%,rgba(15,15,17,.4) 100%);")}></div>
        <div style={s("position:relative;max-width:1240px;margin:0 auto;padding:84px 32px 90px;")}>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:14px;")}>Área 01 — Catálogo</div>
          <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;color:#fff;font-size:clamp(40px,6vw,76px);line-height:1.02;margin:0;")}>Carroçarias</h1>
          <p style={s("font-family:'Barlow',sans-serif;font-size:19px;line-height:1.55;color:#C7C7CC;max-width:56ch;margin:24px 0 0;")}>Fabricamos e reparamos a carroçaria certa para cada veículo de trabalho. Abra cada solução para ver exemplos de trabalhos feitos.</p>
        </div>
        <div style={s("position:absolute;bottom:0;left:0;right:0;height:7px;background:repeating-linear-gradient(45deg,#E01E26 0 16px,#0F0F11 16px 32px);")}></div>
      </section>

      {selected ? (
        <section style={s("max-width:1240px;margin:0 auto;padding:64px 32px 90px;")}>
          <CarroDetail key={selected.id || selected.title} item={selected} onBack={() => setSelected(null)} go={go} />
        </section>
      ) : (
        <>
          <section style={s("max-width:1240px;margin:0 auto;padding:72px 32px 90px;")}>
            <div style={s("display:grid;grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr));gap:24px;")}>
              {content.carrocarias.map((item) => {
                const photos = galleryOf(item).length;
                return (
                  <El key={item.id || item.title} onClick={() => open(item)} role="button" tabIndex={0}
                    css="border:1px solid #E4E4E0;background:#fff;display:flex;flex-direction:column;overflow:hidden;cursor:pointer;"
                    hover="border-color:#16161A;">
                    <div style={s("position:relative;height:190px;background:#16161A;")}>
                      <img src={item.image_url} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
                      {photos > 1 ? <span style={s("position:absolute;bottom:12px;right:12px;background:rgba(15,15,17,.78);color:#fff;font-family:'Barlow',sans-serif;font-size:11px;padding:4px 9px;")}>{photos} fotos</span> : null}
                    </div>
                    <div style={s("padding:24px;display:flex;flex-direction:column;flex:1;")}>
                      <div style={s("font-family:'Barlow',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:11px;color:#E01E26;margin-bottom:8px;")}>{item.tag}</div>
                      <h3 style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;font-size:23px;margin:0 0 10px;color:#16161A;line-height:1.05;")}>{item.title}</h3>
                      <p style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.55;color:#55555E;margin:0;")}>{item.description}</p>
                      <span style={s("margin-top:auto;padding-top:16px;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:#E01E26;")}>Ver exemplos →</span>
                    </div>
                  </El>
                );
              })}
            </div>
          </section>

          <section style={s("background:#F4F4F2;border-top:1px solid #E4E4E0;")}>
            <div style={s("max-width:1240px;margin:0 auto;padding:64px 32px;")}>
              <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(26px,3.5vw,40px);margin:0 0 40px;color:#16161A;")}>Como trabalhamos</h2>
              <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px;")}>
                {STEPS.map(([n, title, desc]) => (
                  <div key={n} style={s("border-top:3px solid #E01E26;padding-top:20px;")}>
                    <div style={s("font-family:'Oswald',sans-serif;font-weight:700;font-size:34px;color:#E01E26;line-height:1;")}>{n}</div>
                    <h4 style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;font-size:19px;margin:14px 0 8px;")}>{title}</h4>
                    <p style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.55;color:#55555E;margin:0;")}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
