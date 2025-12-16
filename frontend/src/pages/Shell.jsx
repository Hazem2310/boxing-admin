import { useState } from "react";
import Topbar from "../ui/Topbar.jsx";
import Home from "./home/Home.jsx";
import Exercises from "./exercises/Exercises.jsx";
import Members from "./members/Members.jsx";
import Subscriptions from "./subscriptions/Subscriptions.jsx";
import Settings from "./settings/Settings.jsx";
import styles from "../styles/Shell.module.css";

export default function Shell({ onLogout, lang, setLang }){
  const [page,setPage] = useState("home");

  return (
    <div className={styles.page}>
      <Topbar page={page} setPage={setPage} onLogout={onLogout} lang={lang} setLang={setLang} />
      <div className={styles.container}>
        {page === "home" && <Home lang={lang} />}
        {page === "exercises" && <Exercises lang={lang} />}
        {page === "members" && <Members lang={lang} />}
        {page === "subscriptions" && <Subscriptions lang={lang} />}
        {page === "settings" && <Settings lang={lang} setLang={setLang} />}
      </div>
    </div>
  );
}
