import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Settings,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'success',
    title: 'Payroll Processed Successfully',
    message: 'January 2024 payroll for 24 employees has been processed without errors.',
    timestamp: '2024-01-28T10:30:00Z',
    isRead: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Tax Rule Update Required',
    message: 'Federal tax brackets have been updated. Please review and update your tax rules.',
    timestamp: '2024-01-27T15:45:00Z',
    isRead: false,
  },
  {
    id: '3',
    type: 'error',
    title: 'Failed Payment Batch',
    message: '3 salary payments failed due to invalid bank account details.',
    timestamp: '2024-01-27T09:15:00Z',
    isRead: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance on Feb 1st, 2024 from 2:00 AM to 4:00 AM EST.',
    timestamp: '2024-01-25T14:00:00Z',
    isRead: true,
  },
];

const alertConfig = {
  success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
  info: { icon: Info, color: 'text-info', bg: 'bg-info/10', border: 'border-info/30' },
};

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const markAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Alerts & Notifications</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="btn-secondary text-sm"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
          <button className="btn-secondary p-2">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alert Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(alertConfig).map(([key, config]) => {
          const count = alerts.filter((a) => a.type === key).length;
          const Icon = config.icon;
          
          return (
            <div
              key={key}
              className={cn(
                'p-4 rounded-xl border',
                config.bg,
                config.border
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-5 h-5', config.color)} />
                <div>
                  <p className="text-sm capitalize text-foreground font-medium">{key}</p>
                  <p className="text-lg font-bold text-foreground">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'bg-card rounded-xl border p-5 transition-all duration-300',
                alert.isRead ? 'border-border' : `${config.border} ${config.bg}`
              )}
              onClick={() => markAsRead(alert.id)}
            >
              <div className="flex items-start gap-4">
                <div className={cn('p-2 rounded-lg', config.bg)}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    {!alert.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatTime(alert.timestamp)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAlert(alert.id);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}
