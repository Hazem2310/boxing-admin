import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/Modal.module.css";
import { t } from "../../lib/i18n.js";

function addDays(iso, days){
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}

export default function SubscriptionModal({ lang, mode, item, members, onClose, onSave }){
  const today = useMemo(()=> new Date().toISOString().slice(0,10), []);
  const [planDays, setPlanDays] = useState(30);

  const [form,setForm] = useState({
    member_id: "",
    start_date: today,
    end_date: addDays(today, 30),
    plan: "monthly",
    notes: ""
  });

  useEffect(()=>{
    if(mode==="edit" && item){
      setForm({
        member_id: item.member_id,
        start_date: item.start_date,
        end_date: item.end_date,
        plan: item.plan || "monthly",
        notes: item.notes || ""
      });
    }else{
      // default member if any
      if(members?.length){
        setForm((s)=>({ ...s, member_id: members[0].id }));
      }
    }
  },[mode,item,members]);

  const set = (k,v) => setForm(s=>({...s,[k]:v}));

  const applyPlan = (days, name) => {
    setPlanDays(days);
    set("plan", name);
    set("end_date", addDays(form.start_date, days));
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      member_id: Number(form.member_id),
      start_date: form.start_date,
      end_date: form.end_date,
      plan: form.plan,
      notes: form.notes
    };
    onSave(payload, mode==="edit" ? item.id : null);
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e)=>e.stopPropagation()}>
        <div className={styles.head}>
          <h3>{mode==="edit" ? t(lang,"subscriptions") : t(lang,"addSubscription")}</h3>
          <button className={styles.x} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.grid}>
            <div>
              <label>{t(lang,"members")}</label>
              <select value={form.member_id} onChange={(e)=>set("member_id", e.target.value)} required>
                <option value="" disabled>—</option>
                {members.map((m)=>(
                  <option key={m.id} value={m.id}>{m.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>{t(lang,"plan")}</label>
              <select value={form.plan} onChange={(e)=>set("plan", e.target.value)}>
                <option value="monthly">monthly</option>
                <option value="quarterly">quarterly</option>
                <option value="yearly">yearly</option>
                <option value="custom">custom</option>
              </select>
            </div>

            <div>
              <label>{t(lang,"startDate")}</label>
              <input type="date" value={form.start_date} onChange={(e)=>{ set("start_date", e.target.value); set("end_date", addDays(e.target.value, planDays)); }} />
            </div>

            <div>
              <label>{t(lang,"endDate")}</label>
              <input type="date" value={form.end_date} onChange={(e)=>set("end_date", e.target.value)} />
            </div>
          </div>

          <div style={{display:"flex", gap:"10px", flexWrap:"wrap"}}>
            <button type="button" className={styles.ghost} onClick={()=>applyPlan(30,"monthly")}>30d</button>
            <button type="button" className={styles.ghost} onClick={()=>applyPlan(90,"quarterly")}>90d</button>
            <button type="button" className={styles.ghost} onClick={()=>applyPlan(365,"yearly")}>365d</button>
          </div>

          <div>
            <label>{t(lang,"notes")}</label>
            <input value={form.notes} onChange={(e)=>set("notes", e.target.value)} />
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
