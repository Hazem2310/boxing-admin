import { useState } from "react";
import { api } from "../api.js";
import styles from "../styles/Login.module.css";
import Toast from "../ui/Toast.jsx";
import LangSwitch from "../ui/LangSwitch.jsx";
import { t } from "../lib/i18n.js";

export default function Login({ onAuthed, lang, setLang }){
  const [username,setUsername] = useState("admin");
  const [password,setPassword] = useState("admin123");
  const [loading,setLoading] = useState(false);
  const [toast,setToast] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const data = await api.login(username,password);
      onAuthed(data.token);
    }catch(err){
      setToast({type:"error", msg: err.message});
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <LangSwitch lang={lang} setLang={setLang} />
      </div>

      <div className={styles.bgGlow}></div>
      <form className={styles.card} onSubmit={submit}>
        <div className={styles.brand}>
          <div className={styles.logo}>🥊</div>
          <div>
            <h1>{t(lang,"appName")}</h1>
            <p>{t(lang,"subtitle")}</p>
          </div>
        </div>

        <label className={styles.label}>{t(lang,"username")}</label>
        <input className={styles.input} value={username} onChange={(e)=>setUsername(e.target.value)} />

        <label className={styles.label}>{t(lang,"password")}</label>
        <input className={styles.input} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button className={styles.btn} disabled={loading}>
          {loading ? "..." : t(lang,"login")}
        </button>

        <div className={styles.hint}>{t(lang,"defaultCreds")}</div>
      </form>

      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
    </div>
  );
}
