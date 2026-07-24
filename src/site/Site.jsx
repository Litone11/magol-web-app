import { useEffect, useState } from "react";
import { loadContent } from "../lib/content.js";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import Home from "./Home.jsx";
import Carrocarias from "./Carrocarias.jsx";
import Drogaria from "./Drogaria.jsx";
import Sobre from "./Sobre.jsx";
import Contactos from "./Contactos.jsx";
import Legal from "./Legal.jsx";

const PAGES = { home: Home, carrocarias: Carrocarias, drogaria: Drogaria, sobre: Sobre, contactos: Contactos };

export default function Site() {
  const [content, setContent] = useState(null);
  const [page, setPage] = useState("home");

  useEffect(() => { loadContent().then(setContent); }, []);

  const go = (p) => { setPage(p); window.scrollTo(0, 0); };

  if (!content) return <div style={{ minHeight: "100vh", background: "#0F0F11" }} />;

  const Page = PAGES[page] || (page === "privacidade" || page === "cookies" || page === "termos" ? Legal : Home);

  return (
    <>
      <Nav page={page} go={go} />
      <Page content={content} go={go} type={page} />
      <Footer contacts={content.contacts} go={go} />
    </>
  );
}
