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
      const loan = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await sql`
        INSERT INTO silvio_loans (id, client_name, total_amount, remaining_amount, loan_date, due_date, status, payments)
        VALUES (${loan.id}, ${loan.clientName}, ${Number(loan.totalAmount) || 0}, ${Number(loan.remainingAmount) || 0}, ${loan.loanDate || ''}, ${loan.dueDate || ''}, ${loan.status || 'activo'}, ${JSON.stringify(loan.payments || [])})
        ON CONFLICT (id) DO UPDATE SET
          client_name = EXCLUDED.client_name,
          total_amount = EXCLUDED.total_amount,
          remaining_amount = EXCLUDED.remaining_amount,
          due_date = EXCLUDED.due_date,
          status = EXCLUDED.status,
          payments = EXCLUDED.payments;
      `;
      return res.status(200).json({ success: true, connected: true });
    }

    if (req.method === 'DELETE') {
      const { id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await sql`DELETE FROM silvio_loans WHERE id = ${id}`;
      return res.status(200).json({ success: true, connected: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('Error en /api/loan:', err);
    return res.status(500).json({ error: err.message });
  }
};
