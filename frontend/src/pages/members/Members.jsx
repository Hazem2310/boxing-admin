import { useEffect, useState } from "react";
import { api } from "../../api.js";
import styles from "../../styles/Members.module.css";
import MemberModal from "./MemberModal.jsx";
import ConfirmDialog from "../../ui/ConfirmDialog.jsx";
import Toast from "../../ui/Toast.jsx";
import { t } from "../../lib/i18n.js";

export default function Members({ lang }){
  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const [q,setQ] = useState("");
  const [modal,setModal] = useState(null);
  const [confirm,setConfirm] = useState(null);
  const [toast,setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    try{
      const data = await api.listMembers({ q });
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
      if(id) await api.updateMember(id, payload);
      else await api.createMember(payload);
      setToast({type:"success", msg: t(lang,"save") + " ✅"});
      setModal(null);
      await load();
    }catch(e){
      setToast({type:"error", msg:e.message});
    }
  };

  const onDelete = async (id) => {
    try{
      await api.deleteMember(id);
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
          <h2>{t(lang,"members")}</h2>
          <p>{t(lang,"subtitle")}</p>
        </div>
        <button className={styles.primary} onClick={()=>setModal({mode:"create"})}>
          + {t(lang,"addMember")}
        </button>
      </div>

      <div className={styles.filters}>
        <input className={styles.input} placeholder={t(lang,"search")} value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className={styles.ghost} onClick={load}>{t(lang,"apply")}</button>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>{t(lang,"notFound")}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t(lang,"fullName")}</th>
                <th>{t(lang,"phone")}</th>
                <th>{t(lang,"email")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((m)=>(
                <tr key={m.id}>
                  <td className={styles.bold}>{m.full_name}</td>
                  <td>{m.phone || "—"}</td>
                  <td>{m.email || "—"}</td>
                  <td className={styles.actions}>
                    <button className={styles.small} onClick={()=>setModal({mode:"edit", item:m})}>
                      {t(lang,"editMember")}
                    </button>
                    <button className={styles.smallDanger} onClick={()=>setConfirm({id:m.id, title:m.full_name})}>
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
        <MemberModal
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
