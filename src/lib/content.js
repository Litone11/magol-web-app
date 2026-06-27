import { supabase, isConfigured } from "./supabase.js";

// ------------------------------------------------------------------
//  Conteudo por omissao (modo demo + fallback se a BD estiver vazia).
//  Os mesmos valores estao no seed de supabase/schema.sql.
// ------------------------------------------------------------------
const CARRO_KW = ["flatbed,truck", "dump,truck", "van,truck", "truck,delivery", "trailer,truck", "excavator,transport", "metal,aluminium", "welding,workshop"];
const DROG_KW = ["paint,cans", "screws,bolts", "tools,workshop", "cables,plug", "bathroom,faucet", "cleaning,detergent", "safety,helmet", "garden,tools"];
// Slugs estaveis das categorias (modo demo). Na BD as categorias tem id uuid.
const DROG_SLUGS = ["tintas", "ferragens", "ferramentas", "eletrico", "sanitarios", "limpeza", "epi", "jardim"];

// Destaques que um produto pode ter (varios em simultaneo). Aparecem como selo
// no card e na pagina do produto, e podem ser usados como filtro na Drogaria.
// Geridos por produto no painel -> "Drogaria · produtos".
export const PRODUCT_TAGS = [
  { id: "promo", label: "Promoção", bg: "#E01E26", fg: "#fff" },
  { id: "semana", label: "Produto da semana", bg: "#16161A", fg: "#fff" },
  { id: "top", label: "Mais comprado", bg: "#C8961E", fg: "#16161A" },
];

