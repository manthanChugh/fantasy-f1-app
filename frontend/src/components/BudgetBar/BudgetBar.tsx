import React from 'react';
import styles from './BudgetBar.module.css';

interface BudgetBarProps {
  currentSpend: number;
  maxBudget: number;
}

export const BudgetBar: React.FC<BudgetBarProps> = ({ currentSpend, maxBudget }) => {
  const percentage = Math.min((currentSpend / maxBudget) * 100, 100);
  const remaining = maxBudget - currentSpend;
  
  // Determine color based on how close to budget cap
  let barColorClass = styles.safe;
  if (percentage > 90) barColorClass = styles.danger;
  else if (percentage > 75) barColorClass = styles.warning;

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.label}>
          <span className={styles.title}>Budget Remaining</span>
          <span className={`${styles.value} ${remaining < 0 ? styles.textDanger : ''}`}>
            £{remaining.toFixed(1)}M
          </span>
        </div>
        <div className={styles.label}>
          <span className={styles.title}>Spent</span>
          <span className={styles.value}>£{currentSpend.toFixed(1)}M / £{maxBudget}M</span>
        </div>
      </div>
      
      <div className={styles.track}>
        <div 
          className={`${styles.fill} ${barColorClass}`} 
          style={{ width: `${percentage}%` }}
        />
        {/* Tick marks for visual reference */}
        <div className={styles.ticks}>
          {[25, 50, 75].map(tick => (
            <div key={tick} className={styles.tick} style={{ left: `${tick}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
};
