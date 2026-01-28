import express from 'express';
import pg from 'pg';
import cors from 'cors';

const { Pool } = pg;

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY employee_id');
    const employees = result.rows.map(row => ({
      id: row.id.toString(),
      employeeId: row.employee_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      department: row.department,
      position: row.position,
      salary: parseFloat(row.salary),
      joinDate: row.join_date,
      status: row.status,
      bankAccount: row.bank_account,
      taxId: row.tax_id,
    }));
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { employeeId, firstName, lastName, email, department, position, salary, joinDate, status, taxId } = req.body;
    const result = await pool.query(
      `INSERT INTO employees (employee_id, first_name, last_name, email, department, position, salary, join_date, status, tax_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [employeeId, firstName, lastName, email, department, position, salary, joinDate, status || 'active', taxId]
    );
    await pool.query(
      `INSERT INTO audit_logs (action, module, user_id, details, severity) VALUES ($1, $2, $3, $4, $5)`,
      ['Employee Added', 'Employee Management', 'system', `New employee ${firstName} ${lastName} (${employeeId}) added`, 'info']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, department, position, salary, status, taxId } = req.body;
    const result = await pool.query(
      `UPDATE employees SET first_name = $1, last_name = $2, email = $3, department = $4, position = $5, salary = $6, status = $7, tax_id = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *`,
      [firstName, lastName, email, department, position, salary, status, taxId, id]
    );
    await pool.query(
      `INSERT INTO audit_logs (action, module, user_id, details, severity) VALUES ($1, $2, $3, $4, $5)`,
      ['Employee Updated', 'Employee Management', 'system', `Employee ${firstName} ${lastName} updated`, 'info']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payroll', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pr.*, e.first_name, e.last_name 
      FROM payroll_records pr 
      JOIN employees e ON pr.employee_id = e.employee_id 
      ORDER BY pr.period DESC, pr.employee_id
    `);
    const records = result.rows.map(row => ({
      id: row.id.toString(),
      employeeId: row.employee_id,
      employeeName: `${row.first_name} ${row.last_name}`,
      period: row.period,
      basicSalary: parseFloat(row.basic_salary),
      overtime: parseFloat(row.overtime),
      bonus: parseFloat(row.bonus),
      deductions: row.deductions || [],
      taxAmount: parseFloat(row.tax_amount),
      netSalary: parseFloat(row.net_salary),
      status: row.status,
      processedAt: row.processed_at,
      paidAt: row.paid_at,
    }));
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payroll/process', async (req, res) => {
  try {
    const { employeeId, period } = req.body;
    const empResult = await pool.query('SELECT * FROM employees WHERE employee_id = $1', [employeeId]);
    if (empResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const emp = empResult.rows[0];
    const monthlyBase = parseFloat(emp.salary) / 12;
    const taxRate = monthlyBase > 10000 ? 0.22 : monthlyBase > 5000 ? 0.15 : 0.10;
    const taxAmount = monthlyBase * taxRate;
    const insurance = 250;
    const retirement = monthlyBase * 0.05;
    const deductions = [
      { type: 'tax', name: 'Federal Tax', amount: Math.round(taxAmount * 100) / 100 },
      { type: 'insurance', name: 'Health Insurance', amount: insurance },
      { type: 'retirement', name: '401(k)', amount: Math.round(retirement * 100) / 100 },
    ];
    const netSalary = monthlyBase - taxAmount - insurance - retirement;
    const result = await pool.query(
      `INSERT INTO payroll_records (employee_id, period, basic_salary, overtime, bonus, deductions, tax_amount, net_salary, status, processed_at) 
       VALUES ($1, $2, $3, 0, 0, $4, $5, $6, 'processed', CURRENT_TIMESTAMP) RETURNING *`,
      [employeeId, period, monthlyBase, JSON.stringify(deductions), taxAmount, netSalary]
    );
    await pool.query(
      `INSERT INTO audit_logs (action, module, user_id, details, severity) VALUES ($1, $2, $3, $4, $5)`,
      ['Payroll Processed', 'Payroll Processing', 'system', `Payroll processed for ${emp.first_name} ${emp.last_name} - ${period}`, 'info']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/payroll/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE payroll_records SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rules', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payroll_rules ORDER BY priority');
    const rules = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      type: row.type,
      condition: row.condition,
      calculation: row.calculation,
      priority: row.priority,
      isActive: row.is_active,
    }));
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/audit-logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
    const logs = result.rows.map(row => ({
      id: row.id.toString(),
      timestamp: row.created_at,
      action: row.action,
      module: row.module,
      userId: row.user_id,
      details: row.details,
      severity: row.severity,
    }));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
    const alerts = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      message: row.message,
      type: row.type,
      isRead: row.is_read,
      createdAt: row.created_at,
    }));
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const empCount = await pool.query('SELECT COUNT(*) as count FROM employees');
    const avgSalary = await pool.query('SELECT AVG(salary) as avg FROM employees');
    const totalPayroll = await pool.query("SELECT SUM(net_salary) as total FROM payroll_records WHERE status = 'paid'");
    const pendingPayrolls = await pool.query("SELECT COUNT(*) as count FROM payroll_records WHERE status = 'pending'");
    const deptStats = await pool.query('SELECT department, COUNT(*) as count FROM employees GROUP BY department');
    const monthlyTrend = await pool.query(`
      SELECT period, SUM(net_salary) as total 
      FROM payroll_records 
      GROUP BY period 
      ORDER BY period DESC 
      LIMIT 6
    `);
    res.json({
      totalEmployees: parseInt(empCount.rows[0].count),
      averageSalary: parseFloat(avgSalary.rows[0].avg) || 0,
      monthlyPayroll: parseFloat(totalPayroll.rows[0].total) || 0,
      pendingPayrolls: parseInt(pendingPayrolls.rows[0].count),
      departmentStats: deptStats.rows.map(r => ({ name: r.department, value: parseInt(r.count) })),
      monthlyTrend: monthlyTrend.rows.map(r => ({ month: r.period, total: parseFloat(r.total) })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT department FROM employees ORDER BY department');
    res.json(result.rows.map(r => r.department));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

pool.query('SELECT 1').then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Database connection error:', err.message);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
