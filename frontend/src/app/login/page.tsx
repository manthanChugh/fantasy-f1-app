import styles from "./page.module.css";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.authCard}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Join the Grid</h1>
          <p className={styles.subtitle}>Sign in or create an account to draft your team.</p>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className={styles.input} 
              placeholder="hamilton@mercedes.com"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className={styles.input} 
              placeholder="••••••••"
            />
          </div>

          <div className={styles.actionGroup}>
            <button formAction={login} className="btn-primary">
              Log in
            </button>
            <button formAction={signup} className={styles.btnSecondary}>
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
