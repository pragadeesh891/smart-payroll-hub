import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Comprehensive Mock Data from src/data/mockData.ts
let employees = [
    { id: '1', employeeId: 'EMP001', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@company.com', department: 'Engineering', position: 'Senior Software Engineer', salary: 95000, joinDate: '2021-03-15', status: 'active', taxId: 'TX-001-234' },
    { id: '2', employeeId: 'EMP002', firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@company.com', department: 'Finance', position: 'Financial Analyst', salary: 75000, joinDate: '2020-08-22', status: 'active', taxId: 'TX-002-567' },
    { id: '3', employeeId: 'EMP003', firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.rodriguez@company.com', department: 'Marketing', position: 'Marketing Manager', salary: 85000, joinDate: '2019-11-01', status: 'active', taxId: 'TX-003-890' },
    { id: '4', employeeId: 'EMP004', firstName: 'James', lastName: 'Williams', email: 'james.williams@company.com', department: 'HR', position: 'HR Specialist', salary: 62000, joinDate: '2022-01-10', status: 'on-leave', taxId: 'TX-004-123' },
    { id: '5', employeeId: 'EMP005', firstName: 'Amanda', lastName: 'Taylor', email: 'amanda.taylor@company.com', department: 'Engineering', position: 'DevOps Engineer', salary: 88000, joinDate: '2021-07-18', status: 'active', taxId: 'TX-005-456' },
    { id: '6', employeeId: 'EMP006', firstName: 'David', lastName: 'Kim', email: 'david.kim@company.com', department: 'Sales', position: 'Sales Executive', salary: 70000, joinDate: '2020-04-05', status: 'active', taxId: 'TX-006-789' },
];

let payrollRecords = [
    { id: 'PR001', employeeId: 'EMP001', employeeName: 'Sarah Johnson', period: '2024-01', basicSalary: 7916.67, overtime: 450, bonus: 500, deductions: [{ type: 'tax', name: 'Federal Tax', amount: 1583.33 }, { type: 'insurance', name: 'Health Insurance', amount: 250 }, { type: 'retirement', name: '401(k)', amount: 395.83 }], taxAmount: 1583.33, netSalary: 6637.51, status: 'paid', processedAt: '2024-01-28T10:30:00Z', paidAt: '2024-01-31T09:00:00Z' },
    { id: 'PR002', employeeId: 'EMP002', employeeName: 'Michael Chen', period: '2024-01', basicSalary: 6250, overtime: 0, bonus: 0, deductions: [{ type: 'tax', name: 'Federal Tax', amount: 1250 }, { type: 'insurance', name: 'Health Insurance', amount: 200 }, { type: 'retirement', name: '401(k)', amount: 312.5 }], taxAmount: 1250, netSalary: 4487.5, status: 'processed', processedAt: '2024-01-28T10:35:00Z' },
    { id: 'PR003', employeeId: 'EMP003', employeeName: 'Emily Rodriguez', period: '2024-01', basicSalary: 7083.33, overtime: 200, bonus: 1000, deductions: [{ type: 'tax', name: 'Federal Tax', amount: 1656.67 }, { type: 'insurance', name: 'Health Insurance', amount: 250 }, { type: 'retirement', name: '401(k)', amount: 354.17 }], taxAmount: 1656.67, netSalary: 6022.49, status: 'pending' },
];

let rules = [
    { id: 'RULE001', name: 'Federal Tax Calculation', type: 'tax', condition: 'All employees', calculation: 'Progressive tax based on income brackets', priority: 1, isActive: true },
    { id: 'RULE002', name: 'Overtime Rate', type: 'overtime', condition: 'Hours > 40 per week', calculation: '1.5x hourly rate', priority: 2, isActive: true },
    { id: 'RULE003', name: 'Performance Bonus', type: 'bonus', condition: 'Rating >= 4.5', calculation: '10% of basic salary', priority: 3, isActive: true },
    { id: 'RULE004', name: '401(k) Contribution', type: 'deduction', condition: 'Enrolled employees', calculation: '5% of basic salary', priority: 4, isActive: true },
    { id: 'RULE005', name: 'Health Insurance', type: 'deduction', condition: 'Full-time employees', calculation: 'Fixed amount based on plan', priority: 5, isActive: true },
];

let auditLogs = [
    { id: 'LOG001', timestamp: '2024-01-28T10:30:00Z', action: 'Payroll Processed', module: 'Payroll Processing', userId: 'admin@company.com', details: 'Processed payroll for 24 employees for period 2024-01', severity: 'info' },
    { id: 'LOG002', timestamp: '2024-01-28T09:15:00Z', action: 'Employee Added', module: 'Employee Management', userId: 'hr@company.com', details: 'New employee David Kim (EMP006) added to the system', severity: 'info' },
    { id: 'LOG003', timestamp: '2024-01-27T16:45:00Z', action: 'Rule Modified', module: 'Payroll Rules', userId: 'admin@company.com', details: 'Updated overtime calculation rule from 1.25x to 1.5x', severity: 'warning' },
];

let alerts = [
    { id: '1', title: 'Welcome', message: 'Welcome to the SIMATS Payroll AI Dashboard', type: 'info', isRead: false, createdAt: new Date().toISOString() },
    { id: '2', title: 'System Update', message: 'The payroll system has been updated to the latest version.', type: 'success', isRead: false, createdAt: new Date().toISOString() },
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
        id: `PR${(payrollRecords.length + 1).toString().padStart(3, '0')}`,
        employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        period,
        basicSalary: Math.round((emp.salary / 12) * 100) / 100,
        overtime: 0,
        bonus: 0,
        deductions: [],
        taxAmount: 0,
        netSalary: Math.round((emp.salary / 12) * 100) / 100,
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
            { name: 'Marketing', value: employees.filter(e => e.department === 'Marketing').length },
            { name: 'HR', value: employees.filter(e => e.department === 'HR').length },
            { name: 'Sales', value: employees.filter(e => e.department === 'Sales').length },
        ],
        monthlyTrend: [
            { month: 'Jan', total: monthlyPayroll },
        ]
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mock Server running on http://0.0.0.0:${PORT}`);
});
