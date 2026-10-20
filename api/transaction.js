const { getSql, ensureTables, getConnectionString } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const connectionString = getConnectionString();
  if (!connectionString) return res.status(200).json({ success: true, connected: false });

  const sql = getSql();

  try {
    await ensureTables();

    if (req.method === 'DELETE') {
      const { id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (id) {
        await sql`DELETE FROM silvio_transactions WHERE id = ${id}`;
      }
      return res.status(200).json({ success: true, connected: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('Error en /api/transaction:', err);
    return res.status(500).json({ error: err.message });
  }
};
