import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:3eXMKTjPIeqmvAGN@db.imhksdwvwbwsrxydczqf.supabase.co:5432/postgres";

const client = new Client({
  connectionString,
});

const sql = `
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Everyone can read categories" ON categories;
DROP POLICY IF EXISTS "Users can read global and own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
DROP POLICY IF EXISTS "Users can update own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON categories;

CREATE POLICY "Users can read global and own categories" ON categories FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);
`;

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL.");
    await client.query(sql);
    console.log("Database schema and RLS updated for custom categories successfully!");
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

run();
