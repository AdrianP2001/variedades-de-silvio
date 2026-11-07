const { neon, Pool } = require('@neondatabase/serverless');

function getConnectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
}

function getPool() {
  const connectionString = getConnectionString();
  if (!connectionString) return null;
  return new Pool({ connectionString });
}

function getSql() {
  const connectionString = getConnectionString();
  if (!connectionString) return null;
  return neon(connectionString);
}

let isInitialized = false;
async function ensureTables() {
  if (isInitialized) return;
  const sql = getSql();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS silvio_products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        stock INTEGER NOT NULL DEFAULT 0,
        cost_price NUMERIC(12,2) NOT NULL DEFAULT 0,
        selling_price NUMERIC(12,2) NOT NULL DEFAULT 0,
        min_stock INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS silvio_transactions (
        id VARCHAR(100) PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        description TEXT,
        value NUMERIC(12,2) NOT NULL DEFAULT 0,
        date VARCHAR(20) NOT NULL,
        category VARCHAR(100),
        product_id VARCHAR(100),
        qty INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS silvio_stock_entries (
        id VARCHAR(100) PRIMARY KEY,
        type VARCHAR(30) NOT NULL,
        product_id VARCHAR(100),
        product_name VARCHAR(255),
        category VARCHAR(100),
        qty INTEGER NOT NULL DEFAULT 0,
        cost_price NUMERIC(12,2) NOT NULL DEFAULT 0,
        selling_price NUMERIC(12,2) NOT NULL DEFAULT 0,
        date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tx_id VARCHAR(100)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS silvio_loans (
        id VARCHAR(100) PRIMARY KEY,
        client VARCHAR(255) DEFAULT 'Cliente',
        client_name VARCHAR(255) DEFAULT 'Cliente',
        amount NUMERIC(12,2) NOT NULL DEFAULT 0,
        interest NUMERIC(8,2) NOT NULL DEFAULT 0,
        total NUMERIC(12,2) NOT NULL DEFAULT 0,
        total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
        days INTEGER NOT NULL DEFAULT 1,
        frequency VARCHAR(20) NOT NULL DEFAULT 'diaria',
        paid NUMERIC(12,2) NOT NULL DEFAULT 0,
        remaining_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
        date VARCHAR(20) DEFAULT '',
        loan_date VARCHAR(20) DEFAULT '',
        due_date VARCHAR(20) DEFAULT '',
        status VARCHAR(20) DEFAULT 'active',
        payments JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Migraciones automáticas idempotentes para tablas existentes
    await sql`ALTER TABLE silvio_loans ADD COLUMN IF NOT EXISTS client VARCHAR(255) DEFAULT 'Cliente'`;
    await sql`ALTER TABLE silvio_loans ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2) DEFAULT 0`;
    await sql`ALTER TABLE silvio_loans ADD COLUMN IF NOT EXISTS interest NUMERIC(8,2) DEFAULT 0`;
    await sql`ALTER TABLE silvio_loans ADD COLUMN IF NOT EXISTS total NUMERIC(12,2) DEFAULT 0`;
    await sql`ALTER TABLE silvio_loans ADD COLUMN IF NOT EXISTS days INTEGER DEFAULT 1`;
    await sql`ALTER TABLE silvio_loans ADD COLUMN IF NOT EXISTS frequency VARCHAR(20) DEFAULT 'diaria'`;
    await sql`ALTER TABLE silvio_loans ADD COLUMN IF NOT EXISTS paid NUMERIC(12,2) DEFAULT 0`;
    await sql`ALTER TABLE silvio_loans ADD COLUMN IF NOT EXISTS date VARCHAR(20) DEFAULT ''`;
    await sql`ALTER TABLE silvio_transactions ADD COLUMN IF NOT EXISTS unit_cost NUMERIC(12,2)`;

    await sql`
      CREATE TABLE IF NOT EXISTS silvio_meta (
        key VARCHAR(50) PRIMARY KEY,
        value JSONB
      );
    `;

    isInitialized = true;
  } catch (err) {
    console.error('Error al inicializar tablas en Neon:', err);
    throw err;
  }
}

module.exports = {
  getConnectionString,
  getPool,
  getSql,
  ensureTables
};
