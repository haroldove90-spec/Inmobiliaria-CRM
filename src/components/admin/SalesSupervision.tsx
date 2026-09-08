import React, { useState } from 'react';
import { BadgeDollarSign, Calendar, FileCheck, CheckCircle2, AlertCircle, Plus, ShieldCheck } from 'lucide-react';
import { Deal, Employee } from '../../types';

interface SalesSupervisionProps {
  deals: Deal[];
  employees: Employee[];
  onUpdateDeal: (deal: Deal) => void;
  onAddDeal: (deal: Deal) => void;
}

export const SalesSupervision: React.FC<SalesSupervisionProps> = ({
  deals,
  employees,
  onUpdateDeal,
  onAddDeal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    propertyTitle: '',
    propertyZone: 'Polanco V Sección',
    agentId: employees.find((e) => e.roleType === 'agent')?.id || 'emp-2',
    clientName: '',
    clientPhone: '',
    saleAmountMxn: 10000000,
    downPaymentMxn: 2000000,
    reserveDepositMxn: 250000,
    notaryNumber: 'Notaría Pública 102',
    notaryCity: 'Ciudad de México',
    estimatedSigningDate: '2026-10-15',
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalSalesInPipeline = deals.reduce((acc, d) => acc + d.saleAmountMxn, 0);
  const totalReservesDeposited = deals.reduce((acc, d) => acc + d.reserveDepositMxn, 0);
  const totalDownPayments = deals.reduce((acc, d) => acc + d.downPaymentMxn, 0);

  const getStatusBadge = (status: Deal['status']) => {
    switch (status) {
      case 'en_apartado':
        return { label: 'Apartado Vigente', class: 'bg-blue-100 text-blue-900 border-blue-200' };
      case 'dictamen_notarial':
        return { label: 'En Dictamen Notarial', class: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'firma_programada':
        return { label: 'Firma Programada', class: 'bg-purple-100 text-purple-900 border-purple-200' };
      case 'escriturada':
        return { label: 'Escriturada & Liquidada', class: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.propertyTitle || !newDeal.clientName) return;

    const selectedAgent = employees.find((e) => e.id === newDeal.agentId);
    const totalComm = newDeal.saleAmountMxn * 0.05;
    const agentSplit = selectedAgent ? selectedAgent.agreedCommissionPercent / 100 : 0.5;

    const created: Deal = {
      id: `deal-${Date.now()}`,
      folio: `CIERRE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: 'prop-custom',
      propertyTitle: newDeal.propertyTitle,
      propertyZone: newDeal.propertyZone,
      agentId: newDeal.agentId,
      agentName: selectedAgent ? selectedAgent.name : 'Asesor Asignado',
      clientName: newDeal.clientName,
      clientPhone: newDeal.clientPhone || '+52 55 0000 0000',
      saleAmountMxn: Number(newDeal.saleAmountMxn),
      downPaymentMxn: Number(newDeal.downPaymentMxn),
      reserveDepositMxn: Number(newDeal.reserveDepositMxn),
      notaryNumber: newDeal.notaryNumber,
      notaryCity: newDeal.notaryCity,
      estimatedSigningDate: newDeal.estimatedSigningDate,
      status: 'en_apartado',
      totalCommissionMxn: totalComm,
      agentCommissionEarnedMxn: totalComm * agentSplit,
      commissionStatus: 'calculada',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onAddDeal(created);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supervisión de Ventas y Finanzas
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Control de anticipos, depósitos en garantía y calendario de firmas notariales
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Operación / Anticipo</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Pipeline Total en Proceso</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{formatCurrency(totalSalesInPipeline)}</div>
          <span className="text-xs text-slate-500">{deals.length} operaciones activas</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Depósitos de Apartado Recibidos</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-800">{formatCurrency(totalReservesDeposited)}</div>
          <span className="text-xs text-emerald-600 font-semibold">Garantías en cuenta concentradora</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Enganches Notariales Acumulados</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">{formatCurrency(totalDownPayments)}</div>
          <span className="text-xs text-slate-500">Fondos aplicados a promesa de compraventa</span>
        </div>
      </div>

      {/* Global Deals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            Bitácora de Operaciones & Fechas Notariales
          </h3>
          <span className="text-xs text-slate-500">Actualización en tiempo real</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Folio / Inmueble</th>
                <th className="py-3 px-4">Asesor a Cargo</th>
                <th className="py-3 px-4">Comprador</th>
                <th className="py-3 px-4">Monto Venta</th>
                <th className="py-3 px-4">Anticipos Recibidos</th>
                <th className="py-3 px-4">Notaría & Fecha Firma</th>
                <th className="py-3 px-4">Estatus</th>
                <th className="py-3 px-4 text-right">Comisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deals.map((deal) => {
                const badge = getStatusBadge(deal.status);
                return (
                  <tr key={deal.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-xs font-mono font-bold text-blue-700 block">
                        {deal.folio}
                      </span>
                      <span className="font-bold text-slate-900 block leading-tight">
                        {deal.propertyTitle}
                      </span>
                      <span className="text-xs text-slate-400">{deal.propertyZone}</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">
                      {deal.agentName}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 block">{deal.clientName}</span>
                      <span className="text-xs text-slate-400">{deal.clientPhone}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {formatCurrency(deal.saleAmountMxn)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs">
                        <span className="block font-semibold text-blue-800">
                          Apartado: {formatCurrency(deal.reserveDepositMxn)}
                        </span>
                        <span className="text-slate-500">
                          Enganche: {formatCurrency(deal.downPaymentMxn)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {deal.estimatedSigningDate}
                        </span>
                        <span className="text-slate-500 block truncate max-w-[180px]">
                          {deal.notaryNumber}, {deal.notaryCity}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={deal.status}
                        onChange={(e) =>
                          onUpdateDeal({
                            ...deal,
                            status: e.target.value as Deal['status'],
                            lastUpdated: new Date().toISOString().split('T')[0],
                          })
                        }
                        className={`text-xs font-bold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${badge.class}`}
                      >
                        <option value="en_apartado">En Apartado</option>
                        <option value="dictamen_notarial">Dictamen Notarial</option>
                        <option value="firma_programada">Firma Programada</option>
                        <option value="escriturada">Escriturada</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-emerald-800 block text-sm">
                        {formatCurrency(deal.totalCommissionMxn)}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Asesor: {formatCurrency(deal.agentCommissionEarnedMxn)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Deal / Advance Deposit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BadgeDollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Registrar Cierre o Depósito de Apartado</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Título de la Propiedad
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Casa en Lomas de Chapultepec"
                  value={newDeal.propertyTitle}
                  onChange={(e) => setNewDeal({ ...newDeal, propertyTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Asesor Responsable
                  </label>
                  <select
                    value={newDeal.agentId}
                    onChange={(e) => setNewDeal({ ...newDeal, agentId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {employees
                      .filter((e) => e.roleType === 'agent')
                      .map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Zona / Ubicación
                  </label>
                  <input
                    type="text"
                    value={newDeal.propertyZone}
                    onChange={(e) => setNewDeal({ ...newDeal, propertyZone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Nombre del Comprador
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ing. Daniel Orozco"
                    value={newDeal.clientName}
                    onChange={(e) => setNewDeal({ ...newDeal, clientName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Teléfono del Comprador
                  </label>
                  <input
                    type="tel"
                    placeholder="+52 55 0000 0000"
                    value={newDeal.clientPhone}
                    onChange={(e) => setNewDeal({ ...newDeal, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Precio Venta ($)
                  </label>
                  <input
                    type="number"
                    value={newDeal.saleAmountMxn}
                    onChange={(e) => setNewDeal({ ...newDeal, saleAmountMxn: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Depósito Apartado ($)
                  </label>
                  <input
                    type="number"
                    value={newDeal.reserveDepositMxn}
                    onChange={(e) => setNewDeal({ ...newDeal, reserveDepositMxn: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Enganche ($)
                  </label>
                  <input
                    type="number"
                    value={newDeal.downPaymentMxn}
                    onChange={(e) => setNewDeal({ ...newDeal, downPaymentMxn: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Notaría Asignada
                  </label>
                  <input
                    type="text"
                    value={newDeal.notaryNumber}
                    onChange={(e) => setNewDeal({ ...newDeal, notaryNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Fecha Estimada de Firma
                  </label>
                  <input
                    type="date"
                    value={newDeal.estimatedSigningDate}
                    onChange={(e) => setNewDeal({ ...newDeal, estimatedSigningDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
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
                  Guardar Operación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
