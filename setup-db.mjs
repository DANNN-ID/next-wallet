import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:3eXMKTjPIeqmvAGN@db.imhksdwvwbwsrxydczqf.supabase.co:5432/postgres";

const client = new Client({
  connectionString,
});

const sql = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-running (optional, but good for clean slate)
DROP VIEW IF EXISTS account_balances;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS profiles;
DROP TYPE IF EXISTS transaction_type;

-- ENUM untuk tipe transaksi
CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- 1. Tabel Profil Pengguna (Terkait dengan auth.users bawaan Supabase)
CREATE TABLE profiles (
   id UUID REFERENCES auth.users(id) PRIMARY KEY,
   full_name VARCHAR(100) NOT NULL,
   role VARCHAR(20) DEFAULT 'member', -- 'admin' (Anda) atau 'member' (adik/saudara)
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Dompet / Rekening (BCA, Gopay, Dompet Tunai, dll)
CREATE TABLE accounts (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
   name VARCHAR(50) NOT NULL, -- cth: "BCA Utama", "Gopay"
   type VARCHAR(20), -- 'BANK', 'EWALLET', 'CASH'
   initial_balance NUMERIC(15, 2) DEFAULT 0.00,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Kategori (Mendukung Sub-Kategori / Hierarki)
CREATE TABLE categories (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name VARCHAR(50) NOT NULL,
   type transaction_type NOT NULL, -- Kategori ini khusus INCOME atau EXPENSE?
   icon VARCHAR(50), -- Simpan nama icon/emoji untuk UI mobile
   parent_id UUID REFERENCES categories(id) ON DELETE CASCADE, -- NULL jika ini parent category
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Transaksi Utama
CREATE TABLE transactions (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID REFERENCES profiles(id),
   account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
   category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
   
   type transaction_type NOT NULL,
   amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0), -- Selalu positif
   transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   description TEXT,
   
   -- Untuk kasus TRANSFER antar rekening (misal tarik tunai ATM)
   -- Jika ini transfer keluar, kita hubungkan dengan ID transaksi transfer masuknya
   linked_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE, 
   
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE VIEW account_balances AS
SELECT 
   a.id AS account_id,
   a.name,
   a.initial_balance + 
   COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) - 
   COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS current_balance
FROM accounts a
LEFT JOIN transactions t ON a.id = t.account_id
GROUP BY a.id, a.name, a.initial_balance;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage their own accounts" ON accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can read categories" ON categories FOR SELECT USING (true);
`;

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL.");
    await client.query(sql);
    console.log("Database schema and RLS setup successfully!");
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

run();
