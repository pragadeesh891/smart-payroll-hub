import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
  Zap,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, PayrollRule } from '@/lib/api';

const ruleTypeConfig = {
  tax: { label: 'Tax', color: 'bg-warning/10 text-warning' },
  bonus: { label: 'Bonus', color: 'bg-success/10 text-success' },
  deduction: { label: 'Deduction', color: 'bg-destructive/10 text-destructive' },
  overtime: { label: 'Overtime', color: 'bg-info/10 text-info' },
};

export function AutomationRules() {
  const [localToggles, setLocalToggles] = useState<Record<string, boolean>>({});

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: api.getRules,
  });

  const toggleRuleStatus = (ruleId: string, currentStatus: boolean) => {
    setLocalToggles((prev) => ({
      ...prev,
      [ruleId]: prev[ruleId] !== undefined ? !prev[ruleId] : !currentStatus,
    }));
  };

  const getRuleStatus = (rule: PayrollRule) => {
    return localToggles[rule.id] !== undefined ? localToggles[rule.id] : rule.isActive;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Automation Rules</h2>
          <p className="text-sm text-muted-foreground">
            Configure rule-based payroll calculations for tax, overtime, bonuses, and deductions
          </p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20 p-4"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent/20">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI-Powered Rule Engine</h3>
            <p className="text-sm text-muted-foreground">
              Rules are evaluated in priority order. Higher priority rules are processed first.
              The AI engine validates rule conflicts and ensures compliance with tax regulations.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {rules.map((rule, index) => {
          const typeConfig = ruleTypeConfig[rule.type as keyof typeof ruleTypeConfig] || ruleTypeConfig.tax;
          const isActive = getRuleStatus(rule);
          
          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className={cn(
                'bg-card rounded-xl border border-border p-5 transition-all duration-300',
                !isActive && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">Priority</span>
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold"
                    >
                      {rule.priority}
                    </motion.span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{rule.name}</h3>
                      <span className={cn('status-badge', typeConfig.color)}>
                        {typeConfig.label}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Condition:</span>
                        <span className="text-foreground">{rule.condition}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Calculation:</span>
                        <span className="text-foreground">{rule.calculation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRuleStatus(rule.id, rule.isActive)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isActive ? (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        Inactive
                      </>
                    )}
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="metric-card">
          <p className="text-sm text-muted-foreground">Total Rules</p>
          <p className="text-2xl font-bold text-foreground">{rules.length}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="metric-card">
          <p className="text-sm text-muted-foreground">Active Rules</p>
          <p className="text-2xl font-bold text-success">
            {rules.filter((r) => getRuleStatus(r)).length}
          </p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="metric-card">
          <p className="text-sm text-muted-foreground">Tax Rules</p>
          <p className="text-2xl font-bold text-warning">
            {rules.filter((r) => r.type === 'tax').length}
          </p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="metric-card">
          <p className="text-sm text-muted-foreground">Deduction Rules</p>
          <p className="text-2xl font-bold text-info">
            {rules.filter((r) => r.type === 'deduction').length}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
