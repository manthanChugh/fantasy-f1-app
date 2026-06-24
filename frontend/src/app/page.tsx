import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.backgroundGlow} />

      <div className={`animate-fade-in ${styles.content}`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          2026 Season Now Open
        </div>

        <h1 className={styles.title}>
          Build Your Ultimate <br />
          <span className="text-gradient-red">Racing Dynasty</span>
        </h1>

        <p className={styles.subtitle}>
          Draft your 5-driver roster, manage your £100M budget, and compete against friends in the most immersive Fantasy F1 experience.
        </p>

        <div className={styles.actionGroup}>
          <Link href="/team" className="btn-primary">
            Draft Your Team
          </Link>
          <Link href="/leaderboard" className={styles.btnSecondary}>
            View Leaderboard
          </Link>
        </div>

        <div className={`glass-panel ${styles.statsPanel}`}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>11</span>
            <span className={styles.statLabel}>Teams</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>22</span>
            <span className={styles.statLabel}>Drivers</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>£100M</span>
            <span className={styles.statLabel}>Budget</span>
          </div>
        </div>
      </div>
    </div>
  );
}
