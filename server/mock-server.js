import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock Data
let employees = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    salary: 95000,
    joinDate: '2021-03-15',
    status: 'active',
    taxId: 'TX-001-234',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 75000,
    joinDate: '2020-08-22',
    status: 'active',
    taxId: 'TX-002-567',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 85000,
    joinDate: '2019-11-01',
    status: 'active',
    taxId: 'TX-003-890',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'James',
    lastName: 'Williams',
    email: 'james.williams@company.com',
    department: 'HR',
    position: 'HR Specialist',
    salary: 62000,
    joinDate: '2022-01-10',
    status: 'on-leave',
    taxId: 'TX-004-123',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'Amanda',
    lastName: 'Taylor',
    email: 'amanda.taylor@company.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    salary: 88000,
    joinDate: '2021-07-18',
    status: 'active',
    taxId: 'TX-005-456',
  },
  {
    id: '6',
    employeeId: 'EMP006',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@company.com',
    department: 'Sales',
    position: 'Sales Executive',
    salary: 70000,
    joinDate: '2020-04-05',
    status: 'active',
    taxId: 'TX-006-789',
  },
];

let payrollRecords = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'Sarah Johnson',
    period: '2024-01',
    basicSalary: 7916.67,
    overtime: 450,
    bonus: 500,
    deductions: [
      { type: 'tax', name: 'Federal Tax', amount: 1583.33 },
      { type: 'insurance', name: 'Health Insurance', amount: 250 },
      { type: 'retirement', name: '401(k)', amount: 395.83 },
    ],
    taxAmount: 1583.33,
    netSalary: 6637.51,
    status: 'paid',
    processedAt: '2024-01-28T10:30:00Z',
    paidAt: '2024-01-31T09:00:00Z',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Michael Chen',
    period: '2024-01',
    basicSalary: 6250,
    overtime: 0,
    bonus: 0,
    deductions: [
      { type: 'tax', name: 'Federal Tax', amount: 1250 },
      { type: 'insurance', name: 'Health Insurance', amount: 200 },
      { type: 'retirement', name: '401(k)', amount: 312.5 },
    ],
    taxAmount: 1250,
    netSalary: 4487.5,
    status: 'processed',
    processedAt: '2024-01-28T10:35:00Z',
  },
];

let rules = [
  { id: '1', name: 'Federal Tax Calculation', type: 'tax', condition: 'All employees', calculation: 'Progressive tax based on income brackets', priority: 1, isActive: true },
  { id: '2', name: 'Overtime Rate', type: 'overtime', condition: 'Hours > 40 per week', calculation: '1.5x hourly rate', priority: 2, isActive: true },
];

let auditLogs = [
  { id: '1', timestamp: new Date().toISOString(), action: 'System Started', module: 'System', userId: 'admin', details: 'Mock server started successfully', severity: 'info' },
];

let alerts = [
  { id: '1', title: 'Welcome', message: 'Welcome to the SIMATS Payroll AI Dashboard', type: 'info', isRead: false, createdAt: new Date().toISOString() },
];

// Endpoints
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/api/employees', (req, res) => res.json(employees));
app.post('/api/employees', (req, res) => {
  const newEmp = { ...req.body, id: (employees.length + 1).toString() };
  employees.push(newEmp);
  res.status(201).json(newEmp);
});

app.get('/api/payroll', (req, res) => res.json(payrollRecords));
app.post('/api/payroll/process', (req, res) => {
    const { employeeId, period } = req.body;
    const emp = employees.find(e => e.employeeId === employeeId);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const newRecord = {
        id: (payrollRecords.length + 1).toString(),
        employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        period,
        basicSalary: emp.salary / 12,
        overtime: 0,
        bonus: 0,
        deductions: [],
        taxAmount: 0,
        netSalary: emp.salary / 12,
        status: 'processed',
        processedAt: new Date().toISOString()
    };
    payrollRecords.push(newRecord);
    res.status(201).json(newRecord);
});

app.get('/api/rules', (req, res) => res.json(rules));
app.get('/api/audit-logs', (req, res) => res.json(auditLogs));
app.get('/api/alerts', (req, res) => res.json(alerts));
app.get('/api/departments', (req, res) => res.json(['Engineering', 'Finance', 'Marketing', 'HR', 'Sales']));

app.get('/api/stats', (req, res) => {
  const totalEmployees = employees.length;
  const averageSalary = employees.reduce((sum, e) => sum + e.salary, 0) / totalEmployees;
  const monthlyPayroll = payrollRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const pendingPayrolls = payrollRecords.filter(r => r.status === 'pending').length;
  
  res.json({
    totalEmployees,
    averageSalary,
    monthlyPayroll,
    pendingPayrolls,
    departmentStats: [
      { name: 'Engineering', value: employees.filter(e => e.department === 'Engineering').length },
      { name: 'Finance', value: employees.filter(e => e.department === 'Finance').length },
    ],
    monthlyTrend: [
      { month: 'Jan', total: monthlyPayroll },
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock Server running on http://0.0.0.0:${PORT}`);
});
