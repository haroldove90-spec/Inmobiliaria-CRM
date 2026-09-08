import React, { useState } from 'react';
import { Users, UserCheck, RefreshCw, Bell, CheckCircle2, ArrowRight, Shield, Zap } from 'lucide-react';
import { Lead, Employee } from '../../types';

interface LeadDistributionProps {
  leads: Lead[];
  employees: Employee[];
  onAssignLead: (leadId: string, agentId: string) => void;
  selectedLeadForDistribution?: Lead | null;
}

export const LeadDistribution: React.FC<LeadDistributionProps> = ({
  leads,
  employees,
  onAssignLead,
  selectedLeadForDistribution,
}) => {
  const agents = employees.filter((e) => e.roleType === 'agent');
  const unassignedLeads = leads.filter((l) => !l.assignedAgentId);
  const [notificationToast, setNotificationToast] = useState<{ message: string; agentName: string } | null>(null);

  const [targetLeadId, setTargetLeadId] = useState<string>(
    selectedLeadForDistribution?.id || unassignedLeads[0]?.id || ''
  );

  const handleManualAssign = (leadId: string, agentId: string) => {
    const agent = employees.find((e) => e.id === agentId);
    const lead = leads.find((l) => l.id === leadId);
    if (!agent || !lead) return;

    onAssignLead(leadId, agentId);

    // Trigger immediate visual notification toast
    setNotificationToast({
      message: `¡Notificación enviada a WhatsApp y App! Prospecto "${lead.name}" asignado exitosamente.`,
      agentName: agent.name,
    });

    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);
  };

  const handleRoundRobinAssignAll = () => {
    if (unassignedLeads.length === 0 || agents.length === 0) return;

    unassignedLeads.forEach((l, idx) => {
      const assignedAgent = agents[idx % agents.length];
      onAssignLead(l.id, assignedAgent.id);
    });

    setNotificationToast({
      message: `Se distribuyeron ${unassignedLeads.length} prospectos en carrusel rotativo (Round-Robin) equitativamente.`,
      agentName: 'Equipo Comercial',
    });

    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Visual Notification Toast */}
      {notificationToast && (
        <div className="p-4 bg-emerald-700 text-white rounded-2xl shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-300 animate-pulse" />
            <div>
              <span className="font-bold text-sm block">Alerta de Asignación Automática</span>
              <span className="text-xs text-emerald-100">{notificationToast.message}</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white/20 rounded-lg">
            {notificationToast.agentName}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Distribución & Asignación de Leads
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Asignación manual o rotativa equitativa (Round-Robin) con notificación push inmediata al asesor
          </p>
        </div>

        {unassignedLeads.length > 0 && (
          <button
            onClick={handleRoundRobinAssignAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Asignación Rotativa Rápida ({unassignedLeads.length})</span>
          </button>
        )}
      </div>

      {/* Agent Workload Status Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Carga de Trabajo y Disponibilidad de Asesores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const assignedCount = leads.filter((l) => l.assignedAgentId === agent.id).length;
            return (
              <div
                key={agent.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block leading-tight">
                        {agent.name}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        ● Activo en Turno
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <span className="text-slate-500">Leads en Cartera:</span>
                  <span className="font-black text-slate-900 text-sm">{assignedCount}</span>
                </div>

                {targetLeadId && (
                  <button
                    onClick={() => handleManualAssign(targetLeadId, agent.id)}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Asignar Lead Seleccionado
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unassigned Leads Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-amber-950">
              Cola de Prospectos Sin Asignar ({unassignedLeads.length})
            </h3>
          </div>
          <span className="text-xs text-amber-800 font-semibold">Prioridad de atención &lt; 15 min</span>
        </div>

        {unassignedLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium text-sm">
            🎉 Todos los prospectos han sido asignados exitosamente a un asesor comercial.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {unassignedLeads.map((lead) => {
              const isSelected = targetLeadId === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setTargetLeadId(lead.id)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/70 border-l-4 border-l-amber-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
                        {lead.source.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Tel: <strong>{lead.phone}</strong> • Zona: <strong>{lead.preferredZone}</strong>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 italic">"{lead.notes}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleManualAssign(lead.id, e.target.value);
                        }
                      }}
                      defaultValue=""
                      className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="" disabled>
                        Seleccionar asesor directo...
                      </option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
