import styles from "../../styles/Home.module.css";
import { t } from "../../lib/i18n.js";

export default function Home({ lang }){
  return (
    <div className={styles.hero}>
      <div className={styles.kicker}>{t(lang,"welcome")} 🥊</div>
      <h2 className={styles.h2}>{t(lang,"appName")}</h2>
      <p className={styles.p}>
        {t(lang,"subtitle")}. {t(lang,"members")} + {t(lang,"subscriptions")} + {t(lang,"exercises")}.
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.big}>👤</div>
          <div className={styles.tt}>{t(lang,"members")}</div>
          <div className={styles.ss}>Add / Edit / Delete</div>
        </div>
        <div className={styles.card}>
          <div className={styles.big}>📅</div>
          <div className={styles.tt}>{t(lang,"subscriptions")}</div>
          <div className={styles.ss}>Start / End / Status</div>
        </div>
        <div className={styles.card}>
          <div className={styles.big}>🥊</div>
          <div className={styles.tt}>{t(lang,"exercises")}</div>
          <div className={styles.ss}>Library manager</div>
        </div>
      </div>
    </div>
  );
}
