'use client';

import { useState, useTransition } from 'react';
import styles from './page.module.css';
import { DriverCard } from '@/components/DriverCard/DriverCard';
import { BudgetBar } from '@/components/BudgetBar/BudgetBar';
import TeamSlot from '@/components/TeamSlot/TeamSlot';
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

  const handleRemoveDriver = (id: string) => {
    if (isLocked) return;
    setSelectedDrivers(selectedDrivers.filter(d => d !== id));
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

  // Map selected IDs back to Driver objects for the slots
  const selectedDriverObjects = selectedDrivers.map(id => initialDrivers.find(d => d.id === id)!);

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
          <BudgetBar currentSpend={currentSpend} maxBudget={100} />
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {selectedDrivers.length} / 5 Drivers Selected
            </span>
            <button 
              className="btn-primary" 
              onClick={handleSave}
              disabled={selectedDrivers.length !== 5 || overBudget || isPending || isLocked}
            >
              {isPending ? 'Saving...' : (isLocked ? 'Locked' : 'Save Team')}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.slotsContainer} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[0, 1, 2, 3, 4].map(index => (
          <TeamSlot 
            key={index} 
            slotNumber={index + 1}
            driver={selectedDriverObjects[index]} 
            onRemove={handleRemoveDriver}
            isLocked={isLocked}
          />
        ))}
      </div>

      <div className={styles.grid}>
        {initialDrivers.map(driver => (
          <DriverCard 
            key={driver.id}
            id={driver.id}
            name={`${driver.firstName} ${driver.lastName}`}
            team={driver.team}
            price={driver.price}
            points={driver.points}
            imageUrl={driver.headshotUrl}
            isSelected={selectedDrivers.includes(driver.id)}
            onSelect={handleSelectDriver}
          />
        ))}
      </div>
    </div>
  );
}
