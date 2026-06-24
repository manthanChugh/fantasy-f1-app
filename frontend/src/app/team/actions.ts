'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveTeam(driverIds: string[]) {
  if (driverIds.length !== 5) {
    return { success: false, error: 'You must select exactly 5 drivers.' };
  }

  const supabase = await createClient();

  // 1. Check if user is logged in
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'You must be logged in to save a team.' };
  }

  // 2. Fetch the current driver prices to validate budget
  const { data: drivers, error: driversError } = await supabase
    .from('drivers')
    .select('id, price_m')
    .in('id', driverIds);

  if (driversError || !drivers || drivers.length !== 5) {
    return { success: false, error: 'Invalid drivers selected or database error.' };
  }

  const totalCost = drivers.reduce((sum, driver) => sum + Number(driver.price_m), 0);
  if (totalCost > 100) {
    return { success: false, error: `Over budget! Total cost is £${totalCost.toFixed(1)}M.` };
  }

  // 3. Get the upcoming race ID from OpenF1
  // We'll fetch the latest session and use its session_key as the race_id.
  let raceId = '2025_01'; // fallback
  try {
    const res = await fetch('https://api.openf1.org/v1/sessions?session_type=Race', { next: { revalidate: 3600 } });
    if (res.ok) {
      const sessions = await res.json();
      // For MVP, if it returns an array of past races, we could pick the last one + 1, 
      // but OpenF1 /sessions usually lists the whole calendar. 
      // Let's just pick the latest session key for now.
      if (sessions && sessions.length > 0) {
        // Sort by date_start descending to get the most recent/upcoming
        sessions.sort((a: any, b: any) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
        raceId = sessions[0].session_key.toString();
      }
    }
  } catch (e) {
    console.error("Failed to fetch from OpenF1", e);
  }

  // 4. Upsert the team selection
  // First, check if they already have a selection for this race
  const { data: existingSelection } = await supabase
    .from('team_selections')
    .select('id, is_locked')
    .eq('player_id', user.id)
    .eq('race_id', raceId)
    .single();

  if (existingSelection?.is_locked) {
    return { success: false, error: 'Your team is already locked for this race.' };
  }

  if (existingSelection) {
    // Update
    const { error: updateError } = await supabase
      .from('team_selections')
      .update({ driver_ids: driverIds, submitted_at: new Date().toISOString() })
      .eq('id', existingSelection.id);
      
    if (updateError) {
      return { success: false, error: 'Failed to update team: ' + updateError.message };
    }
  } else {
    // Insert
    const { error: insertError } = await supabase
      .from('team_selections')
      .insert({
        player_id: user.id,
        race_id: raceId,
        driver_ids: driverIds,
      });
      
    if (insertError) {
      return { success: false, error: 'Failed to save team: ' + insertError.message };
    }
  }

  revalidatePath('/team');
  return { success: true };
}
