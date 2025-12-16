import { useEffect, useState } from "react";
import styles from "../../styles/Modal.module.css";
import { t } from "../../lib/i18n.js";

export default function MemberModal({ lang, mode, item, onClose, onSave }){
  const [form,setForm] = useState({ full_name:"", phone:"", email:"" });

  useEffect(()=>{
    if(mode==="edit" && item){
      setForm({ full_name: item.full_name || "", phone: item.phone || "", email: item.email || "" });
    }
  },[mode,item]);

  const set = (k,v) => setForm(s=>({...s,[k]:v}));

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form }, mode==="edit" ? item.id : null);
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modalSmall} onMouseDown={(e)=>e.stopPropagation()}>
        <div className={styles.head}>
          <h3>{mode==="edit" ? t(lang,"editMember") : t(lang,"addMember")}</h3>
          <button className={styles.x} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div>
            <label>{t(lang,"fullName")}</label>
            <input value={form.full_name} onChange={(e)=>set("full_name", e.target.value)} required />
          </div>
          <div>
            <label>{t(lang,"phone")}</label>
            <input value={form.phone} onChange={(e)=>set("phone", e.target.value)} />
          </div>
          <div>
            <label>{t(lang,"email")}</label>
            <input value={form.email} onChange={(e)=>set("email", e.target.value)} />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.ghost} onClick={onClose}>{t(lang,"cancel")}</button>
            <button className={styles.primary} type="submit">{t(lang,"save")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
