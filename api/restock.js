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

    if (req.method === 'DELETE') {
      const { id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (id) {
        await sql`DELETE FROM silvio_stock_entries WHERE id = ${id}`;
      }
      return res.status(200).json({ success: true, connected: true });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const { entry, expenseTx } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 1. Guardar la entrada de historial
    if (entry) {
      await sql`
        INSERT INTO silvio_stock_entries (id, type, product_id, product_name, category, qty, cost_price, selling_price, date, tx_id)
        VALUES (${entry.id}, ${entry.type || 'reabastecimiento'}, ${entry.productId}, ${entry.productName}, ${entry.category}, ${Number(entry.qty) || 0}, ${Number(entry.costPrice) || 0}, ${Number(entry.sellingPrice) || 0}, ${entry.date || new Date().toISOString()}, ${entry.txId || null})
        ON CONFLICT (id) DO UPDATE SET
          qty = EXCLUDED.qty,
          cost_price = EXCLUDED.cost_price,
          selling_price = EXCLUDED.selling_price;
      `;

      // 2. Aumentar stock del producto y actualizar precios de costo y venta en Neon solo si es reabastecimiento
      if (entry.type !== 'nuevo_producto' && entry.type !== 'base_inicial') {
        const costPrice = Number(entry.costPrice) >= 0 ? Number(entry.costPrice) : null;
        const sellingPrice = Number(entry.sellingPrice) > 0 ? Number(entry.sellingPrice) : null;

        await sql`
          UPDATE silvio_products
          SET stock = stock + ${Number(entry.qty) || 0},
              cost_price = COALESCE(${costPrice}, cost_price),
              selling_price = COALESCE(${sellingPrice}, selling_price),
              updated_at = NOW()
          WHERE id = ${entry.productId};
        `;
      }
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
