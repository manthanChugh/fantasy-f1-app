-- Enable RLS just in case it isn't
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_selections ENABLE ROW LEVEL SECURITY;

-- 1. Allow EVERYONE to read the drivers table (needed for the draft page!)
DROP POLICY IF EXISTS "Drivers are viewable by everyone" ON drivers;
CREATE POLICY "Drivers are viewable by everyone" 
ON drivers FOR SELECT 
USING (true);

-- 2. Allow users to only view their own drafted teams
DROP POLICY IF EXISTS "Users can view their own selections" ON team_selections;
CREATE POLICY "Users can view their own selections" 
ON team_selections FOR SELECT 
USING (auth.uid() = player_id);

-- 3. Allow users to insert their own teams
DROP POLICY IF EXISTS "Users can insert their own selections" ON team_selections;
CREATE POLICY "Users can insert their own selections" 
ON team_selections FOR INSERT 
WITH CHECK (auth.uid() = player_id);

-- 4. Allow users to update their own teams
DROP POLICY IF EXISTS "Users can update their own selections" ON team_selections;
CREATE POLICY "Users can update their own selections" 
ON team_selections FOR UPDATE 
USING (auth.uid() = player_id);
