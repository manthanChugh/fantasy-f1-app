import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from '../drivers.module.css';
import PerformanceChart from '@/components/PerformanceChart/PerformanceChart';
import Link from 'next/link';

export default async function DriverDetail(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: driver } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!driver) {
    notFound();
  }

  // Fetch driver history
  const { data: scores } = await supabase
    .from('driver_scores')
    .select('race_id, total_points')
    .eq('driver_id', params.id)
    .order('race_id', { ascending: true });

  const chartData = scores?.map(s => ({
    race: s.race_id,
    points: s.total_points
  })) || [];

  const ppm = driver.price_m > 0 ? (driver.season_points / driver.price_m).toFixed(1) : '0';
  const avgPts = scores && scores.length > 0 
    ? (driver.season_points / scores.length).toFixed(1) 
    : '0';

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/drivers" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          &larr; Back to Drivers
        </Link>
      </div>

      <div className={`glass-panel`} style={{ padding: '3rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {driver.headshot_url ? (
            <Image src={driver.headshot_url} alt={driver.full_name} fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
          ) : (
            <span style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{driver.full_name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{driver.full_name}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', margin: 0 }}>{driver.team}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Price</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>£{driver.price_m}M</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Season Points</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--f1-red)' }}>{driver.season_points}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Pts/Mil</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{ppm}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Avg Pts/Race</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{avgPts}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Performance History</h2>
        <PerformanceChart data={chartData} />
      </div>
    </div>
  );
}
