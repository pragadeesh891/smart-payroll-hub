import { motion } from 'framer-motion';
import { Activity, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuditLog } from '@/types/payroll';

interface RecentActivityProps {
  logs: AuditLog[];
}

const severityConfig = {
  info: { icon: Info, color: 'text-info', bg: 'bg-info/10' },
  warning: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10' },
  error: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  critical: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function RecentActivity({ logs }: RecentActivityProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {logs.slice(0, 5).map((log, index) => {
          const config = severityConfig[log.severity];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={cn('p-2 rounded-lg', config.bg)}>
                <Icon className={cn('w-4 h-4', config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{log.action}</p>
                <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatTime(log.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
