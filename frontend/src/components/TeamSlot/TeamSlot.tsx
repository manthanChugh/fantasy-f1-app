import styles from './TeamSlot.module.css';
import Image from 'next/image';
import { Driver } from '@/app/team/TeamDraftClient';

type Props = {
  driver?: Driver;
  slotNumber: number;
  onRemove?: (id: string) => void;
  isLocked?: boolean;
};

export default function TeamSlot({ driver, slotNumber, onRemove, isLocked }: Props) {
  if (!driver) {
    return (
      <div className={styles.emptySlot}>
        <div className={styles.slotNumber}>{slotNumber}</div>
        <div className={styles.emptyIcon}>+</div>
        <div className={styles.emptyText}>Select Driver</div>
      </div>
    );
  }

  return (
    <div className={`${styles.filledSlot} ${isLocked ? styles.locked : ''}`}>
      <div className={styles.slotNumber}>{slotNumber}</div>
      <div className={styles.imageContainer}>
        {driver.headshotUrl ? (
          <Image 
            src={driver.headshotUrl} 
            alt={`${driver.firstName} ${driver.lastName}`}
            fill
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholderImage} />
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{driver.lastName}</span>
        <span className={styles.price}>£{driver.price.toFixed(1)}M</span>
      </div>
      
      {!isLocked && onRemove && (
        <button 
          className={styles.removeBtn} 
          onClick={() => onRemove(driver.id)}
          aria-label={`Remove ${driver.lastName}`}
        >
          &times;
        </button>
      )}
    </div>
  );
}
