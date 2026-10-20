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
    const { entry, expenseTx } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 1. Guardar la entrada de historial
    if (entry) {
      await sql`
        INSERT INTO silvio_stock_entries (id, type, product_id, product_name, category, qty, cost_price, selling_price, date, tx_id)
        VALUES (${entry.id}, ${entry.type || 'reabastecimiento'}, ${entry.productId}, ${entry.productName}, ${entry.category}, ${Number(entry.qty) || 0}, ${Number(entry.costPrice) || 0}, ${Number(entry.sellingPrice) || 0}, ${entry.date || new Date().toISOString()}, ${entry.txId || null})
        ON CONFLICT (id) DO NOTHING;
      `;

      // 2. Aumentar stock del producto en Neon
      await sql`
        UPDATE silvio_products
        SET stock = stock + ${Number(entry.qty) || 0}, updated_at = NOW()
        WHERE id = ${entry.productId};
      `;
    }

    // 3. Si se registró gasto
    if (expenseTx) {
      await sql`
        INSERT INTO silvio_transactions (id, type, description, value, date, category)
        VALUES (${expenseTx.id}, 'egreso', ${expenseTx.description}, ${Number(expenseTx.value) || 0}, ${expenseTx.date}, ${expenseTx.category || 'Mercadería'})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    return res.status(200).json({ success: true, connected: true });
  } catch (err) {
    console.error('Error en /api/restock:', err);
    return res.status(500).json({ error: err.message });
  }
};
