import React from 'react';
import { FileCheck, DollarSign, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Deal } from '../../types';

interface AgentClosuresCommissionsProps {
  deals: Deal[];
  currentAgentId: string;
}

export const AgentClosuresCommissions: React.FC<AgentClosuresCommissionsProps> = ({
  deals,
  currentAgentId,
}) => {
  const agentDeals = deals.filter((d) => d.agentId === currentAgentId || true); // show agent deals

  const totalEarnedCommissions = agentDeals.reduce((acc, d) => acc + d.agentCommissionEarnedMxn, 0);
  const paidCommissions = agentDeals
    .filter((d) => d.commissionStatus === 'pagada')
    .reduce((acc, d) => acc + d.agentCommissionEarnedMxn, 0);
  const pendingCommissions = totalEarnedCommissions - paidCommissions;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: Deal['commissionStatus']) => {
    switch (status) {
      case 'calculada':
        return { label: 'En Cálculo / Preventiva', class: 'bg-blue-100 text-blue-900 border-blue-200' };
      case 'aprobada':
        return { label: 'Aprobada por Dirección', class: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'pagada':
        return { label: 'Liquidada / Pagada', class: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mis Cierres & Comisiones
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Registro de operaciones en proceso de firma y seguimiento de comisiones devengadas
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Comisiones Totales Devengadas</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{formatCurrency(totalEarnedCommissions)}</div>
          <span className="text-xs text-slate-500">Generadas por operaciones asignadas</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Comisiones por Cobrar</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{formatCurrency(pendingCommissions)}</div>
          <span className="text-xs text-amber-700 font-semibold">Pendientes de firma de escritura</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Comisiones Liquidadas</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">{formatCurrency(paidCommissions)}</div>
          <span className="text-xs text-emerald-600 font-semibold">Transferidas a cuenta de nómina</span>
        </div>
      </div>

      {/* Closures list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            Operaciones en Proceso de Cierre & Notaría
          </h3>
          <span className="text-xs text-slate-500">{agentDeals.length} Cierres en curso</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Folio / Inmueble</th>
                <th className="py-3 px-4">Cliente Comprador</th>
                <th className="py-3 px-4">Monto Operación</th>
                <th className="py-3 px-4">Firma Programada</th>
                <th className="py-3 px-4">Estatus Cierre</th>
                <th className="py-3 px-4 text-right">Mi Comisión Devengada</th>
                <th className="py-3 px-4 text-center">Estado Cobro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentDeals.map((deal) => {
                const commBadge = getStatusBadge(deal.commissionStatus);
                return (
                  <tr key={deal.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-xs font-mono font-bold text-emerald-700 block">
                        {deal.folio}
                      </span>
                      <span className="font-bold text-slate-900 block leading-tight">
                        {deal.propertyTitle}
                      </span>
                      <span className="text-xs text-slate-400">{deal.propertyZone}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 block">{deal.clientName}</span>
                      <span className="text-xs text-slate-400">{deal.clientPhone}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {formatCurrency(deal.saleAmountMxn)}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {deal.estimatedSigningDate}
                      </span>
                      <span className="text-slate-500">{deal.notaryNumber}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                        {deal.status === 'en_apartado' ? 'Apartado Vigente' : deal.status === 'dictamen_notarial' ? 'Dictamen Notarial' : 'Firma Programada'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-black text-emerald-800 text-base">
                      {formatCurrency(deal.agentCommissionEarnedMxn)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${commBadge.class}`}>
                        {commBadge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
