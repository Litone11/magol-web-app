import { El, s } from "../ui.jsx";

const STEPS = [
  ["01", "Levantamento", "Avaliamos o veículo e a sua necessidade de carga."],
  ["02", "Projeto", "Desenhamos a carroçaria à medida e orçamentamos."],
  ["03", "Fabrico", "Construímos na nossa oficina, com materiais de qualidade."],
  ["04", "Entrega", "Entregamos pronto a trabalhar, com acompanhamento."],
];

export default function Carrocarias({ content }) {
  return (
    <main>
      <section style={s("position:relative;background:#0F0F11;overflow:hidden;")}>
        <img src={content.images.carroHero} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
        <div style={s("position:absolute;inset:0;background:linear-gradient(95deg,rgba(15,15,17,.94) 0%,rgba(15,15,17,.80) 50%,rgba(15,15,17,.4) 100%);")}></div>
        <div style={s("position:relative;max-width:1240px;margin:0 auto;padding:84px 32px 90px;")}>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:14px;")}>Área 01 — Catálogo</div>
          <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;color:#fff;font-size:clamp(40px,6vw,76px);line-height:1.02;margin:0;")}>Carroçarias</h1>
          <p style={s("font-family:'Barlow',sans-serif;font-size:19px;line-height:1.55;color:#C7C7CC;max-width:56ch;margin:24px 0 0;")}>Fabricamos e reparamos a carroçaria certa para cada veículo de trabalho. Veja as soluções e fale connosco para saber mais.</p>
        </div>
        <div style={s("position:absolute;bottom:0;left:0;right:0;height:7px;background:repeating-linear-gradient(45deg,#E01E26 0 16px,#0F0F11 16px 32px);")}></div>
      </section>

      <section style={s("max-width:1240px;margin:0 auto;padding:72px 32px 90px;")}>
        <div style={s("display:grid;grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr));gap:24px;")}>
          {content.carrocarias.map((item) => (
            <El key={item.id || item.title} css="border:1px solid #E4E4E0;background:#fff;display:flex;flex-direction:column;overflow:hidden;" hover="border-color:#16161A;">
              <div style={s("position:relative;height:190px;background:#16161A;")}>
                <img src={item.image_url} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
                <span style={s("position:absolute;top:0;left:0;background:#E01E26;color:#fff;font-family:'Oswald',sans-serif;font-weight:700;font-size:15px;letter-spacing:.05em;padding:8px 13px;")}>{item.no}</span>
              </div>
              <div style={s("padding:24px;display:flex;flex-direction:column;flex:1;")}>
                <div style={s("font-family:'Barlow',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:11px;color:#E01E26;margin-bottom:8px;")}>{item.tag}</div>
                <h3 style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;font-size:23px;margin:0 0 10px;color:#16161A;line-height:1.05;")}>{item.title}</h3>
                <p style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.55;color:#55555E;margin:0;")}>{item.description}</p>
              </div>
            </El>
          ))}
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
    </main>
  );
}
