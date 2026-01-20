import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PayrollRule } from '@/types/payroll';
import { mockPayrollRules } from '@/data/mockData';

const ruleTypeConfig = {
  tax: { label: 'Tax', color: 'bg-warning/10 text-warning' },
  bonus: { label: 'Bonus', color: 'bg-success/10 text-success' },
  deduction: { label: 'Deduction', color: 'bg-destructive/10 text-destructive' },
  overtime: { label: 'Overtime', color: 'bg-info/10 text-info' },
};

export function AutomationRules() {
  const [rules, setRules] = useState<PayrollRule[]>(mockPayrollRules);
  const [editingRule, setEditingRule] = useState<string | null>(null);

  const toggleRuleStatus = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Rule Info Banner */}
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

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule, index) => {
          const typeConfig = ruleTypeConfig[rule.type];
          
          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'bg-card rounded-xl border border-border p-5 transition-all duration-300',
                !rule.isActive && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">Priority</span>
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {rule.priority}
                    </span>
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
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      rule.isActive
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {rule.isActive ? (
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

      {/* Rule Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Total Rules</p>
          <p className="text-2xl font-bold text-foreground">{rules.length}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Active Rules</p>
          <p className="text-2xl font-bold text-success">
            {rules.filter((r) => r.isActive).length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Tax Rules</p>
          <p className="text-2xl font-bold text-warning">
            {rules.filter((r) => r.type === 'tax').length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted-foreground">Deduction Rules</p>
          <p className="text-2xl font-bold text-info">
            {rules.filter((r) => r.type === 'deduction').length}
          </p>
        </div>
      </div>
    </div>
  );
}
