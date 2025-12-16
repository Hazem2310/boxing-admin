import { useEffect, useState } from "react";
import { getToken, setToken } from "./api.js";
import Login from "./pages/Login.jsx";
import Shell from "./pages/Shell.jsx";
import { getLang, setLang, dirOf } from "./lib/i18n.js";

export default function App(){
  const [token, setTok] = useState(getToken());
  const [lang, setLangState] = useState(getLang());

  useEffect(()=>{
    document.documentElement.dir = dirOf(lang);
    document.documentElement.lang = lang === "ar" ? "ar" : "he";
    setLang(lang);
  }, [lang]);

  const logout = () => { setToken(""); setTok(""); };

  if(!token){
    return <Login onAuthed={(t)=>{ setToken(t); setTok(t); }} lang={lang} setLang={setLangState} />;
  }
  return <Shell onLogout={logout} lang={lang} setLang={setLangState} />;
}
