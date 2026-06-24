-- 1. Add the missing columns to your drivers table
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS headshot_url text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS season_points int default 0;

-- 2. Ensure existing auth users (like you!) have a profile in the 'players' table
INSERT INTO public.players (id, name, email)
SELECT id, email, email FROM auth.users
ON CONFLICT (email) DO NOTHING;

-- 3. Create a trigger to automatically add future signups to the 'players' table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.players (id, name, email)
  VALUES (new.id, new.email, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Clear old dummy drivers if any
DELETE FROM drivers;

-- 5. Seed the official 2025/2026 grid with YOUR custom prices!
INSERT INTO drivers (id, full_name, team, price_m, headshot_url, season_points) VALUES 
('norris', 'Lando Norris', 'McLaren', 31.3, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/4col/image.png', 0),
('verstappen', 'Max Verstappen', 'Red Bull Racing', 30.7, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/4col/image.png', 0),
('piastri', 'Oscar Piastri', 'McLaren', 29.9, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/4col/image.png', 0),
('russell', 'George Russell', 'Mercedes', 28.2, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/4col/image.png', 0),
('leclerc', 'Charles Leclerc', 'Ferrari', 26.0, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/4col/image.png', 0),
('antonelli', 'Kimi Antonelli', 'Mercedes', 26.0, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/ANDANT01_Kimi_Antonelli/andant01.png.transform/4col/image.png', 0),
('hamilton', 'Lewis Hamilton', 'Ferrari', 25.3, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/4col/image.png', 0),
('hadjar', 'Isack Hadjar', 'Red Bull Racing', 21.8, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/4col/image.png', 0),
('sainz', 'Carlos Sainz', 'Williams', 18.1, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/4col/image.png', 0),
('albon', 'Alexander Albon', 'Williams', 17.4, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/4col/image.png', 0),
('alonso', 'Fernando Alonso', 'Aston Martin', 16.7, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/4col/image.png', 0),
('bearman', 'Oliver Bearman', 'Haas F1 Team', 16.1, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/4col/image.png', 0),
('hulkenberg', 'Nico Hulkenberg', 'Audi', 14.9, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/4col/image.png', 0),
('lawson', 'Liam Lawson', 'Racing Bulls', 14.4, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/4col/image.png', 0),
('gasly', 'Pierre Gasly', 'Alpine', 13.8, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/4col/image.png', 0),
('ocon', 'Esteban Ocon', 'Haas F1 Team', 13.7, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/4col/image.png', 0),
('bortoleto', 'Gabriel Bortoleto', 'Audi', 12.7, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/4col/image.png', 0),
('perez', 'Sergio Perez', 'Cadillac', 12.3, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/4col/image.png', 0),
('stroll', 'Lance Stroll', 'Aston Martin', 12.2, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/4col/image.png', 0),
('lindblad', 'Arvid Lindblad', 'Racing Bulls', 12.0, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ARVLIN01_Arvid_Lindblad/arvlin01.png.transform/4col/image.png', 0),
('bottas', 'Valtteri Bottas', 'Cadillac', 11.5, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/4col/image.png', 0),
('colapinto', 'Franco Colapinto', 'Alpine', 11.4, 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/4col/image.png', 0);
