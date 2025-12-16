import styles from "../styles/LangSwitch.module.css";
import { t } from "../lib/i18n.js";

export default function LangSwitch({ lang, setLang, compact=false }){
  return (
    <div className={compact ? styles.wrapCompact : styles.wrap}>
      {!compact && <div className={styles.label}>{t(lang,"lang")}</div>}
      <div className={styles.btns}>
        <button className={lang==="ar" ? styles.active : styles.btn} onClick={()=>setLang("ar")}>{t(lang,"arabic")}</button>
        <button className={lang==="he" ? styles.active : styles.btn} onClick={()=>setLang("he")}>{t(lang,"hebrew")}</button>
      </div>
    </div>
  );
}
