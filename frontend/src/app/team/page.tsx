import { createClient } from '@/utils/supabase/server';
import TeamDraftClient, { Driver } from './TeamDraftClient';

export default async function TeamSelectionPage() {
  const supabase = await createClient();

  // 1. Fetch the user's session
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch the real 2025 driver grid from our database
  // The 'seed_drivers.sql' script populates this!
  const { data: driverRows } = await supabase
    .from('drivers')
    .select('*');

  // Format them for the client component
  const drivers: Driver[] = (driverRows || []).map(d => ({
    id: d.id,
    firstName: d.full_name.split(' ')[0], // simple split, assumes "Lando Norris"
    lastName: d.full_name.split(' ').slice(1).join(' '),
    team: d.team,
    price: Number(d.price_m),
    points: Number(d.season_points) || 0,
    headshotUrl: d.headshot_url || '',
  }));

  // Sort them by price descending so the most expensive drivers are first
  drivers.sort((a, b) => b.price - a.price);

  // 3. Check if the user has already drafted a team for the upcoming race
  let userDraftedIds: string[] = [];
  let isLocked = false;

  if (user) {
    // For MVP, fetch the most recent drafted team
    const { data: teamSelection } = await supabase
      .from('team_selections')
      .select('driver_ids, is_locked')
      .eq('player_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single();

    if (teamSelection) {
      userDraftedIds = teamSelection.driver_ids;
      isLocked = teamSelection.is_locked;
    }
  }

  return (
    <TeamDraftClient 
      initialDrivers={drivers} 
      userDraftedIds={userDraftedIds} 
      isLocked={isLocked}
    />
  );
}
