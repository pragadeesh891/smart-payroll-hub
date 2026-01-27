import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calculator,
  FileText,
  Settings,
  Bell,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'payroll', label: 'Payroll Processing', icon: Calculator },
  { id: 'payslips', label: 'Payslips', icon: FileText },
  { id: 'rules', label: 'Automation Rules', icon: ClipboardList },
  { id: 'logs', label: 'Audit Logs', icon: Shield },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-sidebar flex flex-col border-r border-sidebar-border"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
          >
            <h1 className="text-lg font-bold text-sidebar-foreground">SIMATS</h1>
            <p className="text-xs text-sidebar-foreground/60">Payroll Roll AI</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={cn(
              'sidebar-item w-full',
              activeModule === item.id && 'sidebar-item-active'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-sidebar-foreground">AD</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">admin@company.com</p>
            </motion.div>
          )}
          {!collapsed && (
            <button className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
              <LogOut className="w-4 h-4 text-sidebar-foreground/60" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
