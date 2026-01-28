const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getEmployees: () => fetchApi<Employee[]>('/employees'),
  
  createEmployee: (data: Omit<Employee, 'id'>) => 
    fetchApi<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  updateEmployee: (id: string, data: Partial<Employee>) =>
    fetchApi<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  deleteEmployee: (id: string) =>
    fetchApi<{ success: boolean }>(`/employees/${id}`, {
      method: 'DELETE',
    }),

  getPayroll: () => fetchApi<PayrollRecord[]>('/payroll'),
  
  processPayroll: (employeeId: string, period: string) =>
    fetchApi<PayrollRecord>('/payroll/process', {
      method: 'POST',
      body: JSON.stringify({ employeeId, period }),
    }),
    
  markAsPaid: (id: string) =>
    fetchApi<PayrollRecord>(`/payroll/${id}/pay`, {
      method: 'PATCH',
    }),

  getRules: () => fetchApi<PayrollRule[]>('/rules'),
  
  getAuditLogs: () => fetchApi<AuditLog[]>('/audit-logs'),
  
  getAlerts: () => fetchApi<Alert[]>('/alerts'),
  
  getStats: () => fetchApi<DashboardStats>('/stats'),
  
  getDepartments: () => fetchApi<string[]>('/departments'),
};

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
  employeeName?: string;
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

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  averageSalary: number;
  monthlyPayroll: number;
  pendingPayrolls: number;
  departmentStats: { name: string; value: number }[];
  monthlyTrend: { month: string; total: number }[];
}
