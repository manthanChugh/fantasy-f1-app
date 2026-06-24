import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import styles from './drivers.module.css';

export default async function DriversPage() {
  const supabase = await createClient();

  const { data: drivers } = await supabase.from('drivers').select('*').order('price_m', { ascending: false });

  if (!drivers || drivers.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Drivers</h1>
        <p>No drivers available.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>F1 Drivers Database</h1>
        <p className={styles.subtitle}>Analyze driver stats and find the best value for your team.</p>
      </div>

      <div className={styles.grid}>
        {drivers.map(driver => {
          const ppm = driver.price_m > 0 ? (driver.season_points / driver.price_m).toFixed(1) : 0;
          
          return (
            <Link href={`/drivers/${driver.id}`} key={driver.id} className={`glass-panel ${styles.card}`}>
              <div className={styles.cardHeader}>
                <div className={styles.imageWrapper}>
                  {driver.headshot_url ? (
                    <Image 
                      src={driver.headshot_url} 
                      alt={driver.full_name} 
                      fill 
                      className={styles.image} 
                    />
                  ) : (
                    <div className={styles.placeholderAvatar}>{driver.full_name.charAt(0)}</div>
                  )}
                </div>
                <div className={styles.info}>
                  <h2 className={styles.name}>{driver.full_name}</h2>
                  <span className={styles.team}>{driver.team}</span>
                </div>
              </div>
              
              <div className={styles.statsRow}>
                <div className={styles.statCol}>
                  <span className={styles.statLabel}>Price</span>
                  <span className={styles.statValue}>£{driver.price_m}M</span>
                </div>
                <div className={styles.statCol}>
                  <span className={styles.statLabel}>Points</span>
                  <span className={styles.statValue}>{driver.season_points}</span>
                </div>
                <div className={styles.statCol}>
                  <span className={styles.statLabel}>Pts/Mil</span>
                  <span className={styles.statValue}>{ppm}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
