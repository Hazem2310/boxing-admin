import { useEffect } from "react";
import styles from "../styles/Modal.module.css";

export default function Toast({ type="success", msg, onClose }){
  useEffect(()=>{
    const t = setTimeout(onClose, 2500);
    return ()=>clearTimeout(t);
  },[onClose]);

  return (
    <div className={type==="error" ? styles.toastErr : styles.toastOk} onClick={onClose}>
      {msg}
    </div>
  );
}
