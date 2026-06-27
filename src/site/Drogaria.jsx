import { useMemo, useState } from "react";
import { El, s } from "../ui.jsx";
import { useIsMobile } from "../lib/useIsMobile.js";
import { brandLogo, normalizeTags, tagDef, PRODUCT_TAGS } from "../lib/content.js";
import Lightbox from "./Lightbox.jsx";

const FALLBACK_IMG = "https://loremflickr.com/600/600/hardware,tools?lock=200";

// Minúsculas e sem acentos, para a pesquisa ignorar maiúsculas/acentuação.
const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");
function norm(str) {
  return (str || "").toLowerCase().normalize("NFD").replace(DIACRITICS, "");
}

// Foto de capa de um produto: 1ª foto -> imagem da categoria -> fallback.
function coverOf(item, cats) {
  if (Array.isArray(item.images) && item.images[0]) return item.images[0];
  const cat = cats.find((c) => c.id === item.category_id);
  return (cat && cat.image_url) || FALLBACK_IMG;
}

// Selo da marca no canto do card: mini logo se existir, senao o nome em texto.
function BrandBadge({ name, logo }) {
  if (!name) return null;
  if (logo) {
    return (
      <span style={s("position:absolute;top:12px;left:12px;background:#fff;border:1px solid #E4E4E0;padding:4px 8px;display:flex;align-items:center;")}>
        <img src={logo} alt={name} title={name} style={s("max-height:18px;max-width:78px;object-fit:contain;display:block;")} />
      </span>
    );
  }
  return <span style={s("position:absolute;top:12px;left:12px;background:#16161A;color:#fff;font-family:'Barlow',sans-serif;font-weight:600;font-size:11px;letter-spacing:.04em;padding:5px 10px;")}>{name}</span>;
}

// Selos de destaque. "card" = empilhados no canto da foto; "detail" = chips na ficha.
function TagBadges({ tags, mode }) {
  const list = normalizeTags(tags).map(tagDef).filter(Boolean);
  if (!list.length) return null;
  if (mode === "card") {
    return (
      <span style={s("position:absolute;top:12px;right:12px;display:flex;flex-direction:column;gap:6px;align-items:flex-end;")}>
        {list.map((t) => (
          <span key={t.id} style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.04em;font-size:10px;padding:4px 8px;background:" + t.bg + ";color:" + t.fg + ";")}>{t.label}</span>
        ))}
      </span>
    );
  }
  return (
    <div style={s("display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;")}>
      {list.map((t) => (
        <span key={t.id} style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px;padding:7px 13px;background:" + t.bg + ";color:" + t.fg + ";")}>{t.label}</span>
      ))}
    </div>
  );
}

function FilterButton({ active, label, count, onClick }) {
  return (
    <button onClick={onClick} style={s(
      "display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:none;cursor:pointer;" +
      "font-family:'Barlow',sans-serif;font-size:15px;line-height:1.3;padding:9px 12px;" +
      "border-left:3px solid " + (active ? "#E01E26" : "transparent") + ";" +
      "color:" + (active ? "#16161A" : "#55555E") + ";font-weight:" + (active ? "700" : "500") + ";"
    )}>
      <span>{label}</span>
      <span style={s("font-family:'Barlow',sans-serif;font-size:12px;color:#9A9AA2;flex-shrink:0;")}>{count}</span>
    </button>
  );
}

function SectionTitle({ children }) {
  return <div style={s("font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.12em;font-size:12px;color:#9A9AA2;margin:0 0 8px 12px;")}>{children}</div>;
}

function Sidebar({ cats, items, scoped, brands, tagCounts, cat, brand, tag, onCat, onBrand, onTag, onClear }) {
  const hasFilter = cat !== "all" || brand !== "all" || tag !== "all";
  return (
    <aside style={s("width:100%;background:#fff;border:1px solid #E4E4E0;padding:18px 8px;")}>
      {tagCounts.length > 0 && (
        <div style={s("margin-bottom:22px;")}>
          <SectionTitle>Destaques</SectionTitle>
          {tagCounts.map(([id, n, label]) => (
            <FilterButton key={id} active={tag === id} label={label} count={n} onClick={() => onTag(id)} />
          ))}
        </div>
      )}

      <SectionTitle>Categorias</SectionTitle>
      <FilterButton active={cat === "all"} label="Todas as categorias" count={items.length} onClick={() => onCat("all")} />
      {cats.map((c) => (
        <FilterButton key={c.id} active={cat === c.id} label={c.title} count={items.filter((i) => i.category_id === c.id).length} onClick={() => onCat(c.id)} />
      ))}

      {brands.length > 0 && (
        <div style={s("margin-top:22px;")}>
          <SectionTitle>Marcas</SectionTitle>
          <FilterButton active={brand === "all"} label="Todas as marcas" count={scoped.length} onClick={() => onBrand("all")} />
          {brands.map(([b, n]) => (
            <FilterButton key={b} active={brand === b} label={b} count={n} onClick={() => onBrand(b)} />
          ))}
        </div>
      )}

      {hasFilter && (
        <div style={s("margin-top:22px;padding:0 12px;")}>
          <button onClick={onClear} style={s("background:none;border:none;cursor:pointer;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;font-size:12px;color:#E01E26;padding:0;")}>✕ Limpar filtros</button>
        </div>
      )}
    </aside>
  );
}

