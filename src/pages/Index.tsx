import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { EmployeeManagement } from '@/components/modules/EmployeeManagement';
import { PayrollProcessing } from '@/components/modules/PayrollProcessing';
import { PayslipViewer } from '@/components/modules/PayslipViewer';
import { AutomationRules } from '@/components/modules/AutomationRules';
import { AuditLogs } from '@/components/modules/AuditLogs';
import { AlertsPanel } from '@/components/modules/AlertsPanel';
import { SettingsPanel } from '@/components/modules/SettingsPanel';

const moduleConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of SIMATS Payroll Roll AI system' },
  employees: { title: 'Employee Management', subtitle: 'Manage employee records and information' },
  payroll: { title: 'Payroll Processing', subtitle: 'Process and manage payroll transactions' },
  payslips: { title: 'Payslip Viewer', subtitle: 'View detailed salary breakdowns' },
  rules: { title: 'Automation Rules', subtitle: 'Configure rule-based payroll calculations' },
  logs: { title: 'Audit Logs', subtitle: 'Track system activities and changes' },
  alerts: { title: 'Alerts & Notifications', subtitle: 'View system alerts and notifications' },
  settings: { title: 'Settings', subtitle: 'Configure system preferences' },
};

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'employees':
        return <EmployeeManagement />;
      case 'payroll':
        return <PayrollProcessing />;
      case 'payslips':
        return <PayslipViewer />;
      case 'rules':
        return <AutomationRules />;
      case 'logs':
        return <AuditLogs />;
      case 'alerts':
        return <AlertsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardView />;
    }
  };

  const config = moduleConfig[activeModule] || moduleConfig.dashboard;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={config.title} subtitle={config.subtitle} />
        <main className="flex-1 overflow-auto p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default Index;
