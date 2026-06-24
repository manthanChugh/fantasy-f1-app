import styles from './DriverCard.module.css';
import Image from 'next/image';

export interface DriverProps {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  price: number;
  points: number;
  headshotUrl?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function DriverCard({
  id,
  firstName,
  lastName,
  team,
  price,
  points,
  headshotUrl,
  isSelected = false,
  onSelect,
}: DriverProps) {
  
  // A helper to determine border color based on team (optional visual flair)
  const getTeamColorClass = (teamName: string) => {
    const normalized = teamName.toLowerCase();
    if (normalized.includes('mercedes')) return styles.teamMercedes;
    if (normalized.includes('ferrari')) return styles.teamFerrari;
    if (normalized.includes('red bull')) return styles.teamRedBull;
    if (normalized.includes('mclaren')) return styles.teamMcLaren;
    if (normalized.includes('aston martin')) return styles.teamAstonMartin;
    if (normalized.includes('audi')) return styles.teamAudi;
    if (normalized.includes('alpine')) return styles.teamAlpine;
    if (normalized.includes('cadillac')) return styles.teamCadillac;
    if (normalized.includes('williams')) return styles.teamWilliams;
    if (normalized.includes('racing bulls') || normalized === 'rb') return styles.teamRacingBulls;
    if (normalized.includes('haas')) return styles.teamHaas;
    return styles.teamDefault;
  };

  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${getTeamColorClass(team)}`}
      onClick={() => onSelect && onSelect(id)}
    >
      <div className={styles.imageContainer}>
        {headshotUrl ? (
          <Image 
            src={headshotUrl} 
            alt={`${firstName} ${lastName}`} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        ) : (
          <div className={styles.placeholderImage}>
            <span className={styles.placeholderText}>{firstName[0]}{lastName[0]}</span>
          </div>
        )}
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.header}>
          <span className={styles.teamName}>{team}</span>
          <span className={styles.points}>{points} pts</span>
        </div>
        
        <h3 className={styles.driverName}>
          <span className={styles.firstName}>{firstName}</span>
          <span className={styles.lastName}>{lastName}</span>
        </h3>
        
        <div className={styles.footer}>
          <div className={styles.priceTag}>
            £{price.toFixed(1)}m
          </div>
          <button 
            className={`${styles.actionBtn} ${isSelected ? styles.actionBtnRemove : styles.actionBtnAdd}`}
            onClick={(e) => {
              e.stopPropagation(); // prevent double firing if card is also clickable
              onSelect && onSelect(id);
            }}
          >
            {isSelected ? '-' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}
