import { Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { PayrollChart } from './PayrollChart';
import { RecentActivity } from './RecentActivity';
import { DepartmentBreakdown } from './DepartmentBreakdown';
import { mockAuditLogs, mockEmployees, mockPayrollRecords } from '@/data/mockData';

export function DashboardView() {
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter((e) => e.status === 'active').length;
  const totalPayroll = mockPayrollRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const avgSalary = mockEmployees.reduce((sum, e) => sum + e.salary, 0) / totalEmployees;
  const pendingPayrolls = mockPayrollRecords.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          color="primary"
          delay={0}
        />
        <MetricCard
          title="Monthly Payroll"
          value={`$${totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          icon={DollarSign}
          trend={{ value: 5.2, isPositive: true }}
          color="accent"
          delay={0.1}
        />
        <MetricCard
          title="Avg. Salary"
          value={`$${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          trend={{ value: 3.8, isPositive: true }}
          color="success"
          delay={0.2}
        />
        <MetricCard
          title="Pending Payrolls"
          value={pendingPayrolls}
          icon={Clock}
          trend={{ value: 2, isPositive: false }}
          color="warning"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayrollChart />
        <DepartmentBreakdown />
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <RecentActivity logs={mockAuditLogs} />
      </div>
    </div>
  );
}
