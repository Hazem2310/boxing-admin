import { useEffect, useState } from "react";
import styles from "../../styles/Modal.module.css";
import { t } from "../../lib/i18n.js";

export default function ExerciseModal({ lang, mode, item, onClose, onSave }){
  const [form,setForm] = useState({
    title: "",
    level: "beginner",
    category: "General",
    duration_sec: 180,
    equipment: "",
    video_url: "",
    description: ""
  });

  useEffect(()=>{
    if(mode === "edit" && item){
      setForm({
        title: item.title || "",
        level: item.level || "beginner",
        category: item.category || "General",
        duration_sec: item.duration_sec || 180,
        equipment: item.equipment || "",
        video_url: item.video_url || "",
        description: item.description || ""
      });
    }
  },[mode,item]);

  const set = (k,v) => setForm(s=>({...s,[k]:v}));

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, duration_sec: Number(form.duration_sec||0) }, mode === "edit" ? item.id : null);
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e)=>e.stopPropagation()}>
        <div className={styles.head}>
          <h3>{mode === "edit" ? t(lang,"editExercise") : t(lang,"addExercise")}</h3>
          <button className={styles.x} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.grid}>
            <div>
              <label>{t(lang,"title")}</label>
              <input value={form.title} onChange={(e)=>set("title", e.target.value)} required />
            </div>
            <div>
              <label>{t(lang,"level")}</label>
              <select value={form.level} onChange={(e)=>set("level", e.target.value)}>
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>
            <div>
              <label>{t(lang,"category")}</label>
              <input value={form.category} onChange={(e)=>set("category", e.target.value)} />
            </div>
            <div>
              <label>{t(lang,"duration")} (sec)</label>
              <input type="number" value={form.duration_sec} onChange={(e)=>set("duration_sec", e.target.value)} />
            </div>
            <div>
              <label>{t(lang,"equipment")}</label>
              <input value={form.equipment} onChange={(e)=>set("equipment", e.target.value)} />
            </div>
            <div>
              <label>{t(lang,"video")}</label>
              <input value={form.video_url} onChange={(e)=>set("video_url", e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div>
            <label>{t(lang,"description")}</label>
            <textarea rows="5" value={form.description} onChange={(e)=>set("description", e.target.value)} />
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
