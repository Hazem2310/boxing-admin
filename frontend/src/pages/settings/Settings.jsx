import styles from "../../styles/Settings.module.css";
import LangSwitch from "../../ui/LangSwitch.jsx";
import { t } from "../../lib/i18n.js";

export default function Settings({ lang, setLang }){
  return (
    <div className={styles.card}>
      <h2 className={styles.h2}>{t(lang,"settings")}</h2>
      <p className={styles.p}>{t(lang,"lang")}</p>
      <LangSwitch lang={lang} setLang={setLang} />
    </div>
  );
}
