import styles from "../styles/Topbar.module.css";
import LangSwitch from "./LangSwitch.jsx";
import { t } from "../lib/i18n.js";

export default function Topbar({ page, setPage, onLogout, lang, setLang }){
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.badge}>🥊</div>
        <div className={styles.brand}>
          <div className={styles.title}>{t(lang,"appName")}</div>
          <div className={styles.sub}>{t(lang,"subtitle")}</div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={page==="home" ? styles.tabActive : styles.tab} onClick={()=>setPage("home")}>{t(lang,"home")}</button>
        <button className={page==="exercises" ? styles.tabActive : styles.tab} onClick={()=>setPage("exercises")}>{t(lang,"exercises")}</button>
        <button className={page==="members" ? styles.tabActive : styles.tab} onClick={()=>setPage("members")}>{t(lang,"members")}</button>
        <button className={page==="subscriptions" ? styles.tabActive : styles.tab} onClick={()=>setPage("subscriptions")}>{t(lang,"subscriptions")}</button>
        <button className={page==="settings" ? styles.tabActive : styles.tab} onClick={()=>setPage("settings")}>{t(lang,"settings")}</button>
      </div>

      <div className={styles.right}>
        <LangSwitch lang={lang} setLang={setLang} compact />
        <button className={styles.logout} onClick={onLogout}>{t(lang,"logout")}</button>
      </div>
    </div>
  );
}
