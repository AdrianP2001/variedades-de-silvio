const { getSql, ensureTables, getConnectionString } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const connectionString = getConnectionString();
  if (!connectionString) return res.status(200).json({ success: true, connected: false });

  const sql = getSql();

  try {
    await ensureTables();

    if (req.method === 'POST') {
      const p = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const rows = await sql`
        INSERT INTO silvio_products (id, name, category, stock, cost_price, selling_price, min_stock, created_at, updated_at)
        VALUES (${p.id}, ${p.name}, ${p.category || 'Otros'}, ${Number(p.stock) || 0}, ${Number(p.costPrice) || 0}, ${Number(p.sellingPrice) || 0}, ${Number(p.minStock) || 0}, ${p.createdAt || new Date().toISOString()}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          stock = EXCLUDED.stock,
          cost_price = EXCLUDED.cost_price,
          selling_price = EXCLUDED.selling_price,
          min_stock = EXCLUDED.min_stock,
          updated_at = NOW()
        RETURNING id, name, category, stock, cost_price as "costPrice", selling_price as "sellingPrice", min_stock as "minStock", created_at as "createdAt";
      `;

      return res.status(200).json({ success: true, connected: true, product: rows[0] });
    }

    if (req.method === 'DELETE') {
      const { id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await sql`DELETE FROM silvio_products WHERE id = ${id}`;
      return res.status(200).json({ success: true, connected: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('Error en /api/product:', err);
    return res.status(500).json({ error: err.message });
  }
};
