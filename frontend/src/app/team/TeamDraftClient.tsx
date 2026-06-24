'use client';

import { useState, useTransition } from 'react';
import styles from './page.module.css';
import DriverCard from '@/components/DriverCard/DriverCard';
import { saveTeam } from './actions';

export type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  price: number;
  points: number;
  headshotUrl: string;
};

type Props = {
  initialDrivers: Driver[];
  userDraftedIds?: string[];
  isLocked?: boolean;
};

export default function TeamDraftClient({ initialDrivers, userDraftedIds = [], isLocked = false }: Props) {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(userDraftedIds);
  const [isPending, startTransition] = useTransition();

  const handleSelectDriver = (id: string) => {
    if (isLocked) return;

    if (selectedDrivers.includes(id)) {
      setSelectedDrivers(selectedDrivers.filter(d => d !== id));
    } else {
      if (selectedDrivers.length < 5) {
        setSelectedDrivers([...selectedDrivers, id]);
      } else {
        alert("You can only select up to 5 drivers!");
      }
    }
  };

  const handleSave = () => {
    if (selectedDrivers.length !== 5) return;
    
    startTransition(async () => {
      const result = await saveTeam(selectedDrivers);
      if (result.success) {
        alert("Team saved successfully!");
      } else {
        alert("Error saving team: " + result.error);
      }
    });
  };

  const currentSpend = selectedDrivers.reduce((total, id) => {
    const driver = initialDrivers.find(d => d.id === id);
    return total + (driver?.price || 0);
  }, 0);

  const overBudget = currentSpend > 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Draft Your Team</h1>
          <p className={styles.subtitle}>
            {isLocked ? "Your team is locked for this race." : "Select 5 drivers while staying under the £100M budget."}
          </p>
        </div>
        
        <div className={`glass-panel ${styles.budgetPanel}`}>
          <div className={styles.budgetStats}>
            <div>
              <span className={styles.budgetLabel}>Drivers</span>
              <span className={styles.budgetValue}>{selectedDrivers.length} / 5</span>
            </div>
            <div>
              <span className={styles.budgetLabel}>Remaining</span>
              <span className={`${styles.budgetValue} ${overBudget ? styles.overBudget : ''}`}>
                £{(100 - currentSpend).toFixed(1)}M
              </span>
            </div>
          </div>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={selectedDrivers.length !== 5 || overBudget || isPending || isLocked}
          >
            {isPending ? 'Saving...' : (isLocked ? 'Locked' : 'Save Team')}
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {initialDrivers.map(driver => (
          <DriverCard 
            key={driver.id}
            {...driver}
            isSelected={selectedDrivers.includes(driver.id)}
            onSelect={handleSelectDriver}
          />
        ))}
      </div>
    </div>
  );
}
