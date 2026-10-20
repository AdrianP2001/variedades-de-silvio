const { getSql, ensureTables, getConnectionString } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const connectionString = getConnectionString();
  if (!connectionString) return res.status(200).json({ success: true, connected: false });

  const sql = getSql();

  try {
    await ensureTables();
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { id, description, value, date, category } = body;

    await sql`
      INSERT INTO silvio_transactions (id, type, description, value, date, category)
      VALUES (${id}, 'egreso', ${description || 'GASTO'}, ${Number(value) || 0}, ${date}, ${category || 'Varios'})
      ON CONFLICT (id) DO NOTHING;
    `;

    return res.status(200).json({ success: true, connected: true });
  } catch (err) {
    console.error('Error en /api/expense:', err);
    return res.status(500).json({ error: err.message });
  }
};
