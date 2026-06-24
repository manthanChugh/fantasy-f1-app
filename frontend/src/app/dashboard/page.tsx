import styles from './dashboard.module.css';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PerformanceChart from '@/components/PerformanceChart/PerformanceChart';

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get total points & all scores for chart
  const { data: scores } = await supabase
    .from('player_race_scores')
    .select('race_id, total_points')
    .eq('player_id', user.id)
    .order('race_id', { ascending: true });

  const totalPoints = scores ? scores.reduce((sum, s) => sum + s.total_points, 0) : 0;
  
  // Format data for chart
  const chartData = scores?.map(s => ({
    race: s.race_id,
    points: s.total_points
  })) || [];

  // Get latest team selection
  const { data: selection } = await supabase
    .from('team_selections')
    .select('driver_ids, is_locked, race_id')
    .eq('player_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single();

  let teamDrivers: any[] = [];
  if (selection && selection.driver_ids.length > 0) {
    const { data: drivers } = await supabase
      .from('drivers')
      .select('*')
      .in('id', selection.driver_ids);
    teamDrivers = drivers || [];
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome Back</h1>
        <div className={`glass-panel ${styles.pointsBadge}`}>
          <span className={styles.pointsLabel}>Total Points</span>
          <span className={styles.pointsValue}>{totalPoints}</span>
        </div>
      </div>

      <div className={styles.content}>
        <section className={`glass-panel ${styles.teamSection}`}>
          <div className={styles.sectionHeader}>
            <h2>Your Current Team</h2>
            {selection ? (
              <span className={selection.is_locked ? styles.lockedBadge : styles.openBadge}>
                {selection.is_locked ? 'Locked' : 'Editable'}
              </span>
            ) : null}
          </div>

          {!selection ? (
            <div className={styles.emptyState}>
              <p>You haven't drafted a team yet.</p>
              <Link href="/team" className="btn-primary">Draft Team Now</Link>
            </div>
          ) : (
            <>
              <div className={styles.teamGrid}>
                {selection.driver_ids.map((id: string) => {
                  const driver = teamDrivers.find(d => d.id === id);
                  if (!driver) return null;
                  return (
                    <div key={driver.id} className={styles.driverCard}>
                      <div className={styles.driverImage}>
                        <div className={styles.placeholderAvatar}>
                          {driver.full_name.charAt(0)}
                        </div>
                      </div>
                      <div className={styles.driverInfo}>
                        <span className={styles.driverName}>{driver.full_name}</span>
                        <span className={styles.driverTeam}>{driver.team}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!selection.is_locked && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <Link href="/team" className="btn-primary">Edit Team</Link>
                </div>
              )}
            </>
          )}
        </section>

        <section className={`glass-panel ${styles.statsSection}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2>Season Stats</h2>
          <div className={styles.statGrid}>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Global Rank</span>
              <span className={styles.statBoxValue}>--</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Best Finish</span>
              <span className={styles.statBoxValue}>--</span>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Points Scored Per Week</h3>
            <PerformanceChart data={chartData} />
          </div>
        </section>
      </div>
    </div>
  );
}