function MetaRow({ label, children, top }) {
  return (
    <div style={s("padding:14px 18px;background:#fff;" + (top ? "border-top:1px solid #E4E4E0;" : ""))}>
      <div style={s("font-family:'Barlow',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:11px;color:#E01E26;margin-bottom:4px;")}>{label}</div>
      <div style={s("font-family:'Barlow',sans-serif;font-size:16px;color:#16161A;")}>{children}</div>
    </div>
  );
}

function ProductDetail({ item, category, logo, onBack, go, isMobile }) {
  const imgs = Array.isArray(item.images) && item.images.length ? item.images : [FALLBACK_IMG];
  const [active, setActive] = useState(0);
  const [light, setLight] = useState(-1); // -1 = fechado
  const main = imgs[Math.min(active, imgs.length - 1)] || FALLBACK_IMG;

  return (
    <div>
      <button onClick={onBack} style={s("background:none;border:none;cursor:pointer;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;font-size:13px;color:#55555E;padding:0 0 22px;")}>← Voltar aos produtos</button>

      <div style={s(isMobile ? "display:block;" : "display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:start;")}>
        {/* GALERIA */}
        <div style={isMobile ? s("margin-bottom:28px;") : undefined}>
          <button onClick={() => setLight(Math.min(active, imgs.length - 1))} title="Ver maior" style={s("position:relative;width:100%;aspect-ratio:1/1;background:#F4F4F2;border:1px solid #E4E4E0;overflow:hidden;padding:0;cursor:zoom-in;display:block;")}>
            <img src={main} alt={item.title} style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
          </button>
          {imgs.length > 1 && (
            <div style={s("display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;")}>
              {imgs.map((u, i) => (
                <button key={i} onClick={() => setActive(i)} style={s("width:66px;height:66px;padding:0;cursor:pointer;background:#F4F4F2;overflow:hidden;border:2px solid " + (i === active ? "#E01E26" : "#E4E4E0") + ";")}>
                  <img src={u} alt="" style={s("width:100%;height:100%;object-fit:cover;display:block;")} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          {category && <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:12px;color:#E01E26;margin-bottom:12px;")}>{category.title}</div>}
          <TagBadges tags={item.tags} mode="detail" />
          <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(28px,4vw,44px);line-height:1.05;margin:0;color:#16161A;")}>{item.title}</h1>

          {(item.brand || item.reference) && (
            <div style={s("display:grid;gap:1px;border:1px solid #E4E4E0;margin:24px 0;background:#E4E4E0;")}>
              {item.brand ? (
                <MetaRow label="Marca">
                  <span style={s("display:inline-flex;align-items:center;gap:10px;")}>
                    {logo ? <img src={logo} alt={item.brand} style={s("max-height:28px;max-width:104px;object-fit:contain;display:block;")} /> : null}
                    <span>{item.brand}</span>
                  </span>
                </MetaRow>
              ) : null}
              {item.reference ? <MetaRow label="Referência(s)" top={Boolean(item.brand)}>{item.reference}</MetaRow> : null}
            </div>
          )}

          {item.description ? <p style={s("font-family:'Barlow',sans-serif;font-size:17px;line-height:1.7;color:#33333A;margin:24px 0 0;white-space:pre-line;")}>{item.description}</p> : null}

          <div style={s("margin-top:32px;")}>
            <El tag="button" onClick={() => go("contactos")}
              css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:#fff;padding:16px 28px;"
              hover="background:#B0151B;">Pedir informação →</El>
          </div>
        </div>
      </div>

      {light >= 0 && <Lightbox images={imgs} index={light} onClose={() => setLight(-1)} onIndex={setLight} />}
    </div>
  );
}

export default function Drogaria({ content, go }) {
  const isMobile = useIsMobile();
  const cats = content.drogaria || [];
  const items = content.drogariaItems || [];
  const brandList = content.brands || [];

  const [cat, setCat] = useState("all");
  const [brand, setBrand] = useState("all");
  const [tag, setTag] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const scoped = cat === "all" ? items : items.filter((i) => i.category_id === cat);

  const brands = useMemo(() => {
    const m = new Map();
    scoped.forEach((i) => {
      const b = (i.brand || "").trim();
      if (b) m.set(b, (m.get(b) || 0) + 1);
    });
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt"));
  }, [scoped]);

  // Destaques presentes na categoria atual, na ordem fixa de PRODUCT_TAGS.
  const tagCounts = useMemo(() => {
    const m = new Map();
    scoped.forEach((i) => normalizeTags(i.tags).forEach((t) => m.set(t, (m.get(t) || 0) + 1)));
    return PRODUCT_TAGS.filter((t) => m.has(t.id)).map((t) => [t.id, m.get(t.id), t.label]);
  }, [scoped]);

  // Pesquisa por título, marca, descrição e referência. Cada palavra tem de
  // aparecer algures (pesquisa "E"), ignorando maiúsculas e acentos.
  const terms = norm(query).trim().split(/\s+/).filter(Boolean);
  const matchesQuery = (i) => {
    if (!terms.length) return true;
    const hay = norm([i.title, i.brand, i.description, i.reference].join(" "));
    return terms.every((t) => hay.includes(t));
  };

  const visible = scoped.filter((i) =>
    (brand === "all" || (i.brand || "").trim() === brand) &&
    (tag === "all" || normalizeTags(i.tags).includes(tag)) &&
    matchesQuery(i)
  );

  const chooseCat = (id) => { setCat(id); setBrand("all"); setFiltersOpen(false); };
  const chooseBrand = (b) => { setBrand(b); setFiltersOpen(false); };
  const chooseTag = (t) => { setTag(t); setFiltersOpen(false); };
  const clearFilters = () => { setCat("all"); setBrand("all"); setTag("all"); setQuery(""); };
  const openItem = (it) => { setSelected(it); window.scrollTo(0, 0); };

  const selCat = cats.find((c) => c.id === cat);
  const selTag = tagDef(tag);
  const activeCount = (cat !== "all" ? 1 : 0) + (brand !== "all" ? 1 : 0) + (tag !== "all" ? 1 : 0) + (query.trim() ? 1 : 0);

  return (
    <main>
      {/* HERO */}
      <section style={s("position:relative;background:#0F0F11;overflow:hidden;")}>
        <img src={content.images.drogHero} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
        <div style={s("position:absolute;inset:0;background:linear-gradient(95deg,rgba(15,15,17,.94) 0%,rgba(15,15,17,.80) 50%,rgba(15,15,17,.4) 100%);")}></div>
        <div style={s("position:relative;max-width:1240px;margin:0 auto;padding:84px 32px 90px;")}>
          <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:14px;")}>Área 02 — Catálogo</div>
          <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;color:#fff;font-size:clamp(40px,6vw,76px);line-height:1.02;margin:0;")}>Drogaria</h1>
          <p style={s("font-family:'Barlow',sans-serif;font-size:19px;line-height:1.55;color:#C7C7CC;max-width:56ch;margin:24px 0 0;")}>Tudo para a obra, a casa e a indústria. Filtre por categoria e marca, e abra cada produto para ver fotos, referências e detalhes.</p>
        </div>
        <div style={s("position:absolute;bottom:0;left:0;right:0;height:7px;background:repeating-linear-gradient(45deg,#E01E26 0 16px,#0F0F11 16px 32px);")}></div>
      </section>

      <section style={s("max-width:1240px;margin:0 auto;padding:" + (isMobile ? "40px 20px 70px" : "64px 32px 90px") + ";")}>
        {selected ? (
          <ProductDetail key={selected.id} item={selected} category={cats.find((c) => c.id === selected.category_id)} logo={brandLogo(selected.brand, brandList)} onBack={() => setSelected(null)} go={go} isMobile={isMobile} />
        ) : (
          <>
            <div style={s(isMobile ? "display:block;" : "display:grid;grid-template-columns:262px 1fr;gap:36px;align-items:start;")}>
              {/* FILTROS */}
              {isMobile ? (
                <div style={s("margin-bottom:22px;")}>
                  <button onClick={() => setFiltersOpen((o) => !o)} style={s("width:100%;background:#16161A;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;")}>
                    <span>{filtersOpen ? "Ocultar filtros" : "Filtrar produtos"}</span>
                    <span>{activeCount ? "(" + activeCount + ") ▾" : "▾"}</span>
                  </button>
                  {filtersOpen && (
                    <div style={s("margin-top:12px;")}>
                      <Sidebar cats={cats} items={items} scoped={scoped} brands={brands} tagCounts={tagCounts} cat={cat} brand={brand} tag={tag} onCat={chooseCat} onBrand={chooseBrand} onTag={chooseTag} onClear={clearFilters} />
                    </div>
                  )}
                </div>
              ) : (
                <Sidebar cats={cats} items={items} scoped={scoped} brands={brands} tagCounts={tagCounts} cat={cat} brand={brand} tag={tag} onCat={chooseCat} onBrand={chooseBrand} onTag={chooseTag} onClear={clearFilters} />
              )}

              {/* PRODUTOS */}
              <div>
                {/* PESQUISA */}
                <div style={s("position:relative;margin-bottom:24px;")}>
                  <span style={s("position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:16px;color:#9A9AA2;pointer-events:none;")}>⌕</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pesquisar por nome, marca, descrição ou referência…"
                    style={s("width:100%;box-sizing:border-box;border:1px solid #D6D6D0;background:#fff;font-family:'Barlow',sans-serif;font-size:16px;color:#16161A;padding:14px 44px;outline:none;")}
                  />
                  {query ? <button onClick={() => setQuery("")} aria-label="Limpar pesquisa" style={s("position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:18px;color:#9A9AA2;line-height:1;padding:4px;")}>✕</button> : null}
                </div>

                <div style={s("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:26px;")}>
                  <div>
                    <h2 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(24px,3.2vw,34px);line-height:1.05;margin:0;color:#16161A;")}>{query.trim() ? "Resultados" : (selCat ? selCat.title : (selTag ? selTag.label : "Todos os produtos"))}</h2>
                    {!query.trim() && selCat && selCat.description ? <p style={s("font-family:'Barlow',sans-serif;font-size:16px;line-height:1.55;color:#55555E;margin:8px 0 0;max-width:56ch;")}>{selCat.description}</p> : null}
                  </div>
                  <span style={s("font-family:'Barlow',sans-serif;font-size:14px;color:#8A8A92;white-space:nowrap;")}>{visible.length} {visible.length === 1 ? "produto" : "produtos"}</span>
                </div>

                {visible.length === 0 ? (
                  <div style={s("border:1px dashed #D6D6D0;background:#F4F4F2;padding:48px 24px;text-align:center;")}>
                    <p style={s("font-family:'Barlow',sans-serif;font-size:16px;color:#55555E;margin:0 0 14px;")}>{query.trim() ? "Nenhum produto corresponde à pesquisa." : "Não há produtos para este filtro."}</p>
                    <button onClick={clearFilters} style={s("background:none;border:1px solid #16161A;cursor:pointer;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;font-size:13px;color:#16161A;padding:11px 20px;")}>Limpar filtros</button>
                  </div>
                ) : (
                  <div style={s("display:grid;grid-template-columns:repeat(auto-fill,minmax(min(230px,100%),1fr));gap:22px;")}>
                    {visible.map((item) => (
                      <El key={item.id} onClick={() => openItem(item)} role="button" tabIndex={0}
                        css="border:1px solid #E4E4E0;background:#fff;display:flex;flex-direction:column;overflow:hidden;cursor:pointer;"
                        hover="border-color:#16161A;">
                        <div style={s("position:relative;height:190px;background:#F4F4F2;")}>
                          <img src={coverOf(item, cats)} alt="" style={s("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
                          <BrandBadge name={item.brand} logo={brandLogo(item.brand, brandList)} />
                          <TagBadges tags={item.tags} mode="card" />
                          {Array.isArray(item.images) && item.images.length > 1 ? <span style={s("position:absolute;bottom:12px;right:12px;background:rgba(15,15,17,.78);color:#fff;font-family:'Barlow',sans-serif;font-size:11px;padding:4px 9px;")}>{item.images.length} fotos</span> : null}
                        </div>
                        <div style={s("padding:18px 18px 20px;display:flex;flex-direction:column;flex:1;")}>
                          <h3 style={s("font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;font-size:18px;margin:0 0 6px;color:#16161A;line-height:1.1;")}>{item.title}</h3>
                          {item.reference ? <div style={s("font-family:'Barlow',sans-serif;font-size:12px;color:#9A9AA2;margin-bottom:8px;")}>Ref: {item.reference}</div> : null}
                          {item.description ? <p style={s("font-family:'Barlow',sans-serif;font-size:14px;line-height:1.5;color:#55555E;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;")}>{item.description}</p> : null}
                          <span style={s("margin-top:auto;padding-top:14px;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:#E01E26;")}>Ver produto →</span>
                        </div>
                      </El>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div style={s("margin-top:50px;background:#0F0F11;color:#fff;padding:38px 36px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;")}>
              <div>
                <h3 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:26px;margin:0 0 8px;")}>Não encontra o que procura?</h3>
                <p style={s("font-family:'Barlow',sans-serif;font-size:16px;color:#B6B6BD;margin:0;")}>Temos muito mais em loja. Diga-nos o que precisa e nós verificamos.</p>
              </div>
              <El tag="button" onClick={() => go("contactos")}
                css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:#fff;padding:16px 28px;"
                hover="background:#B0151B;">Falar connosco →</El>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
