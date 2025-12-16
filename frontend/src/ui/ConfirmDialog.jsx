import styles from "../styles/Modal.module.css";
import { t } from "../lib/i18n.js";

export default function ConfirmDialog({ title, text, onCancel, onConfirm, lang }){
  return (
    <div className={styles.backdrop} onMouseDown={onCancel}>
      <div className={styles.modalSmall} onMouseDown={(e)=>e.stopPropagation()}>
        <h3>{title}</h3>
        <p className={styles.p}>{text}</p>
        <div className={styles.footer}>
          <button className={styles.ghost} onClick={onCancel}>{t(lang,"cancel")}</button>
          <button className={styles.danger} onClick={onConfirm}>{t(lang,"deleteExercise")}</button>
        </div>
      </div>
    </div>
  );
}
