const { getSql, ensureTables, getConnectionString } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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

    if (req.method === 'DELETE') {
      await sql`TRUNCATE TABLE silvio_transactions, silvio_stock_entries, silvio_loans, silvio_products CASCADE;`;
      return res.status(200).json({ success: true, message: 'Base de datos en Neon vaciada exitosamente' });
    }

    if (req.method === 'GET') {
      const [products, transactions, stockEntries, loans, categoriesMeta] = await Promise.all([
        sql`SELECT id, name, category, stock, cost_price as "costPrice", selling_price as "sellingPrice", min_stock as "minStock", created_at as "createdAt" FROM silvio_products ORDER BY name ASC`,
        sql`SELECT id, type, description, value, date, category, product_id as "productId", qty, created_at as "createdAt" FROM silvio_transactions ORDER BY date DESC, created_at DESC`,
        sql`SELECT id, type, product_id as "productId", product_name as "productName", category, qty, cost_price as "costPrice", selling_price as "sellingPrice", date, tx_id as "txId" FROM silvio_stock_entries ORDER BY date DESC`,
        sql`SELECT 
              id, 
              COALESCE(client, client_name, 'Cliente') as "client",
              COALESCE(client_name, client, 'Cliente') as "clientName",
              COALESCE(amount, 0) as "amount",
              COALESCE(interest, 0) as "interest",
              COALESCE(total, total_amount, 0) as "total",
              COALESCE(total_amount, total, 0) as "totalAmount",
              COALESCE(days, 1) as "days",
              COALESCE(frequency, 'diaria') as "frequency",
              COALESCE(paid, total_amount - remaining_amount, 0) as "paid",
              COALESCE(remaining_amount, total - paid, 0) as "remainingAmount",
              COALESCE(NULLIF(date, ''), NULLIF(loan_date, ''), TO_CHAR(created_at, 'YYYY-MM-DD')) as "date",
              COALESCE(NULLIF(loan_date, ''), NULLIF(date, ''), '') as "loanDate",
              COALESCE(due_date, '') as "dueDate",
              COALESCE(status, 'active') as "status",
              COALESCE(payments, '[]'::jsonb) as "payments",
              created_at as "createdAt"
            FROM silvio_loans 
            ORDER BY created_at DESC`,
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
            id: l.id,
            client: l.client || l.clientName || 'Cliente',
            clientName: l.client || l.clientName || 'Cliente',
            amount: Number(l.amount) || 0,
            interest: Number(l.interest) || 0,
            total: Number(l.total) || Number(l.totalAmount) || 0,
            totalAmount: Number(l.total) || Number(l.totalAmount) || 0,
            days: Number(l.days) || 1,
            frequency: l.frequency || 'diaria',
            paid: Number(l.paid) || 0,
            remainingAmount: Number(l.remainingAmount) !== undefined && !isNaN(Number(l.remainingAmount)) ? Number(l.remainingAmount) : Math.max(0, (Number(l.total) || 0) - (Number(l.paid) || 0)),
            date: l.date || l.loanDate || new Date().toISOString().substring(0, 10),
            loanDate: l.date || l.loanDate || '',
            dueDate: l.dueDate || '',
            status: l.status || 'active',
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
        const client = l.client || l.clientName || 'Cliente';
        const amount = Number(l.amount) || 0;
        const interest = Number(l.interest) || 0;
        const total = Number(l.total) || Number(l.totalAmount) || 0;
        const paid = Number(l.paid) || 0;
        const remaining = Number(l.remainingAmount) !== undefined && !isNaN(Number(l.remainingAmount)) ? Number(l.remainingAmount) : Math.max(0, total - paid);
        const date = l.date || l.loanDate || new Date().toISOString().substring(0, 10);
        const days = Number(l.days) || 1;
        const frequency = l.frequency || 'diaria';
        const status = l.status || 'active';
        const payments = Array.isArray(l.payments) ? l.payments : [];

        await sql`
          INSERT INTO silvio_loans (
            id, client, client_name, amount, interest, total, total_amount,
            days, frequency, paid, remaining_amount, date, loan_date, due_date, status, payments
          )
          VALUES (
            ${l.id}, ${client}, ${client}, ${amount}, ${interest}, ${total}, ${total},
            ${days}, ${frequency}, ${paid}, ${remaining}, ${date}, ${date}, ${l.dueDate || ''}, ${status}, ${JSON.stringify(payments)}
          )
          ON CONFLICT (id) DO UPDATE SET
            client = EXCLUDED.client,
            client_name = EXCLUDED.client_name,
            amount = EXCLUDED.amount,
            interest = EXCLUDED.interest,
            total = EXCLUDED.total,
            total_amount = EXCLUDED.total_amount,
            days = EXCLUDED.days,
            frequency = EXCLUDED.frequency,
            paid = EXCLUDED.paid,
            remaining_amount = EXCLUDED.remaining_amount,
            date = EXCLUDED.date,
            loan_date = EXCLUDED.loan_date,
            due_date = EXCLUDED.due_date,
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
