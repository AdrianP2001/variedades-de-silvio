const { getSql, ensureTables, getConnectionString } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const connectionString = getConnectionString();
  if (!connectionString) {
    return res.status(200).json({
      success: true,
      connected: false,
      message: 'Base de datos Neon aún no conectada. Operando en modo local.'
    });
  }

  const sql = getSql();

  try {
    await ensureTables();

    if (req.method === 'GET') {
      const [products, transactions, stockEntries, loans, categoriesMeta] = await Promise.all([
        sql`SELECT id, name, category, stock, cost_price as "costPrice", selling_price as "sellingPrice", min_stock as "minStock", created_at as "createdAt" FROM silvio_products ORDER BY name ASC`,
        sql`SELECT id, type, description, value, date, category, product_id as "productId", qty, created_at as "createdAt" FROM silvio_transactions ORDER BY date DESC, created_at DESC`,
        sql`SELECT id, type, product_id as "productId", product_name as "productName", category, qty, cost_price as "costPrice", selling_price as "sellingPrice", date, tx_id as "txId" FROM silvio_stock_entries ORDER BY date DESC`,
        sql`SELECT id, client_name as "clientName", total_amount as "totalAmount", remaining_amount as "remainingAmount", loan_date as "loanDate", due_date as "dueDate", status, payments, created_at as "createdAt" FROM silvio_loans ORDER BY created_at DESC`,
        sql`SELECT value FROM silvio_meta WHERE key = 'categories'`
      ]);

      const categories = (categoriesMeta.length > 0 && categoriesMeta[0].value) 
        ? categoriesMeta[0].value 
        : ["Ropa", "Calzado", "Perfumes", "Accesorios", "Otros"];

      return res.status(200).json({
        success: true,
        connected: true,
        data: {
          products: products.map(p => ({
            ...p,
            stock: Number(p.stock) || 0,
            costPrice: Number(p.costPrice) || 0,
            sellingPrice: Number(p.sellingPrice) || 0,
            minStock: Number(p.minStock) || 0,
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString()
          })),
          transactions: transactions.map(t => ({
            ...t,
            value: Number(t.value) || 0,
            qty: Number(t.qty) || 1
          })),
          stockEntries: stockEntries.map(e => ({
            ...e,
            qty: Number(e.qty) || 0,
            costPrice: Number(e.costPrice) || 0,
            sellingPrice: Number(e.sellingPrice) || 0,
            date: e.date ? new Date(e.date).toISOString() : new Date().toISOString()
          })),
          loans: loans.map(l => ({
            ...l,
            totalAmount: Number(l.totalAmount) || 0,
            remainingAmount: Number(l.remainingAmount) || 0,
            payments: Array.isArray(l.payments) ? l.payments : []
          })),
          categories
        },
        serverTime: new Date().toISOString()
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { products = [], transactions = [], stockEntries = [], loans = [], categories = [] } = body || {};

      if (categories && categories.length > 0) {
        await sql`
          INSERT INTO silvio_meta (key, value)
          VALUES ('categories', ${JSON.stringify(categories)})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
        `;
      }

      for (const p of products) {
        await sql`
          INSERT INTO silvio_products (id, name, category, stock, cost_price, selling_price, min_stock, created_at, updated_at)
          VALUES (${p.id}, ${p.name}, ${p.category || 'Otros'}, ${p.stock || 0}, ${p.costPrice || 0}, ${p.sellingPrice || 0}, ${p.minStock || 0}, ${p.createdAt || new Date().toISOString()}, NOW())
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            stock = EXCLUDED.stock,
            cost_price = EXCLUDED.cost_price,
            selling_price = EXCLUDED.selling_price,
            min_stock = EXCLUDED.min_stock,
            updated_at = NOW();
        `;
      }

      for (const t of transactions) {
        await sql`
          INSERT INTO silvio_transactions (id, type, description, value, date, category, product_id, qty)
          VALUES (${t.id}, ${t.type}, ${t.description || ''}, ${t.value || 0}, ${t.date || new Date().toISOString().substring(0, 10)}, ${t.category || ''}, ${t.productId || null}, ${t.qty || 1})
          ON CONFLICT (id) DO NOTHING;
        `;
      }

      for (const e of stockEntries) {
        await sql`
          INSERT INTO silvio_stock_entries (id, type, product_id, product_name, category, qty, cost_price, selling_price, date, tx_id)
          VALUES (${e.id}, ${e.type || 'reabastecimiento'}, ${e.productId || null}, ${e.productName || ''}, ${e.category || ''}, ${e.qty || 0}, ${e.costPrice || 0}, ${e.sellingPrice || 0}, ${e.date || new Date().toISOString()}, ${e.txId || null})
          ON CONFLICT (id) DO NOTHING;
        `;
      }

      for (const l of loans) {
        await sql`
          INSERT INTO silvio_loans (id, client_name, total_amount, remaining_amount, loan_date, due_date, status, payments)
          VALUES (${l.id}, ${l.clientName || 'Cliente'}, ${l.totalAmount || 0}, ${l.remainingAmount || 0}, ${l.loanDate || ''}, ${l.dueDate || ''}, ${l.status || 'activo'}, ${JSON.stringify(l.payments || [])})
          ON CONFLICT (id) DO UPDATE SET
            total_amount = EXCLUDED.total_amount,
            remaining_amount = EXCLUDED.remaining_amount,
            status = EXCLUDED.status,
            payments = EXCLUDED.payments;
        `;
      }

      return res.status(200).json({ success: true, message: 'Datos sincronizados exitosamente en Neon' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('Error en /api/data:', err);
    return res.status(500).json({ error: err.message });
  }
};