export const DEFAULTS = {
  carrocarias: [
    { title: "Caixas Abertas", tag: "Carga geral", description: "Plataformas e estrados com taipais para transporte de carga geral, materiais e paletes." },
    { title: "Basculantes", tag: "Obra & agricultura", description: "Caixas basculantes traseiras e trilaterais, robustas para obra, entulho e agricultura." },
    { title: "Furgões & Caixas Fechadas", tag: "Transporte protegido", description: "Estruturas fechadas em painel para mercadoria protegida das intempéries." },
    { title: "Isotérmicas & Frigoríficas", tag: "Temperatura controlada", description: "Carroçarias isotérmicas para transporte a temperatura controlada de alimentos e fármacos." },
    { title: "Reboques & Semi-reboques", tag: "Sob medida", description: "Fabrico e adaptação de reboques e semi-reboques à medida da sua atividade." },
    { title: "Porta-Máquinas", tag: "Estrados rebaixados", description: "Plataformas rebaixadas com rampas para transporte de máquinas e equipamento pesado." },
    { title: "Estruturas em Alumínio", tag: "Leve & resistente", description: "Taipais, gradeamentos e acessórios em alumínio que reduzem peso sem perder resistência." },
    { title: "Reparação & Manutenção", tag: "Oficina", description: "Soldadura, chaparia e recuperação de carroçarias de todas as marcas." },
  ].map((it, i) => ({ ...it, pos: i + 1, image_url: `https://loremflickr.com/640/420/${CARRO_KW[i]}?lock=${31 + i}`, images: Array.from({ length: 6 }, (_, j) => `https://loremflickr.com/800/600/${CARRO_KW[i]}?lock=${300 + i * 10 + j}`) })),

  drogaria: [
    { title: "Tintas & Vernizes", count_label: "+200 ref.", description: "Tintas, esmaltes, vernizes e tudo para pintura interior e exterior." },
    { title: "Ferragens & Fixações", count_label: "+500 artigos", description: "Parafusos, dobradiças, fechaduras e fixações para cada trabalho." },
    { title: "Ferramentas", count_label: "Manual & elétrica", description: "Ferramenta manual e elétrica das melhores marcas." },
    { title: "Material Elétrico", count_label: "Instalação", description: "Cabos, tomadas, iluminação e material de instalação elétrica." },
    { title: "Artigos Sanitários", count_label: "Casa de banho", description: "Loiças, torneiras, bases de duche e acessórios sanitários." },
    { title: "Limpeza & Químicos", count_label: "Profissional", description: "Produtos de limpeza, solventes e químicos para casa e indústria." },
    { title: "Proteção & EPI", count_label: "Segurança", description: "Luvas, calçado, capacetes e equipamento de proteção individual." },
    { title: "Jardim & Exterior", count_label: "Estação", description: "Ferramenta de jardim, mangueiras e artigos para o exterior." },
  ].map((it, i) => ({ ...it, id: DROG_SLUGS[i], pos: i + 1, image_url: `https://loremflickr.com/520/360/${DROG_KW[i]}?lock=${61 + i}` })),

  // Produtos da drogaria (modo demo). category_id liga aos slugs acima.
  drogariaItems: [
    { category_id: "tintas", title: "Tinta Plástica Mate Branco 15L", brand: "CIN", reference: "CIN-PM-15B", description: "Tinta plástica de interior, acabamento mate, alto rendimento e fácil aplicação.", images: ["https://loremflickr.com/600/600/paint,white,wall?lock=101", "https://loremflickr.com/600/600/paint,roller?lock=102"], tags: ["promo"] },
    { category_id: "tintas", title: "Esmalte Aquoso Acetinado 0,75L", brand: "Robbialac", reference: "RB-EA-075", description: "Esmalte aquoso para madeiras e metais, secagem rápida e baixo odor.", images: ["https://loremflickr.com/600/600/paint,can?lock=103"] },
    { category_id: "tintas", title: "Verniz Marítimo Acetinado 1L", brand: "CIN", reference: "CIN-VM-1", description: "Verniz de alta proteção para exteriores, resistente aos raios UV e à humidade.", images: ["https://loremflickr.com/600/600/varnish,wood?lock=104"] },
    { category_id: "ferragens", title: "Caixa de Parafusos Sortidos 600 pç", brand: "", reference: "FX-PAR-600", description: "Sortido de parafusos para madeira e aglomerado em várias medidas, com caixa organizadora.", images: ["https://loremflickr.com/600/600/screws,bolts?lock=105"] },
    { category_id: "ferragens", title: "Dobradiça Inox 100mm (par)", brand: "", reference: "FX-DOB-100", description: "Dobradiça reforçada em aço inox para portas e portões, par com parafusos.", images: ["https://loremflickr.com/600/600/hinge,metal?lock=106"] },
    { category_id: "ferramentas", title: "Berbequim com Percussão 750W", brand: "Bosch", reference: "BO-BP-750", description: "Berbequim de percussão com mandril de 13mm, velocidade variável e reversível.", images: ["https://loremflickr.com/600/600/drill,tool?lock=107", "https://loremflickr.com/600/600/power,drill?lock=108"], tags: ["semana", "top"] },
    { category_id: "ferramentas", title: "Rebarbadora 125mm 900W", brand: "Makita", reference: "MK-REB-125", description: "Rebarbadora angular compacta para corte e desbaste, com proteção de disco.", images: ["https://loremflickr.com/600/600/grinder,tool?lock=109"], tags: ["top"] },
    { category_id: "ferramentas", title: "Jogo de Chaves de Fendas 6 pç", brand: "Bosch", reference: "BO-CF-6", description: "Conjunto de chaves de fendas plana e Phillips com punho ergonómico antiderrapante.", images: ["https://loremflickr.com/600/600/screwdriver,set?lock=110"] },
    { category_id: "eletrico", title: "Cabo Flexível H07V-K 2,5mm² (100m)", brand: "Legrand", reference: "EL-CABO-25", description: "Cabo flexível para instalações elétricas, isolamento PVC, rolo de 100 metros.", images: ["https://loremflickr.com/600/600/electric,cable?lock=111"] },
    { category_id: "eletrico", title: "Tomada Schuko Branca", brand: "Legrand", reference: "EL-TOM-SK", description: "Tomada de encastrar com terra lateral, acabamento branco, série moderna.", images: ["https://loremflickr.com/600/600/power,socket?lock=112"] },
    { category_id: "sanitarios", title: "Torneira Misturadora de Lavatório", brand: "Roca", reference: "SAN-MIST-LV", description: "Misturadora monocomando para lavatório, acabamento cromado, arejador incluído.", images: ["https://loremflickr.com/600/600/faucet,tap?lock=113"] },
    { category_id: "limpeza", title: "Diluente Universal 5L", brand: "", reference: "LMP-DIL-5", description: "Diluente universal para limpeza de ferramentas e diluição de tintas e esmaltes.", images: ["https://loremflickr.com/600/600/solvent,can?lock=114"] },
  ].map((it, i) => ({ ...it, id: `item-${i + 1}`, pos: i + 1, tags: it.tags || [] })),

  contacts: {
    address: "Rua da Indústria, 124\n3850-118 Branca · Albergaria-a-Velha\nAveiro, Portugal",
    phoneLandline: "+351 234 500 120",
    phoneMobile: "+351 912 000 340",
    email: "geral@magol.pt",
    hours: "Seg–Sex · 08:30–18:30\nSábado · 09:00–13:00",
    map: "40.758741, -8.484115",
  },

  stats: [
    { value: "40+", label: "Anos de experiência" },
    { value: "2", label: "Áreas de negócio" },
    { value: "1500+", label: "Clientes servidos" },
    { value: "100%", label: "Fabrico nacional" },
  ],

  // Imagens "fixas" do site (fundos de topo, cartoes da pagina inicial,
  // foto da pagina Empresa). Editaveis no painel -> separador "Imagens".
  images: {
    homeHero: "https://loremflickr.com/1600/900/truck,workshop,welding?lock=10",
    homeAreaCarro: "https://loremflickr.com/700/520/lorry,truck?lock=21",
    homeAreaDrog: "https://loremflickr.com/700/520/paint,hardware,store?lock=22",
    carroHero: "https://loremflickr.com/1400/800/truck,factory?lock=12",
    drogHero: "https://loremflickr.com/1400/800/hardware,store,shelves?lock=13",
    sobrePhoto: "https://loremflickr.com/720/880/factory,workshop,welding?lock=51",
  },

  // Marcas da drogaria: nome + logo (mini imagem). Geridas no painel.
  brands: [
    { name: "Bosch", logo: "" },
    { name: "CIN", logo: "" },
    { name: "Legrand", logo: "" },
    { name: "Makita", logo: "" },
    { name: "Robbialac", logo: "" },
    { name: "Roca", logo: "" },
  ],

  texts: {
    heroPre: "Branca · Aveiro · desde 1985",
    heroTitle: "Carroçarias feitas para o trabalho",
    heroAccent: " a sério.",
    heroSub: "Fabrico, reparação e equipamento para o seu veículo de trabalho — e uma drogaria completa para a obra, a casa e a indústria. Tudo na Branca, Aveiro.",
    aboutTeaser1: "A MAGOL nasceu na Branca, em Albergaria-a-Velha, a construir carroçarias para quem vive do transporte. Com o tempo abrimos a drogaria, para que o cliente encontrasse no mesmo sítio o material para acabar o trabalho.",
    aboutTeaser2: "Trabalho honesto, feito por gente da terra, com a robustez que o dia a dia exige.",
    aboutP1: "A MAGOL começou como uma oficina de carroçarias na Branca, em Albergaria-a-Velha, Aveiro. Ao longo de mais de quarenta anos construímos caixas, basculantes e reboques para quem faz da estrada o seu ganha-pão.",
    aboutP2: "Com a confiança dos clientes, abrimos também a drogaria — para que encontrassem no mesmo sítio as tintas, ferragens e ferramentas que faltavam para terminar cada trabalho.",
    aboutP3: "Hoje somos as duas coisas: a oficina que fabrica e a loja que abastece. Continuamos com a mesma ideia simples — trabalho honesto, robusto e bem feito.",
  },
};

