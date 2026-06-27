import { Fragment } from "react";
import { El, s } from "../ui.jsx";
import { mapEmbedSrc } from "../lib/mapEmbed.js";
import { useIsMobile } from "../lib/useIsMobile.js";

const TERMS = ["Basculantes", "Caixas Abertas", "Isotérmicas", "Reboques", "Tintas", "Ferramentas", "Ferragens", "Reparações"];

function StatValue({ value }) {
  const m = /^([\d.,]+)(.*)$/.exec(value || "");
  if (!m) return <>{value}</>;
  return <>{m[1]}<span style={{ fontSize: "30px" }}>{m[2]}</span></>;
}

function TickerRow({ hidden }) {
  return (
    <div aria-hidden={hidden || undefined} style={s("display:flex;gap:48px;padding:14px 24px;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.14em;font-size:14px;color:#6E6E78;white-space:nowrap;")}>
      {TERMS.map((t, i) => (
        <Fragment key={i}>
          <span>{t}</span>
          <span style={{ color: "#E01E26" }}>◆</span>
        </Fragment>
      ))}
    </div>
  );
}

export default function Home({ content, go }) {
  const { texts, stats, images } = content;
  const mapSrc = mapEmbedSrc(content.contacts);
  const isMobile = useIsMobile();
  return (
    <main>
      {/* HERO */}
      <section style={s("position:relative;background:#0F0F11;overflow:hidden;")}>
        <img src={images.homeHero} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
        <div style={s("position:absolute;inset:0;background:linear-gradient(95deg,rgba(15,15,17,.93) 0%,rgba(15,15,17,.74) 42%,rgba(15,15,17,.18) 100%);")}></div>
        <div style={s("position:relative;max-width:1240px;margin:0 auto;padding:" + (isMobile ? "72px 24px 84px" : "120px 32px 130px") + ";width:100%;")}>
          <div style={s("display:flex;align-items:center;gap:14px;margin-bottom:26px;")}>
            <span style={s("width:38px;height:3px;background:#E01E26;display:block;")}></span>
            <span style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.22em;font-size:13px;color:#E01E26;")}>{texts.heroPre}</span>
          </div>
          <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;color:#fff;font-size:clamp(44px,7vw,92px);line-height:1.05;letter-spacing:-.005em;margin:0;max-width:16ch;")}>{texts.heroTitle}<span style={{ color: "#E01E26" }}>{texts.heroAccent}</span></h1>
          <p style={s("font-family:'Barlow',sans-serif;font-size:clamp(17px,2vw,21px);line-height:1.55;color:#C7C7CC;max-width:54ch;margin:30px 0 0;")}>{texts.heroSub}</p>
          <div style={s("display:flex;gap:14px;flex-wrap:wrap;margin-top:42px;")}>
            <El tag="button" onClick={() => go("carrocarias")}
              css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:16px;color:#fff;padding:17px 30px;"
              hover="background:#B0151B;">Ver Carroçarias →</El>
            <El tag="button" onClick={() => go("drogaria")}
              css="background:transparent;border:1px solid #45454C;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:16px;color:#fff;padding:17px 30px;"
              hover="border-color:#fff;background:rgba(255,255,255,.06);">Explorar Drogaria</El>
          </div>
        </div>
        <div style={s("position:absolute;bottom:0;left:0;right:0;height:7px;background:repeating-linear-gradient(45deg,#E01E26 0 16px,#0F0F11 16px 32px);")}></div>
      </section>

      {/* TICKER */}
      <div style={s("background:#16161A;overflow:hidden;border-bottom:1px solid #26262C;")}>
        <div style={s("display:flex;width:max-content;animation:mg-ticker 30s linear infinite;")}>
          <TickerRow />
          <TickerRow hidden />
        </div>
      </div>

      {/* DUAS ÁREAS */}
      <section style={s("max-width:1240px;margin:0 auto;padding:96px 32px 40px;")}>
        <div style={s("display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:44px;")}>
          <div>
            <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:12px;")}>Duas áreas, uma casa</div>
            <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(32px,4.5vw,52px);line-height:1;margin:0;color:#16161A;")}>O que fazemos</h2>
          </div>
          <p style={s("font-family:'Barlow',sans-serif;font-size:17px;line-height:1.6;color:#55555E;max-width:42ch;margin:0;")}>Do fabrico da carroçaria ao parafuso que falta para acabar o trabalho — resolvemos os dois.</p>
        </div>
        <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));gap:24px;")}>
          {/* carro */}
          <div style={s("background:#0F0F11;color:#fff;overflow:hidden;display:flex;flex-direction:column;")}>
            <div style={s("position:relative;height:240px;")}>
              <img src={images.homeAreaCarro} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
              <span style={s("position:absolute;top:18px;left:18px;background:#E01E26;color:#fff;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:7px 12px;")}>Área 01</span>
            </div>
            <div style={s("padding:30px;display:flex;flex-direction:column;flex:1;")}>
              <h3 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:30px;margin:0 0 12px;")}>Carroçarias</h3>
              <p style={s("font-family:'Barlow',sans-serif;font-size:16px;line-height:1.6;color:#B6B6BD;margin:0 0 22px;")}>Fabrico, adaptação e reparação de caixas, basculantes, furgões, isotérmicas e reboques. Soluções à medida da sua atividade.</p>
              <div style={s("display:flex;flex-wrap:wrap;gap:8px;margin-bottom:26px;")}>
                {["Basculantes", "Isotérmicas", "Reboques", "Reparação"].map((t) => (
                  <span key={t} style={s("border:1px solid #33333A;color:#C7C7CC;font-size:13px;padding:6px 11px;font-family:'Barlow',sans-serif;font-weight:500;")}>{t}</span>
                ))}
              </div>
              <El tag="button" onClick={() => go("carrocarias")}
                css="margin-top:auto;align-self:flex-start;background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#fff;padding:14px 24px;"
                hover="background:#B0151B;">Ver catálogo →</El>
            </div>
          </div>
          {/* drog */}
          <div style={s("background:#F4F4F2;color:#16161A;overflow:hidden;display:flex;flex-direction:column;border:1px solid #E4E4E0;")}>
            <div style={s("position:relative;height:240px;")}>
              <img src={images.homeAreaDrog} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
              <span style={s("position:absolute;top:18px;left:18px;background:#16161A;color:#fff;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:7px 12px;")}>Área 02</span>
            </div>
            <div style={s("padding:30px;display:flex;flex-direction:column;flex:1;")}>
              <h3 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:30px;margin:0 0 12px;")}>Drogaria</h3>
              <p style={s("font-family:'Barlow',sans-serif;font-size:16px;line-height:1.6;color:#55555E;margin:0 0 22px;")}>Tintas, ferragens, ferramentas, material elétrico e sanitário. Tudo o que precisa para a obra, a casa e a indústria.</p>
              <div style={s("display:flex;flex-wrap:wrap;gap:8px;margin-bottom:26px;")}>
                {["Tintas", "Ferragens", "Ferramentas", "Sanitários"].map((t) => (
                  <span key={t} style={s("border:1px solid #D6D6D0;color:#55555E;font-size:13px;padding:6px 11px;font-family:'Barlow',sans-serif;font-weight:500;")}>{t}</span>
                ))}
              </div>
              <El tag="button" onClick={() => go("drogaria")}
                css="margin-top:auto;align-self:flex-start;background:#16161A;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#fff;padding:14px 24px;"
                hover="background:#000;">Ver catálogo →</El>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={s("background:#E01E26;margin-top:60px;")}>
        <div style={s("max-width:1240px;margin:0 auto;padding:54px 32px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px;")}>
          {stats.map((st, i) => (
            <div key={i}>
              <div style={s("font-family:'Oswald',sans-serif;font-weight:700;font-size:52px;line-height:1;color:#fff;")}><StatValue value={st.value} /></div>
              <div style={s("font-family:'Barlow',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:13px;color:#FBD0D2;margin-top:8px;")}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE TEASER */}
      <section style={s("max-width:1240px;margin:0 auto;padding:96px 32px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:56px;align-items:center;")}>
        <div>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:14px;")}>A empresa</div>
          <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(30px,4vw,46px);line-height:1.02;margin:0 0 22px;color:#16161A;")}>Mãos na massa há mais de quatro décadas</h2>
          <p style={s("font-family:'Barlow',sans-serif;font-size:17px;line-height:1.65;color:#55555E;margin:0 0 18px;")}>{texts.aboutTeaser1}</p>
          <p style={s("font-family:'Barlow',sans-serif;font-size:17px;line-height:1.65;color:#55555E;margin:0 0 30px;")}>{texts.aboutTeaser2}</p>
          <El tag="button" onClick={() => go("sobre")}
            css="background:transparent;border:1px solid #16161A;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#16161A;padding:14px 26px;"
            hover="background:#16161A;color:#fff;">Conhecer a MAGOL</El>
        </div>
        <div style={s("position:relative;height:420px;")}>
          <iframe title="Localização MAGOL" src={mapSrc} style={s("position:absolute;inset:0;width:100%;height:100%;border:0;")} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
          <div style={s("position:absolute;bottom:-1px;left:-1px;background:#E01E26;color:#fff;padding:22px 26px;max-width:230px;pointer-events:none;")}>
            <div style={s("font-family:'Oswald',sans-serif;font-weight:700;font-size:22px;text-transform:uppercase;line-height:1;")}>Branca</div>
            <div style={s("font-family:'Barlow',sans-serif;font-size:14px;color:#FBD0D2;margin-top:6px;")}>Albergaria-a-Velha · Aveiro</div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={s("background:#0F0F11;")}>
        <div style={s("max-width:1240px;margin:0 auto;padding:70px 32px;display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap;")}>
          <div>
            <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(28px,3.5vw,42px);line-height:1.02;margin:0;color:#fff;")}>Tem um projeto? <span style={{ color: "#E01E26" }}>Falamos consigo.</span></h2>
            <p style={s("font-family:'Barlow',sans-serif;font-size:17px;color:#B6B6BD;margin:14px 0 0;")}>Fale connosco sobre a sua carroçaria ou o material que precisa.</p>
          </div>
          <El tag="button" onClick={() => go("contactos")}
            css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:16px;color:#fff;padding:18px 34px;"
            hover="background:#B0151B;">Contactar →</El>
        </div>
      </section>
    </main>
  );
}
