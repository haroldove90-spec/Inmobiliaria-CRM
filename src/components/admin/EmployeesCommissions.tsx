import React, { useState } from 'react';
import { Users, Percent, Shield, Edit3, Check, UserPlus, Eye, Mail, Phone } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeesCommissionsProps {
  employees: Employee[];
  onUpdateEmployee: (updated: Employee) => void;
  onAddEmployee: (newEmp: Employee) => void;
}

export const EmployeesCommissions: React.FC<EmployeesCommissionsProps> = ({
  employees,
  onUpdateEmployee,
  onAddEmployee,
}) => {
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    name: '',
    roleTitle: 'Asesor Comercial Residencial',
    roleType: 'agent' as 'admin' | 'agent' | 'coordinator',
    email: '',
    phone: '',
    agreedCommissionPercent: 45,
    officeSplitPercent: 55,
    canViewAllPipelines: false,
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;
    onUpdateEmployee(editingEmp);
    setEditingEmp(null);
  };

  const handleCreateEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpForm.name || !newEmpForm.email) return;

    const emp: Employee = {
      id: `emp-${Date.now()}`,
      name: newEmpForm.name,
      roleTitle: newEmpForm.roleTitle,
      roleType: newEmpForm.roleType,
      email: newEmpForm.email,
      phone: newEmpForm.phone || '+52 55 0000 0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      activePortfolioCount: 0,
      monthlySalesMxn: 0,
      agreedCommissionPercent: newEmpForm.agreedCommissionPercent,
      officeSplitPercent: 100 - newEmpForm.agreedCommissionPercent,
      active: true,
      canViewAllPipelines: newEmpForm.canViewAllPipelines,
    };

    onAddEmployee(emp);
    setShowAddModal(false);
    setNewEmpForm({
      name: '',
      roleTitle: 'Asesor Comercial Residencial',
      roleType: 'agent',
      email: '',
      phone: '',
      agreedCommissionPercent: 45,
      officeSplitPercent: 55,
      canViewAllPipelines: false,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Empleados & Comisiones
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Directorio activo, políticas de split por comisión y control de accesos
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Agregar Colaborador</span>
        </button>
      </div>

      {/* Directory Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Colaborador / Puesto</th>
                <th className="py-3.5 px-4">Cartera Activa</th>
                <th className="py-3.5 px-4">Ventas del Mes</th>
                <th className="py-3.5 px-4">Comisión Asignada</th>
                <th className="py-3.5 px-4">Permisos</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          {emp.name}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{emp.roleTitle}</span>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {emp.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {emp.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {emp.activePortfolioCount} Inmuebles
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {formatCurrency(emp.monthlySalesMxn)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Percent className="w-3 h-3 text-emerald-600" />
                        {emp.agreedCommissionPercent}% Asesor / {emp.officeSplitPercent}% Oficina
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {emp.canViewAllPipelines ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <Eye className="w-3 h-3" /> Global
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        <Shield className="w-3 h-3 text-slate-400" /> Solo Propia Cartera
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setEditingEmp({ ...emp })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Editar Acuerdos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Employee Commissions & Permissions */}
      {editingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Percent className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Pacto de Comisiones & Permisos</h3>
              </div>
              <button
                onClick={() => setEditingEmp(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Colaborador</span>
                <div className="text-base font-bold text-slate-900">{editingEmp.name}</div>
                <div className="text-xs text-slate-500">{editingEmp.roleTitle}</div>
              </div>

              {/* Slider / input for Commission split */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Porcentaje Asignado al Asesor ({editingEmp.agreedCommissionPercent}%)
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={editingEmp.agreedCommissionPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditingEmp({
                      ...editingEmp,
                      agreedCommissionPercent: val,
                      officeSplitPercent: 100 - val,
                    });
                  }}
                  className="w-full accent-blue-700 cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Asesor: {editingEmp.agreedCommissionPercent}%</span>
                  <span>Oficina / Agencia: {editingEmp.officeSplitPercent}%</span>
                </div>
              </div>

              {/* Inmuebles en Cartera */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Inmuebles Asignados en Cartera
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingEmp.activePortfolioCount}
                  onChange={(e) =>
                    setEditingEmp({ ...editingEmp, activePortfolioCount: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Permisos de Visualización */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-bold text-slate-800">
                    Visibilidad Global de Pipelines
                  </span>
                  <span className="text-xs text-slate-500">
                    Permite ver las oportunidades de otros agentes
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editingEmp.canViewAllPipelines}
                  onChange={(e) =>
                    setEditingEmp({ ...editingEmp, canViewAllPipelines: e.target.checked })
                  }
                  className="w-5 h-5 accent-blue-700 rounded cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Collaborator */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">Registrar Nuevo Colaborador</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmp} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Lic. Gabriel Morales"
                  value={newEmpForm.name}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Rol en Sistema
                  </label>
                  <select
                    value={newEmpForm.roleType}
                    onChange={(e) =>
                      setNewEmpForm({
                        ...newEmpForm,
                        roleType: e.target.value as 'admin' | 'agent' | 'coordinator',
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="agent">Asesor Inmobiliario</option>
                    <option value="coordinator">Coordinador de Leads</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Título de Puesto
                  </label>
                  <input
                    type="text"
                    value={newEmpForm.roleTitle}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="asesor@inmocrm.mx"
                    value={newEmpForm.email}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Teléfono Celular
                  </label>
                  <input
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={newEmpForm.phone}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Comisión Pactada del Asesor: {newEmpForm.agreedCommissionPercent}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={newEmpForm.agreedCommissionPercent}
                  onChange={(e) =>
                    setNewEmpForm({
                      ...newEmpForm,
                      agreedCommissionPercent: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-700"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-sm"
                >
                  Registrar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