// Campos de texto editaveis no painel (chave -> rotulo amigavel).
export const TEXT_FIELDS = [
  ["heroPre", "Início · etiqueta do hero"],
  ["heroTitle", "Início · título do hero"],
  ["heroAccent", "Início · título (parte a vermelho)"],
  ["heroSub", "Início · subtítulo do hero"],
  ["aboutTeaser1", "Início · sobre — parágrafo 1"],
  ["aboutTeaser2", "Início · sobre — parágrafo 2"],
  ["aboutP1", "Empresa · parágrafo 1"],
  ["aboutP2", "Empresa · parágrafo 2"],
  ["aboutP3", "Empresa · parágrafo 3"],
];

// Imagens "fixas" editaveis no painel (chave -> rotulo amigavel).
export const IMAGE_FIELDS = [
  ["homeHero", "Início · imagem de fundo (topo)"],
  ["homeAreaCarro", "Início · cartão Carroçarias"],
  ["homeAreaDrog", "Início · cartão Drogaria"],
  ["carroHero", "Carroçarias · imagem de fundo (topo)"],
  ["drogHero", "Drogaria · imagem de fundo (topo)"],
  ["sobrePhoto", "Empresa · foto principal"],
];

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

// Normaliza a lista de marcas: aceita strings antigas ("Bosch") ou objetos
// ({name, logo}). Devolve sempre [{ name, logo }] sem nomes vazios.
export function normalizeBrands(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((b) =>
      typeof b === "string"
        ? { name: b.trim(), logo: "" }
        : { name: (b && b.name ? String(b.name) : "").trim(), logo: (b && b.logo ? String(b.logo) : "").trim() }
    )
    .filter((b) => b.name);
}

