import { useEffect, useState } from "react";
import { loadContent } from "../lib/content.js";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import QuoteModal from "./QuoteModal.jsx";
import Home from "./Home.jsx";
import Carrocarias from "./Carrocarias.jsx";
import Drogaria from "./Drogaria.jsx";
import Sobre from "./Sobre.jsx";
import Contactos from "./Contactos.jsx";

const PAGES = { home: Home, carrocarias: Carrocarias, drogaria: Drogaria, sobre: Sobre, contactos: Contactos };

export default function Site() {
  const [content, setContent] = useState(null);
  const [page, setPage] = useState("home");
  const [quote, setQuote] = useState({ open: false, subject: "" });

  useEffect(() => { loadContent().then(setContent); }, []);

  const go = (p) => { setPage(p); setQuote({ open: false, subject: "" }); window.scrollTo(0, 0); };
  const openQuote = (subject) => setQuote({ open: true, subject: subject || "" });
  const closeQuote = () => setQuote((q) => ({ ...q, open: false }));

  if (!content) return <div style={{ minHeight: "100vh", background: "#0F0F11" }} />;

  const Page = PAGES[page] || Home;

  return (
    <>
      <Nav page={page} go={go} openQuote={openQuote} />
      <Page content={content} go={go} openQuote={openQuote} />
      <Footer contacts={content.contacts} go={go} />
      <QuoteModal open={quote.open} subject={quote.subject} onClose={closeQuote} />
    </>
  );
}
