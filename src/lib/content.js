import { supabase, isConfigured } from "./supabase.js";

// ------------------------------------------------------------------
//  Conteudo por omissao (modo demo + fallback se a BD estiver vazia).
//  Os mesmos valores estao no seed de supabase/schema.sql.
// ------------------------------------------------------------------
const CARRO_KW = ["flatbed,truck", "dump,truck", "van,truck", "truck,delivery", "trailer,truck", "excavator,transport", "metal,aluminium", "welding,workshop"];
const DROG_KW = ["paint,cans", "screws,bolts", "tools,workshop", "cables,plug", "bathroom,faucet", "cleaning,detergent", "safety,helmet", "garden,tools"];

export const DEFAULTS = {
  carrocarias: [
    { no: "01", title: "Caixas Abertas", tag: "Carga geral", description: "Plataformas e estrados com taipais para transporte de carga geral, materiais e paletes." },
    { no: "02", title: "Basculantes", tag: "Obra & agricultura", description: "Caixas basculantes traseiras e trilaterais, robustas para obra, entulho e agricultura." },
    { no: "03", title: "Furgões & Caixas Fechadas", tag: "Transporte protegido", description: "Estruturas fechadas em painel para mercadoria protegida das intempéries." },
    { no: "04", title: "Isotérmicas & Frigoríficas", tag: "Temperatura controlada", description: "Carroçarias isotérmicas para transporte a temperatura controlada de alimentos e fármacos." },
    { no: "05", title: "Reboques & Semi-reboques", tag: "Sob medida", description: "Fabrico e adaptação de reboques e semi-reboques à medida da sua atividade." },
    { no: "06", title: "Porta-Máquinas", tag: "Estrados rebaixados", description: "Plataformas rebaixadas com rampas para transporte de máquinas e equipamento pesado." },
    { no: "07", title: "Estruturas em Alumínio", tag: "Leve & resistente", description: "Taipais, gradeamentos e acessórios em alumínio que reduzem peso sem perder resistência." },
    { no: "08", title: "Reparação & Manutenção", tag: "Oficina", description: "Soldadura, chaparia e recuperação de carroçarias de todas as marcas." },
  ].map((it, i) => ({ ...it, pos: i + 1, image_url: `https://loremflickr.com/640/420/${CARRO_KW[i]}?lock=${31 + i}` })),

  drogaria: [
    { title: "Tintas & Vernizes", count_label: "+200 ref.", description: "Tintas, esmaltes, vernizes e tudo para pintura interior e exterior." },
    { title: "Ferragens & Fixações", count_label: "+500 artigos", description: "Parafusos, dobradiças, fechaduras e fixações para cada trabalho." },
    { title: "Ferramentas", count_label: "Manual & elétrica", description: "Ferramenta manual e elétrica das melhores marcas." },
    { title: "Material Elétrico", count_label: "Instalação", description: "Cabos, tomadas, iluminação e material de instalação elétrica." },
    { title: "Artigos Sanitários", count_label: "Casa de banho", description: "Loiças, torneiras, bases de duche e acessórios sanitários." },
    { title: "Limpeza & Químicos", count_label: "Profissional", description: "Produtos de limpeza, solventes e químicos para casa e indústria." },
    { title: "Proteção & EPI", count_label: "Segurança", description: "Luvas, calçado, capacetes e equipamento de proteção individual." },
    { title: "Jardim & Exterior", count_label: "Estação", description: "Ferramenta de jardim, mangueiras e artigos para o exterior." },
  ].map((it, i) => ({ ...it, pos: i + 1, image_url: `https://loremflickr.com/520/360/${DROG_KW[i]}?lock=${61 + i}` })),

  contacts: {
    address: "Rua da Indústria, 124\n3850-118 Branca · Albergaria-a-Velha\nAveiro, Portugal",
    phoneLandline: "+351 234 500 120",
    phoneMobile: "+351 912 000 340",
    email: "geral@magol.pt",
    hours: "Seg–Sex · 08:30–18:30\nSábado · 09:00–13:00",
  },

  stats: [
    { value: "40+", label: "Anos de experiência" },
    { value: "2", label: "Áreas de negócio" },
    { value: "1500+", label: "Clientes servidos" },
    { value: "100%", label: "Fabrico nacional" },
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

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

// Le todo o conteudo do site. Sem Supabase configurada -> devolve os defaults.
export async function loadContent() {
  if (!isConfigured) return clone(DEFAULTS);

  try {
    const [carro, drog, settings] = await Promise.all([
      supabase.from("carrocarias").select("*").order("pos", { ascending: true }),
      supabase.from("drogaria").select("*").order("pos", { ascending: true }),
      supabase.from("settings").select("*"),
    ]);

    const cfg = {};
    (settings.data || []).forEach((row) => { cfg[row.key] = row.value; });

    return {
      carrocarias: carro.data && carro.data.length ? carro.data : clone(DEFAULTS.carrocarias),
      drogaria: drog.data && drog.data.length ? drog.data : clone(DEFAULTS.drogaria),
      contacts: { ...DEFAULTS.contacts, ...(cfg.contacts || {}) },
      stats: Array.isArray(cfg.stats) && cfg.stats.length ? cfg.stats : clone(DEFAULTS.stats),
      texts: { ...DEFAULTS.texts, ...(cfg.texts || {}) },
    };
  } catch (err) {
    console.warn("Falha a carregar da Supabase, a usar defaults:", err);
    return clone(DEFAULTS);
  }
}
