import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, MessageSquare, Plus, User, AlertCircle, Sparkles } from 'lucide-react';
import { Appointment, Property, Lead } from '../../types';

interface AgentCalendarProps {
  appointments: Appointment[];
  properties: Property[];
  leads: Lead[];
  onUpdateAppointment: (updated: Appointment) => void;
  onAddAppointment: (newApt: Appointment) => void;
}

export const AgentCalendar: React.FC<AgentCalendarProps> = ({
  appointments,
  properties,
  leads,
  onUpdateAppointment,
  onAddAppointment,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Post-visit feedback form state
  const [feedbackOffer, setFeedbackOffer] = useState<number | ''>('');
  const [feedbackObjections, setFeedbackObjections] = useState('');
  const [feedbackNextStep, setFeedbackNextStep] = useState('');

  // New visit form state
  const [newVisitLeadId, setNewVisitLeadId] = useState(leads[0]?.id || '');
  const [newVisitPropertyId, setNewVisitPropertyId] = useState(properties[0]?.id || '');
  const [newVisitDate, setNewVisitDate] = useState('2026-09-12');
  const [newVisitTime, setNewVisitTime] = useState('11:00 AM');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenFeedback = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setFeedbackOffer(apt.feedback?.offerMxn || '');
    setFeedbackObjections(apt.feedback?.objections || '');
    setFeedbackNextStep(apt.feedback?.nextStep || '');
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const updated: Appointment = {
      ...selectedAppointment,
      status: 'realizada',
      feedback: {
        offerMxn: feedbackOffer ? Number(feedbackOffer) : undefined,
        objections: feedbackObjections,
        nextStep: feedbackNextStep,
      },
    };

    onUpdateAppointment(updated);
    setSelectedAppointment(null);
  };

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const selLead = leads.find((l) => l.id === newVisitLeadId);
    const selProp = properties.find((p) => p.id === newVisitPropertyId);
    if (!selLead || !selProp) return;

    const created: Appointment = {
      id: `apt-${Date.now()}`,
      leadId: selLead.id,
      leadName: selLead.name,
      leadPhone: selLead.phone,
      agentId: 'emp-2',
      agentName: 'Arq. Sofía Mendoza',
      propertyId: selProp.id,
      propertyTitle: selProp.title,
      date: newVisitDate,
      time: newVisitTime,
      status: 'programada',
    };

    onAddAppointment(created);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agenda & Citas Presenciales
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Cronograma de visitas a inmuebles y bitácora posterior con retroalimentación del prospecto
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Visita</span>
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((apt) => {
          const isRealizada = apt.status === 'realizada';
          return (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Date and Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>{apt.date}</span>
                    <span className="text-slate-400">•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.time}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      apt.status === 'programada'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : apt.status === 'realizada'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {apt.status === 'programada' ? 'Programada' : apt.status === 'realizada' ? 'Completada' : 'Cancelada'}
                  </span>
                </div>

                {/* Property & Client Info */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {apt.propertyTitle}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{apt.leadName}</span>
                    <span>({apt.leadPhone})</span>
                  </div>
                </div>

                {/* Bitácora / Feedback display if already provided */}
                {apt.feedback && (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Bitácora Post-Visita
                    </span>
                    {apt.feedback.offerMxn && (
                      <div className="text-emerald-950 font-bold">
                        Oferta presentada: {formatCurrency(apt.feedback.offerMxn)}
                      </div>
                    )}
                    <div className="text-slate-700">
                      <strong>Objeciones / Comentarios:</strong> {apt.feedback.objections}
                    </div>
                    <div className="text-blue-900 font-medium">
                      <strong>Siguiente paso:</strong> {apt.feedback.nextStep}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleOpenFeedback(apt)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {isRealizada ? 'Ver / Editar Bitácora' : 'Registrar Bitácora'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Bitácora Posterior a la Visita */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Bitácora Post-Visita</h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Prospecto e Inmueble</span>
                <span className="font-bold text-slate-900 text-sm block">
                  {selectedAppointment.leadName} • {selectedAppointment.propertyTitle}
                </span>
                <span className="text-xs text-slate-500">{selectedAppointment.date} a las {selectedAppointment.time}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Oferta Económica del Prospecto ($ MXN - Opcional)
                </label>
                <input
                  type="number"
                  placeholder="Ej. 7500000 (dejar en blanco si no ofertó)"
                  value={feedbackOffer}
                  onChange={(e) => setFeedbackOffer(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Objeciones / Dudas del Cliente
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ej. Le gustó la distribución pero quiere revisar la cuota de mantenimiento y estacionamientos..."
                  value={feedbackObjections}
                  onChange={(e) => setFeedbackObjections(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Siguiente Paso Acordado
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Enviar corrida financiera y propuesta formal el lunes"
                  value={feedbackNextStep}
                  onChange={(e) => setFeedbackNextStep(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-sm"
                >
                  Guardar Bitácora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Visit */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Agendar Cita Presencial</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Seleccionar Prospecto
                </label>
                <select
                  value={newVisitLeadId}
                  onChange={(e) => setNewVisitLeadId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Propiedad a Visitar
                </label>
                <select
                  value={newVisitPropertyId}
                  onChange={(e) => setNewVisitPropertyId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={newVisitDate}
                    onChange={(e) => setNewVisitDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Horario
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="11:30 AM"
                    value={newVisitTime}
                    onChange={(e) => setNewVisitTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-sm"
                >
                  Confirmar en Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
