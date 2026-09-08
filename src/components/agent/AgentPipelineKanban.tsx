import React, { useState } from 'react';
import { Kanban, Plus, Phone, MessageSquare, Calendar, ChevronRight, ChevronLeft, User, DollarSign, MapPin, BedDouble } from 'lucide-react';
import { Lead, LeadStage, Interaction } from '../../types';

interface AgentPipelineKanbanProps {
  leads: Lead[];
  currentAgentId: string;
  onUpdateLead: (lead: Lead) => void;
  onAddLead: (lead: Lead) => void;
}

export const AgentPipelineKanban: React.FC<AgentPipelineKanbanProps> = ({
  leads,
  currentAgentId,
  onUpdateLead,
  onAddLead,
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newInteractionText, setNewInteractionText] = useState('');
  const [newInteractionType, setNewInteractionType] = useState<Interaction['type']>('llamada');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New lead state
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    interestType: 'comprador' as Lead['interestType'],
    budgetMin: 5000000,
    budgetMax: 10000000,
    preferredZone: 'Polanco V Sección',
    bedrooms: 3,
    notes: '',
  });

  const columns: { stage: LeadStage; title: string; color: string; bgBadge: string }[] = [
    { stage: 'nuevo', title: 'Nuevo Lead', color: 'border-t-blue-500', bgBadge: 'bg-blue-100 text-blue-800' },
    { stage: 'calificado', title: 'Calificado', color: 'border-t-indigo-500', bgBadge: 'bg-indigo-100 text-indigo-800' },
    { stage: 'visita', title: 'Visita Agendada', color: 'border-t-amber-500', bgBadge: 'bg-amber-100 text-amber-800' },
    { stage: 'propuesta', title: 'Propuesta / Oferta', color: 'border-t-purple-500', bgBadge: 'bg-purple-100 text-purple-800' },
    { stage: 'cierre', title: 'Cierre / Apartado', color: 'border-t-emerald-500', bgBadge: 'bg-emerald-100 text-emerald-800' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const moveStage = (lead: Lead, direction: 'forward' | 'back') => {
    const stageOrder: LeadStage[] = ['nuevo', 'calificado', 'visita', 'propuesta', 'cierre'];
    const currentIndex = stageOrder.indexOf(lead.stage);
    let targetIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < stageOrder.length) {
      const updated: Lead = {
        ...lead,
        stage: stageOrder[targetIndex],
        interactions: [
          ...lead.interactions,
          {
            id: `int-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'nota',
            note: `Etapa actualizada a "${stageOrder[targetIndex].toUpperCase()}".`,
            author: 'Asesor Comercial',
          }
        ]
      };
      onUpdateLead(updated);
      if (selectedLead?.id === lead.id) {
        setSelectedLead(updated);
      }
    }
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newInteractionText.trim()) return;

    const newInter: Interaction = {
      id: `int-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: newInteractionType,
      note: newInteractionText.trim(),
      author: 'Asesor Comercial',
    };

    const updated: Lead = {
      ...selectedLead,
      interactions: [newInter, ...selectedLead.interactions],
    };

    onUpdateLead(updated);
    setSelectedLead(updated);
    setNewInteractionText('');
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name) return;

    const created: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadForm.name,
      email: newLeadForm.email || 'cliente@contacto.mx',
      phone: newLeadForm.phone || '+52 55 0000 0000',
      source: 'whatsapp',
      interestType: newLeadForm.interestType,
      budgetMin: Number(newLeadForm.budgetMin),
      budgetMax: Number(newLeadForm.budgetMax),
      currency: 'MXN',
      preferredZone: newLeadForm.preferredZone,
      bedrooms: Number(newLeadForm.bedrooms),
      stage: 'nuevo',
      assignedAgentId: currentAgentId,
      notes: newLeadForm.notes,
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'nota',
          note: 'Prospecto dado de alta en pipeline personal.',
          author: 'Asesor Comercial',
        }
      ],
      createdAt: new Date().toISOString(),
    };

    onAddLead(created);
    setShowAddLeadModal(false);
    setNewLeadForm({
      name: '',
      email: '',
      phone: '',
      interestType: 'comprador',
      budgetMin: 5000000,
      budgetMax: 10000000,
      preferredZone: 'Polanco V Sección',
      bedrooms: 3,
      notes: '',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CRM & Pipeline Personal
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Tablero Kanban de prospectos, notas de seguimiento e historial de interacciones
          </p>
        </div>
        <button
          onClick={() => setShowAddLeadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Prospecto</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.stage);
          return (
            <div
              key={col.stage}
              className={`bg-slate-100/90 rounded-2xl border-t-4 ${col.color} border border-slate-200 shadow-sm flex flex-col min-h-[420px]`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-xl">
                <span className="font-bold text-sm text-slate-800">{col.title}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bgBadge}`}>
                  {colLeads.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="p-3 space-y-3 flex-1">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {lead.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {lead.interestType === 'comprador' ? 'Compra' : lead.interestType === 'arrendatario' ? 'Renta' : 'Captación'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{lead.preferredZone}</span>
                    </div>

                    {/* Quick stage mover */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveStage(lead, 'back');
                        }}
                        disabled={lead.stage === 'nuevo'}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                        title="Retroceder etapa"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {lead.interactions.length} notas
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveStage(lead, 'forward');
                        }}
                        disabled={lead.stage === 'cierre'}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                        title="Avanzar etapa"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 font-medium">
                    Sin prospectos en esta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Lead Detail & Interaction Log */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-bold">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-400">{selectedLead.phone} • {selectedLead.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Preferencias de Búsqueda */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Preferencias del Prospecto
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Presupuesto</span>
                    <strong className="text-slate-800 text-sm">
                      {formatCurrency(selectedLead.budgetMin)} - {formatCurrency(selectedLead.budgetMax)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Zona Preferida</span>
                    <strong className="text-slate-800 text-sm">{selectedLead.preferredZone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Recámaras Mínimas</span>
                    <strong className="text-slate-800 text-sm">{selectedLead.bedrooms} Recámaras</strong>
                  </div>
                </div>
                <div className="pt-2 text-xs text-slate-600">
                  <strong>Notas iniciales:</strong> {selectedLead.notes || 'Sin especificaciones adicionales'}
                </div>
              </div>

              {/* Interaction Logger Form */}
              <form onSubmit={handleAddInteraction} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                <h4 className="text-xs font-bold uppercase text-emerald-900">
                  Registrar Nueva Interacción
                </h4>
                <div className="flex gap-2">
                  <select
                    value={newInteractionType}
                    onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])}
                    className="text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="llamada">Llamada telefónica</option>
                    <option value="whatsapp">Mensaje WhatsApp</option>
                    <option value="visita">Visita física</option>
                    <option value="correo">Correo electrónico</option>
                    <option value="nota">Nota interna</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Escriba el resultado o acuerdo de la llamada..."
                    value={newInteractionText}
                    onChange={(e) => setNewInteractionText(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>

              {/* History Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Historial de Interacciones ({selectedLead.interactions.length})
                </h4>
                <div className="space-y-2">
                  {selectedLead.interactions.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-bold text-slate-700 uppercase">{it.type}</span>
                        <span>{it.date} • {it.author}</span>
                      </div>
                      <p className="text-slate-800">{it.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => moveStage(selectedLead, 'back')}
                  disabled={selectedLead.stage === 'nuevo'}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-40"
                >
                  ← Retroceder
                </button>
                <button
                  onClick={() => moveStage(selectedLead, 'forward')}
                  disabled={selectedLead.stage === 'cierre'}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg disabled:opacity-40"
                >
                  Avanzar Etapa →
                </button>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Prospect */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Registrar Nuevo Prospecto</h3>
              </div>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Lic. Carlos Valenzuela"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Teléfono WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Tipo de Interés
                  </label>
                  <select
                    value={newLeadForm.interestType}
                    onChange={(e) =>
                      setNewLeadForm({
                        ...newLeadForm,
                        interestType: e.target.value as Lead['interestType'],
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="comprador">Comprador</option>
                    <option value="arrendatario">Arrendatario</option>
                    <option value="propietario_captacion">Propietario / Captación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Presupuesto Máximo ($)
                  </label>
                  <input
                    type="number"
                    value={newLeadForm.budgetMax}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budgetMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Zona Preferida
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.preferredZone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, preferredZone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Notas y Requerimientos Específicos
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Requiere 3 recámaras, balcón y acepta mascotas..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-sm"
                >
                  Guardar en Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
