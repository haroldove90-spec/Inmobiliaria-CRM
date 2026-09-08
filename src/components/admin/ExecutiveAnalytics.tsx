import React from 'react';
import { TrendingUp, DollarSign, Building, Users, ArrowUpRight, ArrowDownRight, Target, Flame } from 'lucide-react';
import { Property, Lead, Deal, Employee } from '../../types';

interface ExecutiveAnalyticsProps {
  properties: Property[];
  leads: Lead[];
  deals: Deal[];
  employees: Employee[];
}

export const ExecutiveAnalytics: React.FC<ExecutiveAnalyticsProps> = ({
  properties,
  leads,
  deals,
  employees,
}) => {
  // Calculations
  const totalSalesMonth = deals.reduce((acc, d) => acc + d.saleAmountMxn, 0);
  const totalCommissions = deals.reduce((acc, d) => acc + d.totalCommissionMxn, 0);
  const activePropertiesCount = properties.filter((p) => p.status === 'publicada' || p.status === 'apartada').length;
  
  // Conversion rate (visitas vs cierres)
  const leadsInVisita = leads.filter((l) => l.stage === 'visita' || l.stage === 'propuesta' || l.stage === 'cierre').length + 8; // historical sample
  const dealsClosed = deals.length;
  const conversionRate = Math.round((dealsClosed / leadsInVisita) * 100);

  // Sales per agent
  const agentPerformance = employees
    .filter((e) => e.roleType === 'agent')
    .map((agent) => {
      const agentDeals = deals.filter((d) => d.agentId === agent.id);
      const totalVolume = agentDeals.reduce((acc, d) => acc + d.saleAmountMxn, 0);
      return {
        id: agent.id,
        name: agent.name,
        avatar: agent.avatar,
        volume: totalVolume,
        dealCount: agentDeals.length,
        sharePercent: totalSalesMonth > 0 ? Math.round((totalVolume / totalSalesMonth) * 100) : 0,
      };
    })
    .sort((a, b) => b.volume - a.volume);

  // Sources stats
  const sourceStats = [
    { label: 'Facebook Ads', count: leads.filter((l) => l.source === 'facebook').length + 18, color: 'bg-blue-600', percent: 34 },
    { label: 'Portales Inmobiliarios', count: leads.filter((l) => l.source === 'portal').length + 14, color: 'bg-indigo-600', percent: 28 },
    { label: 'WhatsApp Directo', count: leads.filter((l) => l.source === 'whatsapp').length + 11, color: 'bg-emerald-600', percent: 22 },
    { label: 'Instagram / Reels', count: leads.filter((l) => l.source === 'instagram').length + 8, color: 'bg-rose-500', percent: 16 },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Ejecutivo & Analítica
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Métricas de alto impacto comercial, comisiones y embudo de conversión
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Septiembre 2026 • En Curso
          </span>
        </div>
      </div>

      {/* Primary KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ventas del Mes
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatCurrency(totalSalesMonth)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+18.4% vs. mes anterior</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Comisiones Generadas
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatCurrency(totalCommissions)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Split 50/50 agencia y asesores</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Inmuebles Activos
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {activePropertiesCount} Propiedades
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {properties.filter((p) => p.status === 'revision').length} pendientes de aprobación
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Conversión Visitas a Cierre
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {conversionRate}%
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {dealsClosed} cierres de {leadsInVisita} citas calificadas
          </div>
        </div>
      </div>

      {/* Grid: Rendimiento por Asesor & Fuentes de Prospección */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendimiento por Asesor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-blue-700" />
              <h3 className="text-lg font-bold text-slate-900">
                Rendimiento por Asesor Comercial
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Volumen Acumulado</span>
          </div>

          <div className="space-y-4">
            {agentPerformance.map((ag) => (
              <div key={ag.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ag.avatar}
                      alt={ag.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <span className="font-semibold text-slate-800">{ag.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{formatCurrency(ag.volume)}</span>
                    <span className="text-xs text-slate-500 block">({ag.dealCount} cierres)</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(ag.sharePercent, 12)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparativo de Fuentes de Prospección */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Fuentes de Prospección
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Total Leads Activos</span>
          </div>

          <div className="space-y-4 pt-1">
            {sourceStats.map((src, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{src.label}</span>
                  <span className="font-bold text-slate-900">
                    {src.count} leads ({src.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${src.color} rounded-full transition-all duration-500`}
                    style={{ width: `${src.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embudo de Conversión */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Embudo de Conversión de Ventas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase">1. Captación</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">54 Leads</div>
            <span className="text-[11px] text-slate-500 font-medium">Redes & Portales</span>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
            <span className="text-xs font-bold text-blue-700 uppercase">2. Calificados</span>
            <div className="text-xl sm:text-2xl font-black text-blue-950 mt-1">32 Clientes</div>
            <span className="text-[11px] text-blue-600 font-medium">Presupuesto validado</span>
          </div>
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200">
            <span className="text-xs font-bold text-indigo-700 uppercase">3. Visitas</span>
            <div className="text-xl sm:text-2xl font-black text-indigo-950 mt-1">19 Citas</div>
            <span className="text-[11px] text-indigo-600 font-medium">Presenciales</span>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-800 uppercase">4. Propuestas</span>
            <div className="text-xl sm:text-2xl font-black text-amber-950 mt-1">8 Cartas</div>
            <span className="text-[11px] text-amber-700 font-medium">Con anticipo garantía</span>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300">
            <span className="text-xs font-bold text-emerald-800 uppercase">5. Cierre Notarial</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">{dealsClosed} Escrituras</div>
            <span className="text-[11px] text-emerald-700 font-semibold">{conversionRate}% efectividad</span>
          </div>
        </div>
      </div>
    </div>
  );
};
