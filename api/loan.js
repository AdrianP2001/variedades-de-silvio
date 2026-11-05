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
      const client = loan.client || loan.clientName || 'Cliente';
      const amount = Number(loan.amount) || 0;
      const interest = Number(loan.interest) || 0;
      const total = Number(loan.total) || Number(loan.totalAmount) || 0;
      const paid = Number(loan.paid) || 0;
      const remaining = loan.remainingAmount !== undefined && !isNaN(Number(loan.remainingAmount)) ? Number(loan.remainingAmount) : Math.max(0, total - paid);
      const date = loan.date || loan.loanDate || new Date().toISOString().substring(0, 10);
      const days = Number(loan.days) || 1;
      const frequency = loan.frequency || 'diaria';
      const status = loan.status || 'active';
      const payments = Array.isArray(loan.payments) ? loan.payments : [];

      await sql`
        INSERT INTO silvio_loans (
          id, client, client_name, amount, interest, total, total_amount,
          days, frequency, paid, remaining_amount, date, loan_date, due_date, status, payments
        )
        VALUES (
          ${loan.id}, ${client}, ${client}, ${amount}, ${interest}, ${total}, ${total},
          ${days}, ${frequency}, ${paid}, ${remaining}, ${date}, ${date}, ${loan.dueDate || ''}, ${status}, ${JSON.stringify(payments)}
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
