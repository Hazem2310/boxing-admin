import { useEffect, useMemo, useState } from "react";
import { api } from "../../api.js";
import styles from "../../styles/Exercises.module.css";
import ExerciseModal from "./ExerciseModal.jsx";
import ConfirmDialog from "../../ui/ConfirmDialog.jsx";
import Toast from "../../ui/Toast.jsx";
import { t } from "../../lib/i18n.js";

const LEVELS = ["", "beginner", "intermediate", "advanced"];

export default function Exercises({ lang }){
  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);

  const [q,setQ] = useState("");
  const [level,setLevel] = useState("");
  const [category,setCategory] = useState("");

  const [modal,setModal] = useState(null);
  const [confirm,setConfirm] = useState(null);
  const [toast,setToast] = useState(null);

  const categories = useMemo(()=>{
    const s = new Set(items.map(x=>x.category).filter(Boolean));
    return ["", ...Array.from(s).sort()];
  },[items]);

  const load = async () => {
    setLoading(true);
    try{
      const data = await api.listExercises({ q, level, category });
      setItems(data.items || []);
    }catch(e){
      setToast({type:"error", msg:e.message});
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, []);

  const onSave = async (payload, id) => {
    try{
      if(id) await api.updateExercise(id, payload);
      else await api.createExercise(payload);
      setToast({type:"success", msg: t(lang,"save") + " ✅"});
      setModal(null);
      await load();
    }catch(e){
      setToast({type:"error", msg:e.message});
    }
  };

  const onDelete = async (id) => {
    try{
      await api.deleteExercise(id);
      setToast({type:"success", msg: t(lang,"deleteExercise") + " ✅"});
      setConfirm(null);
      await load();
    }catch(e){
      setToast({type:"error", msg:e.message});
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h2>{t(lang,"exercises")}</h2>
          <p>CRUD + Search + Filters</p>
        </div>
        <button className={styles.primary} onClick={()=>setModal({mode:"create"})}>
          + {t(lang,"addExercise")}
        </button>
      </div>

      <div className={styles.filters}>
        <input className={styles.input} placeholder={t(lang,"search")} value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className={styles.input} value={level} onChange={(e)=>setLevel(e.target.value)}>
          {LEVELS.map(x=>(
            <option key={x} value={x}>{x ? x : t(lang,"allLevels")}</option>
          ))}
        </select>
        <select className={styles.input} value={category} onChange={(e)=>setCategory(e.target.value)}>
          {categories.map(x=>(
            <option key={x} value={x}>{x ? x : t(lang,"allCategories")}</option>
          ))}
        </select>
        <button className={styles.ghost} onClick={load}>{t(lang,"apply")}</button>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.skeleton}>Loading...</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>{t(lang,"notFound")}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t(lang,"title")}</th>
                <th>{t(lang,"level")}</th>
                <th>{t(lang,"category")}</th>
                <th>{t(lang,"duration")}</th>
                <th>{t(lang,"video")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(it=>(
                <tr key={it.id}>
                  <td>
                    <div className={styles.titleCell}>
                      <div className={styles.title}>{it.title}</div>
                      <div className={styles.sub}>{it.equipment || "—"}</div>
                    </div>
                  </td>
                  <td><span className={styles.badge}>{it.level}</span></td>
                  <td>{it.category}</td>
                  <td>{Math.round((it.duration_sec||0)/60)} {t(lang,"minutes")}</td>
                  <td>
                    {it.video_url ? (
                      <a className={styles.link} href={it.video_url} target="_blank" rel="noreferrer">{t(lang,"open")}</a>
                    ) : "—"}
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.small} onClick={()=>setModal({mode:"edit", item: it})}>
                      {t(lang,"editExercise")}
                    </button>
                    <button className={styles.smallDanger} onClick={()=>setConfirm({id: it.id, title: it.title})}>
                      {t(lang,"deleteExercise")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <ExerciseModal
          lang={lang}
          mode={modal.mode}
          item={modal.item}
          onClose={()=>setModal(null)}
          onSave={onSave}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={t(lang,"deleteExercise")}
          text={`${t(lang,"sureDelete")} "${confirm.title}" ?`}
          onCancel={()=>setConfirm(null)}
          onConfirm={()=>onDelete(confirm.id)}
          lang={lang}
        />
      )}

      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
    </div>
  );
}
