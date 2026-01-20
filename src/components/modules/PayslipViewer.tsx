import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  DollarSign,
  TrendingDown,
  Award,
  Clock,
  Building,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockPayrollRecords, mockEmployees } from '@/data/mockData';

export function PayslipViewer() {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const [expandedSection, setExpandedSection] = useState<string | null>('earnings');

  const payrollRecord = mockPayrollRecords.find((r) => r.employeeId === selectedEmployee.employeeId);
  
  const totalDeductions = payrollRecord?.deductions.reduce((sum, d) => sum + d.amount, 0) || 0;
  const grossPay = (payrollRecord?.basicSalary || 0) + (payrollRecord?.overtime || 0) + (payrollRecord?.bonus || 0);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Employee Selection */}
      <div className="lg:col-span-1">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Select Employee</h3>
          <div className="space-y-2">
            {mockEmployees.filter(e => e.status === 'active').map((employee) => (
              <button
                key={employee.id}
                onClick={() => setSelectedEmployee(employee)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                  selectedEmployee.id === employee.id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-muted border border-transparent'
                )}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payslip Details */}
      <div className="lg:col-span-2">
        <motion.div
          key={selectedEmployee.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Payslip</h2>
                <p className="text-white/80">Period: January 2024</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-white/70">Employee</p>
                <p className="font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                <p className="text-sm text-white/70">{selectedEmployee.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Department</p>
                <p className="font-semibold">{selectedEmployee.department}</p>
                <p className="text-sm text-white/70">{selectedEmployee.position}</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-muted/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Gross Pay</p>
              <p className="text-xl font-bold text-foreground">
                ${grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Deductions</p>
              <p className="text-xl font-bold text-destructive">
                -${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Net Pay</p>
              <p className="text-xl font-bold text-success">
                ${payrollRecord?.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="p-6 space-y-4">
            {/* Earnings Section */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('earnings')}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <DollarSign className="w-5 h-5 text-success" />
                  </div>
                  <span className="font-semibold text-foreground">Earnings</span>
                </div>
                {expandedSection === 'earnings' ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {expandedSection === 'earnings' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-border p-4 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Basic Salary</span>
                    <span className="font-medium text-foreground">
                      ${payrollRecord?.basicSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overtime Pay</span>
                    <span className="font-medium text-foreground">
                      ${payrollRecord?.overtime.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Performance Bonus</span>
                    <span className="font-medium text-foreground">
                      ${payrollRecord?.bonus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Deductions Section */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('deductions')}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="font-semibold text-foreground">Deductions</span>
                </div>
                {expandedSection === 'deductions' ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {expandedSection === 'deductions' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-border p-4 space-y-3"
                >
                  {payrollRecord?.deductions.map((deduction, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-muted-foreground">{deduction.name}</span>
                      <span className="font-medium text-destructive">
                        -${deduction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Tax Information Section */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('tax')}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <FileText className="w-5 h-5 text-warning" />
                  </div>
                  <span className="font-semibold text-foreground">Tax Information</span>
                </div>
                {expandedSection === 'tax' ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {expandedSection === 'tax' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-border p-4 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ID</span>
                    <span className="font-medium text-foreground">{selectedEmployee.taxId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax Bracket</span>
                    <span className="font-medium text-foreground">22%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">YTD Tax Paid</span>
                    <span className="font-medium text-foreground">
                      ${((payrollRecord?.taxAmount || 0) * 12).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
