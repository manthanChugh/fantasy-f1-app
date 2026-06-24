import React from 'react';
import Image from 'next/image';
import styles from './DriverCard.module.css';

interface DriverCardProps {
  id: string;
  name: string;
  team: string;
  price: number;
  points: number;
  imageUrl?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  disabled?: boolean;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  id,
  name,
  team,
  price,
  points,
  imageUrl,
  isSelected = false,
  onSelect,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(id);
    }
  };

  return (
    <div 
      className={`glass-panel ${styles.card} ${isSelected ? styles.selected : ''} ${disabled && !isSelected ? styles.disabled : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className={styles.image}
            unoptimized // OpenF1/Fallback images from external domains without next.config.ts setup
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        <div className={styles.priceTag}>
          £{price.toFixed(1)}M
        </div>
      </div>
      
      <div className={styles.details}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.team}>{team}</p>
        
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>PTS</span>
            <span className={styles.statValue}>{points}</span>
          </div>
        </div>
      </div>

      {isSelected && <div className={styles.selectedBadge}>✓</div>}
    </div>
  );
};
