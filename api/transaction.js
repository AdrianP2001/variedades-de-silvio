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
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, restoreStock, deductStock, productId, qty } = body || {};

      if (id) {
        // Consultar la transacción existente para verificar si sigue activa
        const existingTx = await sql`
          SELECT product_id as "productId", qty, type, description 
          FROM silvio_transactions 
          WHERE id = ${id}
          LIMIT 1;
        `;

        // Protección de idempotencia: SOLO modificar stock si la transacción sigue existiendo
        if (existingTx && existingTx.length > 0) {
          const txRow = existingTx[0];
          const targetProductId = productId || txRow.productId;
          const targetQty = Number(qty) > 0 ? Number(qty) : (txRow && Number(txRow.qty) > 0 ? Number(txRow.qty) : 1);

          if (restoreStock && targetProductId) {
            await sql`
              UPDATE silvio_products
              SET stock = stock + ${targetQty}, updated_at = NOW()
              WHERE id = ${targetProductId};
            `;
          } else if (deductStock && targetProductId) {
            await sql`
              UPDATE silvio_products
              SET stock = GREATEST(0, stock - ${targetQty}), updated_at = NOW()
              WHERE id = ${targetProductId};
            `;
          }

          await sql`DELETE FROM silvio_transactions WHERE id = ${id}`;
        }
      }
      return res.status(200).json({ success: true, connected: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('Error en /api/transaction:', err);
    return res.status(500).json({ error: err.message });
  }
};
