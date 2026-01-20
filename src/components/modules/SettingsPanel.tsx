import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Globe,
  Palette,
  Key,
  ToggleRight,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsSections = [
  {
    title: 'Account',
    icon: User,
    items: [
      { name: 'Profile Settings', description: 'Update your personal information' },
      { name: 'Password & Security', description: 'Manage your password and 2FA' },
      { name: 'Session Management', description: 'View and manage active sessions' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { name: 'Email Notifications', description: 'Configure email alert preferences' },
      { name: 'Push Notifications', description: 'Manage browser notifications' },
      { name: 'Alert Thresholds', description: 'Set custom alert triggers' },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { name: 'Access Control', description: 'Manage user roles and permissions' },
      { name: 'Audit Settings', description: 'Configure audit log retention' },
      { name: 'Encryption', description: 'Data encryption settings' },
    ],
  },
  {
    title: 'Data Management',
    icon: Database,
    items: [
      { name: 'Backup & Recovery', description: 'Automatic backup configuration' },
      { name: 'Data Export', description: 'Export payroll data' },
      { name: 'Data Retention', description: 'Configure data retention policies' },
    ],
  },
  {
    title: 'Integrations',
    icon: Globe,
    items: [
      { name: 'Bank Connections', description: 'Manage bank account integrations' },
      { name: 'Tax Services', description: 'Connect to tax filing services' },
      { name: 'HRIS Integration', description: 'Sync with HR systems' },
    ],
  },
];

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account, security, and system preferences
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <section.icon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>
            <div className="divide-y divide-border">
              {section.items.map((item, itemIndex) => (
                <button
                  key={item.name}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Quick Settings</h3>
        <div className="space-y-4">
          {[
            { name: 'Auto-process payroll', enabled: true },
            { name: 'Email notifications', enabled: true },
            { name: 'Two-factor authentication', enabled: false },
            { name: 'API access', enabled: true },
          ].map((toggle) => (
            <div key={toggle.name} className="flex items-center justify-between">
              <span className="text-foreground">{toggle.name}</span>
              <button
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  toggle.enabled ? 'bg-primary' : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform shadow',
                    toggle.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
