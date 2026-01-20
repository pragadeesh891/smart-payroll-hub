// Core Payroll Types

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  bankAccount?: string;
  taxId?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  period: string;
  basicSalary: number;
  overtime: number;
  bonus: number;
  deductions: PayrollDeduction[];
  taxAmount: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  processedAt?: string;
  paidAt?: string;
}

export interface PayrollDeduction {
  type: 'tax' | 'insurance' | 'retirement' | 'loan' | 'other';
  name: string;
  amount: number;
  percentage?: number;
}

export interface PayrollRule {
  id: string;
  name: string;
  type: 'tax' | 'bonus' | 'deduction' | 'overtime';
  condition: string;
  calculation: string;
  priority: number;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  userId: string;
  details: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface SystemMetrics {
  totalEmployees: number;
  processedPayrolls: number;
  pendingPayrolls: number;
  totalPayout: number;
  averageSalary: number;
  processingTime: number;
}

export interface TaxSlab {
  minIncome: number;
  maxIncome: number;
  rate: number;
  fixedAmount: number;
}
