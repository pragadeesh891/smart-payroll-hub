import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Download,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PayrollRecord } from '@/types/payroll';
import { mockPayrollRecords, mockEmployees } from '@/data/mockData';

const statusConfig = {
  pending: { label: 'Pending', class: 'status-warning', icon: Clock },
  processed: { label: 'Processed', class: 'status-info', icon: RefreshCw },
  paid: { label: 'Paid', class: 'status-success', icon: CheckCircle },
};

export function PayrollProcessing() {
  const [records] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [processing, setProcessing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find((e) => e.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
  };

  const handleProcessPayroll = () => {
    setProcessing(true);
    setTimeout(() => setProcessing(false), 2000);
  };

  const totalPayroll = records.reduce((sum, r) => sum + r.netSalary, 0);
  const pendingCount = records.filter((r) => r.status === 'pending').length;
  const processedCount = records.filter((r) => r.status === 'processed' || r.status === 'paid').length;

  return (
    <div className="space-y-6">
      {/* AI Assistant Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl border border-primary/20 p-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">AI-Powered Payroll Processing</h3>
            <p className="text-sm text-muted-foreground">
              Automated calculations with rule-based deductions, tax computations, and compliance checks.
            </p>
          </div>
          <button
            onClick={handleProcessPayroll}
            disabled={processing}
            className="btn-primary gap-2"
          >
            {processing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {processing ? 'Processing...' : 'Run Payroll'}
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calculator className="w-4 h-4" />
            Total Payroll
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            Pending
          </div>
          <p className="text-2xl font-bold text-warning">{pendingCount}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CheckCircle className="w-4 h-4" />
            Processed
          </div>
          <p className="text-2xl font-bold text-success">{processedCount}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <AlertCircle className="w-4 h-4" />
            Period
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-lg font-bold text-foreground bg-transparent"
          >
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Payroll Records</h3>
          <button className="btn-secondary gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Employee</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Basic Salary</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Overtime</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Bonus</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Deductions</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Net Salary</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => {
                const config = statusConfig[record.status];
                const StatusIcon = config.icon;
                const totalDeductions = record.deductions.reduce((sum, d) => sum + d.amount, 0);
                
                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="data-table-row"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {getEmployeeName(record.employeeId).split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{getEmployeeName(record.employeeId)}</p>
                          <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium text-foreground">
                      ${record.basicSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right text-foreground">
                      ${record.overtime.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right text-success">
                      +${record.bonus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right text-destructive">
                      -${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-bold text-foreground">
                      ${record.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <span className={cn('status-badge flex items-center gap-1', config.class)}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
