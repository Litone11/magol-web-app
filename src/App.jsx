import { useEffect, useState } from "react";
import Site from "./site/Site.jsx";
import Admin from "./admin/Admin.jsx";

function routeFromHash() {
  return window.location.hash.replace(/^#\/?/, "").startsWith("admin") ? "admin" : "site";
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash());

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return route === "admin" ? <Admin /> : <Site />;
}
