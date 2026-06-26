import { El, s } from "../ui.jsx";

export default function Drogaria({ content, openQuote }) {
  return (
    <main>
      <section style={s("position:relative;background:#0F0F11;overflow:hidden;")}>
        <img src="https://loremflickr.com/1400/800/hardware,store,shelves?lock=13" alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
        <div style={s("position:absolute;inset:0;background:linear-gradient(95deg,rgba(15,15,17,.94) 0%,rgba(15,15,17,.80) 50%,rgba(15,15,17,.4) 100%);")}></div>
        <div style={s("position:relative;max-width:1240px;margin:0 auto;padding:84px 32px 90px;")}>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:14px;")}>Área 02 — Catálogo</div>
          <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;color:#fff;font-size:clamp(40px,6vw,76px);line-height:.95;margin:0;")}>Drogaria</h1>
          <p style={s("font-family:'Barlow',sans-serif;font-size:19px;line-height:1.55;color:#C7C7CC;max-width:56ch;margin:24px 0 0;")}>Tudo para a obra, a casa e a indústria. Veja as categorias e peça-nos disponibilidade e preço dos artigos que precisa.</p>
        </div>
        <div style={s("position:absolute;bottom:0;left:0;right:0;height:7px;background:repeating-linear-gradient(45deg,#E01E26 0 16px,#0F0F11 16px 32px);")}></div>
      </section>

      <section style={s("max-width:1240px;margin:0 auto;padding:72px 32px 90px;")}>
        <div style={s("display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:24px;")}>
          {content.drogaria.map((item) => (
            <El key={item.id || item.title} css="border:1px solid #E4E4E0;background:#fff;display:flex;flex-direction:column;overflow:hidden;" hover="border-color:#16161A;">
              <div style={s("position:relative;height:170px;background:#F4F4F2;")}>
                <img src={item.image_url} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
                <span style={s("position:absolute;top:14px;right:14px;background:#16161A;color:#fff;font-family:'Barlow',sans-serif;font-weight:600;font-size:12px;letter-spacing:.04em;padding:6px 11px;")}>{item.count_label}</span>
              </div>
              <div style={s("padding:24px;display:flex;flex-direction:column;flex:1;")}>
                <h3 style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;font-size:21px;margin:0 0 10px;color:#16161A;line-height:1.05;")}>{item.title}</h3>
                <p style={s("font-family:'Barlow',sans-serif;font-size:15px;line-height:1.55;color:#55555E;margin:0 0 22px;")}>{item.description}</p>
                <El tag="button" onClick={() => openQuote("Drogaria — " + item.title)}
                  css="margin-top:auto;align-self:flex-start;background:none;border:1px solid #16161A;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:13px;color:#16161A;padding:11px 18px;"
                  hover="background:#16161A;color:#fff;">Pedir disponibilidade</El>
              </div>
            </El>
          ))}
        </div>
        <div style={s("margin-top:44px;background:#0F0F11;color:#fff;padding:38px 36px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;")}>
          <div>
            <h3 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:26px;margin:0 0 8px;")}>Não encontra o que procura?</h3>
            <p style={s("font-family:'Barlow',sans-serif;font-size:16px;color:#B6B6BD;margin:0;")}>Temos muito mais em loja. Diga-nos o que precisa e nós verificamos.</p>
          </div>
          <El tag="button" onClick={() => openQuote("")}
            css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:#fff;padding:16px 28px;"
            hover="background:#B0151B;">Falar connosco →</El>
        </div>
      </section>
    </main>
  );
}
