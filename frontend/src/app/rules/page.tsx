import styles from '../dashboard/dashboard.module.css'; // Reusing layout styles for consistency
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Scoring Rules</h1>
        <p className="text-secondary" style={{ fontSize: '1.1rem' }}>How to earn points in Fantasy F1.</p>
      </div>

      <div className={styles.content} style={{ gridTemplateColumns: '1fr' }}>
        <section className={`glass-panel ${styles.teamSection}`}>
          <div className={styles.sectionHeader}>
            <h2>General Rules</h2>
          </div>
          <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <li><strong>Budget:</strong> You have <strong>£100M</strong> to draft 5 drivers.</li>
            <li><strong>Lock:</strong> Your team locks at the start of Qualifying for the race week.</li>
            <li><strong>Transfers:</strong> You get 1 free transfer per week. Unused transfers bank up to a maximum of 5.</li>
          </ul>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <section className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Race Finish</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>1st Place</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>10 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>2nd Place</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>8 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>3rd Place</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>6 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>4th Place</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>4 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>5th Place</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>2 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>6th Place</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>1 pt</span></li>
            </ul>
          </section>

          <section className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Qualifying</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pole Position</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>3 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Reached Q3</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>2 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Reached Q2</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>1 pt</span></li>
            </ul>
          </section>

          <section className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Bonuses</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Driver of the Day</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>10 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Race Win Bonus</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>7 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Podium Bonus</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>5 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Beat Teammate</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>5 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Points Finish (Top 10)</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>3 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fastest Lap</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>2 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Positions Gained</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>1 pt / pos</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fastest Pitstop</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>1 pt</span></li>
            </ul>
          </section>

          <section className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Sprint Weekends</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sprint Pole</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>2 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sprint Win</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>2 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sprint Points Finish</span> <span style={{ color: 'var(--f1-red)', fontWeight: 'bold' }}>1 pt</span></li>
            </ul>
          </section>

          <section className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Penalties</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Mechanical DNF</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-1 pt</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Crash in Race (DNF)</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-3 pts</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Crash in Quali</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-1 pt</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Lapped</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-1 pt / lap</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Time/Grid Penalty</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-1 pt / pen</span></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