// Normaliza os destaques de um produto: mantem so ids conhecidos, sem repetir.
export function normalizeTags(value) {
  if (!Array.isArray(value)) return [];
  const known = new Set(PRODUCT_TAGS.map((t) => t.id));
  const out = [];
  value.forEach((t) => { const id = String(t); if (known.has(id) && !out.includes(id)) out.push(id); });
  return out;
}

// Definicao (rotulo + cores) de um destaque pelo id, ou null.
export function tagDef(id) {
  return PRODUCT_TAGS.find((t) => t.id === id) || null;
}

// Devolve o logo de uma marca (por nome), ou "" se nao houver.
export function brandLogo(name, brands) {
  const n = (name || "").trim().toLowerCase();
  if (!n) return "";
  const b = (brands || []).find((x) => (x.name || "").trim().toLowerCase() === n);
  return (b && b.logo) || "";
}

// Junta as imagens guardadas com as por omissao: campo vazio -> volta ao default,
// para o site nunca ficar com uma foto em branco.
export function withImageDefaults(images) {
  const raw = images || {};
  const out = {};
  for (const k of Object.keys(DEFAULTS.images)) {
    const v = raw[k];
    out[k] = typeof v === "string" && v.trim() ? v : DEFAULTS.images[k];
  }
  return out;
}

// Le todo o conteudo do site. Sem Supabase configurada -> devolve os defaults.
export async function loadContent() {
  if (!isConfigured) return clone(DEFAULTS);

  try {
    const [carro, drog, items, settings] = await Promise.all([
      supabase.from("carrocarias").select("*").order("pos", { ascending: true }),
      supabase.from("drogaria").select("*").order("pos", { ascending: true }),
      supabase.from("drogaria_items").select("*").order("pos", { ascending: true }),
      supabase.from("settings").select("*"),
    ]);

    const cfg = {};
    (settings.data || []).forEach((row) => { cfg[row.key] = row.value; });

    return {
      carrocarias: (carro.data && carro.data.length ? carro.data : clone(DEFAULTS.carrocarias)).map((it) => ({ ...it, images: Array.isArray(it.images) ? it.images : [] })),
      drogaria: drog.data && drog.data.length ? drog.data : clone(DEFAULTS.drogaria),
      drogariaItems: (items.data || []).map((it) => ({ ...it, images: Array.isArray(it.images) ? it.images : [], tags: normalizeTags(it.tags) })),
      contacts: { ...DEFAULTS.contacts, ...(cfg.contacts || {}) },
      stats: Array.isArray(cfg.stats) && cfg.stats.length ? cfg.stats : clone(DEFAULTS.stats),
      texts: { ...DEFAULTS.texts, ...(cfg.texts || {}) },
      images: withImageDefaults(cfg.images),
      brands: normalizeBrands(cfg.brands),
    };
  } catch (err) {
    console.warn("Falha a carregar da Supabase, a usar defaults:", err);
    return clone(DEFAULTS);
  }
}
