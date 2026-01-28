import { useQuery } from '@tanstack/react-query';
import { Users, DollarSign, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { PayrollChart } from './PayrollChart';
import { RecentActivity } from './RecentActivity';
import { DepartmentBreakdown } from './DepartmentBreakdown';
import { api } from '@/lib/api';

export function DashboardView() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    refetchInterval: 30000,
  });

  const { data: auditLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: api.getAuditLogs,
    refetchInterval: 30000,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: api.getEmployees,
  });

  const { data: payroll = [] } = useQuery({
    queryKey: ['payroll'],
    queryFn: api.getPayroll,
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalEmployees = stats?.totalEmployees || employees.length;
  const totalPayroll = stats?.monthlyPayroll || payroll.reduce((sum, r) => sum + r.netSalary, 0);
  const avgSalary = stats?.averageSalary || (employees.reduce((sum, e) => sum + e.salary, 0) / (totalEmployees || 1));
  const pendingPayrolls = stats?.pendingPayrolls || payroll.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayrollChart />
        <DepartmentBreakdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <RecentActivity logs={auditLogs.map(log => ({
          ...log,
          severity: log.severity as 'info' | 'warning' | 'error' | 'critical'
        }))} />
      </div>
    </div>
  );
}
