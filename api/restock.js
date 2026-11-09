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
    let updatedProduct = null;

    // 1. Guardar la entrada de historial con protección de idempotencia
    if (entry) {
      const existingEntry = await sql`
        SELECT id FROM silvio_stock_entries WHERE id = ${entry.id} LIMIT 1;
      `;

      if (!existingEntry || existingEntry.length === 0) {
        // Entrada nueva: registrar en historial
        await sql`
          INSERT INTO silvio_stock_entries (id, type, product_id, product_name, category, qty, cost_price, selling_price, date, tx_id)
          VALUES (${entry.id}, ${entry.type || 'reabastecimiento'}, ${entry.productId}, ${entry.productName}, ${entry.category}, ${Number(entry.qty) || 0}, ${Number(entry.costPrice) || 0}, ${Number(entry.sellingPrice) || 0}, ${entry.date || new Date().toISOString()}, ${entry.txId || null})
          ON CONFLICT (id) DO NOTHING;
        `;

        // Aumentar stock del producto y actualizar precios en Neon SOLO si es reabastecimiento y es nueva
        if (entry.type !== 'nuevo_producto' && entry.type !== 'base_inicial') {
          const costPrice = Number(entry.costPrice) >= 0 ? Number(entry.costPrice) : null;
          const sellingPrice = Number(entry.sellingPrice) > 0 ? Number(entry.sellingPrice) : null;

          const rows = await sql`
            UPDATE silvio_products
            SET stock = stock + ${Number(entry.qty) || 0},
                cost_price = COALESCE(${costPrice}, cost_price),
                selling_price = COALESCE(${sellingPrice}, selling_price),
                updated_at = NOW()
            WHERE id = ${entry.productId}
            RETURNING id, name, category, stock, cost_price as "costPrice", selling_price as "sellingPrice", min_stock as "minStock";
          `;
          if (rows && rows.length > 0) {
            updatedProduct = {
              ...rows[0],
              stock: Number(rows[0].stock),
              costPrice: Number(rows[0].costPrice),
              sellingPrice: Number(rows[0].sellingPrice),
              minStock: Number(rows[0].minStock)
            };
          }
        }
      }
    }

    // 2. Si se registró gasto
    if (expenseTx) {
      const costValue = expenseTx.unitCost !== undefined && expenseTx.unitCost !== null ? Number(expenseTx.unitCost) : null;
      await sql`
        INSERT INTO silvio_transactions (id, type, description, value, date, category, product_id, qty, unit_cost)
        VALUES (${expenseTx.id}, 'egreso', ${expenseTx.description}, ${Number(expenseTx.value) || 0}, ${expenseTx.date}, ${expenseTx.category || 'Compra de Mercancía'}, ${expenseTx.productId || null}, ${expenseTx.qty || null}, ${costValue})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    return res.status(200).json({ success: true, connected: true, updatedProduct });
  } catch (err) {
    console.error('Error en /api/restock:', err);
    return res.status(500).json({ error: err.message });
  }
};
