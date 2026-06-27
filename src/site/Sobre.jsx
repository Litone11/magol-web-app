import { El, s } from "../ui.jsx";

const VALORES = [
  ["✓", "Robustez", "Construímos para aguentar anos de trabalho duro, todos os dias."],
  ["⚒", "Feito à medida", "Cada cliente é diferente. Adaptamos a solução à sua atividade."],
  ["♦", "Proximidade", "Somos da terra. Conhecemos os nossos clientes pelo nome."],
];

export default function Sobre({ content, go }) {
  const { texts } = content;
  return (
    <main>
      <section style={s("background:#0F0F11;")}>
        <div style={s("max-width:1240px;margin:0 auto;padding:80px 32px;")}>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:14px;")}>A empresa</div>
          <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;color:#fff;font-size:clamp(36px,5.5vw,66px);line-height:1.06;margin:0;max-width:18ch;")}>Gente da Branca, a fazer trabalho que dura</h1>
        </div>
        <div style={s("height:7px;background:repeating-linear-gradient(45deg,#E01E26 0 16px,#0F0F11 16px 32px);")}></div>
      </section>

      <section style={s("max-width:1240px;margin:0 auto;padding:80px 32px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:56px;align-items:start;")}>
        <div>
          <p style={s("font-family:'Barlow',sans-serif;font-size:18px;line-height:1.7;color:#33333A;margin:0 0 20px;")}>{texts.aboutP1}</p>
          <p style={s("font-family:'Barlow',sans-serif;font-size:18px;line-height:1.7;color:#33333A;margin:0 0 20px;")}>{texts.aboutP2}</p>
          <p style={s("font-family:'Barlow',sans-serif;font-size:18px;line-height:1.7;color:#33333A;margin:0;")}>{texts.aboutP3}</p>
        </div>
        <div style={s("position:relative;height:440px;")}>
          <img src="https://loremflickr.com/720/880/factory,workshop,welding?lock=51" alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
        </div>
      </section>

      <section style={s("background:#F4F4F2;border-top:1px solid #E4E4E0;")}>
        <div style={s("max-width:1240px;margin:0 auto;padding:72px 32px;")}>
          <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(26px,3.5vw,40px);margin:0 0 40px;color:#16161A;")}>Os nossos valores</h2>
          <div style={s("display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px;")}>
            {VALORES.map(([icon, title, desc]) => (
              <div key={title} style={s("background:#fff;border:1px solid #E4E4E0;padding:30px;")}>
                <div style={s("width:46px;height:46px;background:#E01E26;display:grid;place-items:center;font-family:'Oswald',sans-serif;font-weight:700;color:#fff;font-size:22px;margin-bottom:18px;")}>{icon}</div>
                <h4 style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;font-size:20px;margin:0 0 10px;")}>{title}</h4>
                <p style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.6;color:#55555E;margin:0;")}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={s("background:#0F0F11;")}>
        <div style={s("max-width:1240px;margin:0 auto;padding:64px 32px;display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap;")}>
          <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(26px,3.5vw,40px);margin:0;color:#fff;")}>Venha conhecer-nos à Branca</h2>
          <El tag="button" onClick={() => go("contactos")}
            css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:#fff;padding:16px 30px;"
            hover="background:#B0151B;">Ver contactos →</El>
        </div>
      </section>
    </main>
  );
}
