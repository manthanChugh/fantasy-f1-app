import styles from './leaderboard.module.css';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Leaderboard() {
  const supabase = await createClient();

  // Fetch all players
  const { data: players } = await supabase.from('players').select('*');
  // Fetch all race scores
  const { data: scores } = await supabase.from('player_race_scores').select('*');

  if (!players || !scores) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Leaderboard</h1>
        <p>No data available yet.</p>
      </div>
    );
  }

  // 1. Calculate Total Points Leaderboard
  const playerPoints: Record<string, number> = {};
  players.forEach(p => { playerPoints[p.id] = 0; });
  scores.forEach(s => {
    if (playerPoints[s.player_id] !== undefined) {
      playerPoints[s.player_id] += s.total_points;
    }
  });

  const pointsLeaderboard = players
    .map(p => ({ ...p, totalPoints: playerPoints[p.id] }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  // 2. Calculate Podium Finishes
  // Group scores by race
  const raceScores: Record<string, typeof scores> = {};
  scores.forEach(s => {
    if (!raceScores[s.race_id]) raceScores[s.race_id] = [];
    raceScores[s.race_id].push(s);
  });

  const playerPodiums: Record<string, { first: number, second: number, third: number }> = {};
  players.forEach(p => { playerPodiums[p.id] = { first: 0, second: 0, third: 0 }; });

  Object.values(raceScores).forEach(raceGroup => {
    // Sort descending by points
    raceGroup.sort((a, b) => b.total_points - a.total_points);
    if (raceGroup.length > 0 && playerPodiums[raceGroup[0].player_id]) {
      playerPodiums[raceGroup[0].player_id].first++;
    }
    if (raceGroup.length > 1 && playerPodiums[raceGroup[1].player_id]) {
      playerPodiums[raceGroup[1].player_id].second++;
    }
    if (raceGroup.length > 2 && playerPodiums[raceGroup[2].player_id]) {
      playerPodiums[raceGroup[2].player_id].third++;
    }
  });

  // Calculate podium score: for sorting (e.g. Olympics style: gold > silver > bronze)
  const podiumLeaderboard = players
    .map(p => ({
      ...p,
      podiums: playerPodiums[p.id]
    }))
    .sort((a, b) => {
      if (a.podiums.first !== b.podiums.first) return b.podiums.first - a.podiums.first;
      if (a.podiums.second !== b.podiums.second) return b.podiums.second - a.podiums.second;
      if (a.podiums.third !== b.podiums.third) return b.podiums.third - a.podiums.third;
      return playerPoints[b.id] - playerPoints[a.id]; // tie-breaker by total points
    });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Global Leaderboard</h1>
        <p className={styles.subtitle}>See how you stack up against the rest of the league.</p>
      </div>

      <div className={styles.grid}>
        {/* Total Points Leaderboard */}
        <div className={`glass-panel ${styles.tableContainer}`}>
          <h2 className={styles.tableTitle}>Season Standings</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Player</th>
                <th className={styles.textRight}>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {pointsLeaderboard.map((player, index) => (
                <tr key={player.id} className={index < 3 ? styles[`top${index + 1}`] : ''}>
                  <td className={styles.posCell}>{index + 1}</td>
                  <td className={styles.nameCell}>{player.name}</td>
                  <td className={`${styles.pointsCell} ${styles.textRight}`}>{player.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Podium Leaderboard */}
        <div className={`glass-panel ${styles.tableContainer}`}>
          <h2 className={styles.tableTitle}>Podium Finishes</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Player</th>
                <th title="1st Place" className={styles.textCenter}>🥇</th>
                <th title="2nd Place" className={styles.textCenter}>🥈</th>
                <th title="3rd Place" className={styles.textCenter}>🥉</th>
              </tr>
            </thead>
            <tbody>
              {podiumLeaderboard.map((player, index) => (
                <tr key={player.id} className={index < 3 ? styles[`top${index + 1}`] : ''}>
                  <td className={styles.posCell}>{index + 1}</td>
                  <td className={styles.nameCell}>{player.name}</td>
                  <td className={`${styles.medalCell} ${styles.textCenter}`}>{player.podiums.first}</td>
                  <td className={`${styles.medalCell} ${styles.textCenter}`}>{player.podiums.second}</td>
                  <td className={`${styles.medalCell} ${styles.textCenter}`}>{player.podiums.third}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
