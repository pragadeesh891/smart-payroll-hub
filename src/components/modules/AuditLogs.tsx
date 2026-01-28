import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  Download,
  Calendar,
  User,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, AuditLog } from '@/lib/api';

const severityConfig = {
  info: { icon: Info, color: 'text-info', bg: 'bg-info/10', label: 'Info' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Warning' },
  error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Error' },
  critical: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Critical' },
};

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: api.getAuditLogs,
    refetchInterval: 10000,
  });

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">All Severity</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button className="btn-secondary gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(severityConfig).map(([key, config]) => {
          const count = logs.filter((l) => l.severity === key).length;
          const Icon = config.icon;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-4 cursor-pointer"
              onClick={() => setSelectedSeverity(key)}
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', config.bg)}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground capitalize">{config.label}</p>
                  <p className="text-xl font-bold text-foreground">{count}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Audit Trail</h3>
          <span className="text-sm text-muted-foreground">({filteredLogs.length} entries)</span>
        </div>

        <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
          {filteredLogs.map((log, index) => {
            const config = severityConfig[log.severity as keyof typeof severityConfig] || severityConfig.info;
            const Icon = config.icon;
            const { date, time } = formatTimestamp(log.timestamp);
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={cn('p-2 rounded-lg flex-shrink-0', config.bg)}>
                    <Icon className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{log.action}</h4>
                      <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                        {log.module}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        {log.userId}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {date} at {time}
                      </div>
                    </div>
                  </div>
                  <span className={cn('status-badge flex-shrink-0', config.bg, config.color)}>
                    {config.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
