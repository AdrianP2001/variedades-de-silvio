const { getSql, ensureTables, getConnectionString } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const connectionString = getConnectionString();
  if (!connectionString) {
    return res.status(200).json({ success: true, connected: false });
  }

  const sql = getSql();

  try {
    await ensureTables();
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { id, description, value, date, category, productId, qty, unitCost } = body;

    const quantity = Number(qty) || 1;
    const saleValue = Number(value) || 0;
    const itemUnitCost = unitCost !== undefined && unitCost !== null && !isNaN(Number(unitCost)) ? Number(unitCost) : null;

    // Protección de idempotencia: verificar si la transacción ya fue procesada previamente
    const existingTx = await sql`
      SELECT id FROM silvio_transactions WHERE id = ${id} LIMIT 1;
    `;
    if (existingTx && existingTx.length > 0) {
      // Ya existe: no volver a descontar stock
      return res.status(200).json({
        success: true,
        connected: true,
        duplicate: true
      });
    }

    // 1. Insertar transacción
    await sql`
      INSERT INTO silvio_transactions (id, type, description, value, date, category, product_id, qty, unit_cost)
      VALUES (${id}, 'ingreso', ${description || 'VENTA'}, ${saleValue}, ${date}, ${category || 'Ventas'}, ${productId || null}, ${quantity}, ${itemUnitCost})
      ON CONFLICT (id) DO NOTHING;
    `;

    // 2. Si tiene producto asociado, descontar stock en Neon atómicamente
    let updatedProduct = null;
    if (productId) {
      const rows = await sql`
        UPDATE silvio_products
        SET stock = GREATEST(0, stock - ${quantity}), updated_at = NOW()
        WHERE id = ${productId}
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

    return res.status(200).json({
      success: true,
      connected: true,
      updatedProduct
    });
  } catch (err) {
    console.error('Error en /api/sale:', err);
    return res.status(500).json({ error: err.message });
  }
};
