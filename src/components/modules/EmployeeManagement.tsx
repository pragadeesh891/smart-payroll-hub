import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreVertical,
  Mail,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, Employee } from '@/lib/api';

const statusColors = {
  active: 'status-success',
  inactive: 'status-error',
  'on-leave': 'status-warning',
};

export function EmployeeManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    position: '',
    salary: 0,
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active' as const,
    taxId: '',
  });

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: api.getEmployees,
  });

  const addMutation = useMutation({
    mutationFn: (data: Omit<Employee, 'id'>) => api.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setShowAddModal(false);
      setNewEmployee({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        department: 'Engineering',
        position: '',
        salary: 0,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        taxId: '',
      });
    },
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const departments = ['all', ...new Set(employees.map((e) => e.department))];

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(newEmployee);
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
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="input-field w-40"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
                >
                  <span className="text-lg font-semibold text-white">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </span>
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={cn('status-badge', statusColors[employee.status])}>
                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
              </span>
              <motion.span 
                className="text-lg font-bold text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ${employee.salary.toLocaleString()}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
        <div className="flex items-center gap-2">
          <button className="btn-secondary p-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 text-sm text-foreground">1 of 1</span>
          <button className="btn-secondary p-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Add New Employee</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Employee ID (e.g., EMP007)"
                  value={newEmployee.employeeId}
                  onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  className="input-field"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="input-field"
                  >
                    <option>Engineering</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>HR</option>
                    <option>Sales</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Salary"
                    value={newEmployee.salary || ''}
                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>
                <button type="submit" disabled={addMutation.isPending} className="btn-primary w-full">
                  {addMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Add Employee'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
