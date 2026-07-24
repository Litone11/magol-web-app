import { El, s } from "../ui.jsx";

const DOCUMENTS = {
  privacidade: {
    title: "Política de Privacidade",
    sections: [
      ["1. Informações Gerais", "A presente Política de Privacidade regula o tratamento de dados pessoais recolhidos através do website da MAGOL – Leonel & Filhos, Lda., com sede em Rua Fonte da Lameira, 5, 3850-571 Branca, titular do NIF 500 855 897, doravante designada por Empresa.", "A Empresa garante o respeito pela privacidade dos utilizadores e o cumprimento das obrigações legais decorrentes do Regulamento Geral sobre a Proteção de Dados (RGPD) e demais legislação nacional aplicável."],
      ["2. Dados Recolhidos e Finalidades", "O website recolhe apenas os dados estritamente necessários para responder aos pedidos de contacto e esclarecimento: nome, endereço de email, telefone e a mensagem enviada."],
      ["3. Base Legal para o Tratamento", "O tratamento dos dados baseia-se no consentimento expresso, prestado ao submeter o formulário de contacto após assinalar a respetiva caixa de aceitação. O utilizador pode retirar o consentimento a qualquer momento, sem comprometer a licitude do tratamento efetuado até essa data."],
      ["4. Destinatários dos Dados", "Os dados pessoais recolhidos destinam-se exclusivamente ao uso interno da Empresa. Não partilhamos, vendemos ou cedemos os seus dados a terceiros, exceto por cumprimento de obrigações legais."],
      ["5. Prazo de Conservação dos Dados", "Os dados pessoais são conservados apenas durante o período necessário para a resolução definitiva do pedido de contacto ou esclarecimento, sendo eliminados de forma segura após a sua conclusão."],
      ["6. Direitos do Utilizador", "Nos termos do RGPD, pode solicitar o acesso, a retificação, o apagamento, a limitação do tratamento ou a oposição ao tratamento dos seus dados pessoais. Para exercer estes direitos, envie um pedido por escrito para geral@magol.pt. Pode ainda apresentar uma reclamação à Comissão Nacional de Proteção de Dados (CNPD)."],
      ["7. Segurança dos Dados", "A Empresa adota medidas técnicas e organizativas adequadas para proteger os dados pessoais contra destruição acidental ou ilícita, perda, alteração, difusão ou acesso não autorizado."],
      ["8. Atualizações", "Esta política pode ser atualizada periodicamente. A versão publicada no website estará sempre atualizada."]
    ]
  },
  cookies: {
    title: "Política de Cookies",
    sections: [
      ["1. O que são Cookies?", "Cookies são pequenos ficheiros de texto armazenados no computador ou dispositivo móvel pelo navegador quando visita um website. Permitem que o site se lembre das suas ações e preferências durante um determinado período."],
      ["2. Que Cookies utilizamos?", "Este website utiliza exclusivamente cookies estritamente necessários (técnicos), indispensáveis ao correto funcionamento do website e à navegação segura. Por serem essenciais à prestação do serviço solicitado, não requerem consentimento prévio.", "A sua finalidade é garantir a estabilidade da página, a segurança do formulário de contacto e o carregamento correto dos conteúdos. Não utilizamos cookies de publicidade, marketing, rastreio comportamental ou análise estatística de terceiros."],
      ["3. Como gerir ou desativar os Cookies?", "Pode configurar o seu navegador para bloquear ou alertar sobre estes cookies. No entanto, o bloqueio total pode fazer com que algumas partes do website não funcionem corretamente."],
      ["4. Atualizações", "A MAGOL – Leonel & Filhos, Lda. reserva-se o direito de alterar esta Política de Cookies sempre que introduzir novas funcionalidades ou ferramentas. Qualquer alteração será publicada nesta página."]
    ]
  },
  termos: {
    title: "Termos e Condições de Utilização",
    sections: [
      ["1. Âmbito e Identificação do Titular", "Os presentes Termos e Condições regulam o acesso e a utilização do website www.magol.pt, propriedade da MAGOL – Leonel & Filhos, Lda., com sede em Rua Fonte da Lameira, 5 – 3850-571 Branca, titular do NIF 500 855 897.", "Ao navegar neste website, o utilizador aceita integralmente os presentes Termos e Condições. Se não concordar com alguma das regras, não deverá utilizar o website."],
      ["2. Natureza da Informação e Isenção de Responsabilidade", "Este website tem caráter institucional e informativo. A Empresa desenvolve os melhores esforços para manter a informação correta e atualizada, mas não se responsabiliza por erros, omissões, desatualizações temporárias ou interrupções de acesso alheias ao seu controlo."],
      ["3. Propriedade Intelectual", "Todos os conteúdos deste website, incluindo textos, imagens, logótipos, gráficos, marcas, fotografias e design, são propriedade exclusiva da Empresa ou dos seus licenciadores e estão protegidos por lei. É proibida a sua cópia, reprodução, modificação, distribuição ou republicação para fins comerciais sem autorização prévia e escrita."],
      ["4. Links para Terceiros", "O website pode conter ligações para páginas externas geridas por terceiros. A Empresa não exerce controlo sobre os respetivos conteúdos, políticas de privacidade ou práticas e declina qualquer responsabilidade pelos mesmos."],
      ["5. Utilização Aceitável", "O utilizador obriga-se a utilizar o website de forma lícita, ética e correta. É proibido utilizar o formulário de contacto para enviar publicidade não solicitada, introduzir vírus ou programas maliciosos, ou realizar ataques informáticos."],
      ["6. Lei Aplicável e Foro Competente", "Aos litígios emergentes da utilização deste website ou da interpretação destes Termos e Condições aplica-se a lei portuguesa, sendo competente o foro da comarca da sede da Empresa."]
    ]
  }
};

export default function Legal({ type, go }) {
  const document = DOCUMENTS[type] || DOCUMENTS.privacidade;

  return <main style={s("background:#F4F4F2;min-height:70vh;")}>
    <section style={s("background:#0F0F11;")}><div style={s("max-width:900px;margin:0 auto;padding:74px 32px 70px;")}>
      <div style={s("font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.2em;font-size:13px;color:#E01E26;margin-bottom:14px;")}>Informação legal</div>
      <h1 style={s("font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;color:#fff;font-size:clamp(38px,5.5vw,60px);line-height:1.05;margin:0;")}>{document.title}</h1>
    </div></section>
    <section style={s("max-width:900px;margin:0 auto;padding:58px 32px 76px;")}>
      <div style={s("display:grid;gap:34px;")}>{document.sections.map(([heading, ...paragraphs]) => <article key={heading}>
        <h2 style={s("font-family:'Oswald',sans-serif;font-size:24px;text-transform:uppercase;letter-spacing:.02em;color:#16161A;margin:0 0 12px;")}>{heading}</h2>
        {paragraphs.map((paragraph) => <p key={paragraph} style={s("font-family:'Barlow',sans-serif;font-size:16px;line-height:1.7;color:#44444B;margin:0 0 12px;")}>{paragraph}</p>)}
      </article>)}</div>
      <p style={s("font-family:'Barlow',sans-serif;font-size:14px;color:#777780;margin:46px 0 24px;")}>Última atualização: 17 de julho de 2026.</p>
      <El tag="button" onClick={() => go("home")} css="background:#E01E26;border:none;cursor:pointer;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:14px;color:#fff;padding:13px 22px;" hover="background:#B0151B;">Voltar ao início</El>
    </section>
  </main>;
}
