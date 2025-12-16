import { useEffect, useMemo, useState } from "react";
import { api } from "../../api.js";
import styles from "../../styles/Subscriptions.module.css";
import Toast from "../../ui/Toast.jsx";
import ConfirmDialog from "../../ui/ConfirmDialog.jsx";
import SubscriptionModal from "./SubscriptionModal.jsx";
import { t } from "../../lib/i18n.js";

export default function Subscriptions({ lang }){
  const [items,setItems] = useState([]);
  const [members,setMembers] = useState([]);
  const [loading,setLoading] = useState(true);
  const [status,setStatus] = useState("");
  const [modal,setModal] = useState(null);
  const [confirm,setConfirm] = useState(null);
  const [toast,setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    try{
      const [subs, mems] = await Promise.all([
        api.listSubscriptions({ status }),
        api.listMembers({})
      ]);
      setItems(subs.items || []);
      setMembers(mems.items || []);
    }catch(e){
      setToast({type:"error", msg:e.message});
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, []);

  const onSave = async (payload, id) => {
    try{
      if(id) await api.updateSubscription(id, payload);
      else await api.createSubscription(payload);
      setToast({type:"success", msg: t(lang,"save") + " ✅"});
      setModal(null);
      await load();
    }catch(e){
      setToast({type:"error", msg:e.message});
    }
  };

  const onDelete = async (id) => {
    try{
      await api.deleteSubscription(id);
      setToast({type:"success", msg: t(lang,"deleteExercise") + " ✅"});
      setConfirm(null);
      await load();
    }catch(e){
      setToast({type:"error", msg:e.message});
    }
  };

  const badgeClass = (st) => st === "active" ? styles.badgeOk : styles.badgeBad;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h2>{t(lang,"subscriptions")}</h2>
          <p>{t(lang,"subtitle")}</p>
        </div>
        <button className={styles.primary} onClick={()=>setModal({mode:"create"})}>
          + {t(lang,"addSubscription")}
        </button>
      </div>

      <div className={styles.filters}>
        <select className={styles.input} value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">{t(lang,"apply")} — {t(lang,"status")}</option>
          <option value="active">{t(lang,"active")}</option>
          <option value="expired">{t(lang,"expired")}</option>
        </select>
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
                <th>{t(lang,"plan")}</th>
                <th>{t(lang,"startDate")}</th>
                <th>{t(lang,"endDate")}</th>
                <th>{t(lang,"status")}</th>
                <th>{t(lang,"remaining")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s)=>(
                <tr key={s.id}>
                  <td className={styles.bold}>
                    {s.full_name}
                    <div className={styles.sub}>{s.phone || ""}</div>
                  </td>
                  <td>{s.plan}</td>
                  <td>{s.start_date}</td>
                  <td>{s.end_date}</td>
                  <td><span className={badgeClass(s.status)}>{t(lang, s.status)}</span></td>
                  <td>{s.remaining_days}</td>
                  <td className={styles.actions}>
                    <button className={styles.small} onClick={()=>setModal({mode:"edit", item:s})}>
                      {t(lang,"save")}
                    </button>
                    <button className={styles.smallDanger} onClick={()=>setConfirm({id:s.id, title:s.full_name})}>
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
        <SubscriptionModal
          lang={lang}
          mode={modal.mode}
          item={modal.item}
          members={members}
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
