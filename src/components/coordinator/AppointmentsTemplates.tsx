import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Share2, Calendar, PhoneCall, Sparkles } from 'lucide-react';
import { Appointment, Lead, Property, Employee } from '../../types';

interface AppointmentsTemplatesProps {
  leads: Lead[];
  properties: Property[];
  employees: Employee[];
  onAddAppointment: (apt: Appointment) => void;
}

export const AppointmentsTemplates: React.FC<AppointmentsTemplatesProps> = ({
  leads,
  properties,
  employees,
  onAddAppointment,
}) => {
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // New Appointment Coordinator Form
  const [aptLeadId, setAptLeadId] = useState(leads[0]?.id || '');
  const [aptPropertyId, setAptPropertyId] = useState(properties[0]?.id || '');
  const [aptAgentId, setAptAgentId] = useState(employees.find(e => e.roleType === 'agent')?.id || '');
  const [aptDate, setAptDate] = useState('2026-09-14');
  const [aptTime, setAptTime] = useState('12:00 PM');
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const templates = [
    {
      id: 'tpl-1',
      title: 'Respuesta Inmediata Meta Ads (Comprador)',
      channel: 'Facebook / Instagram Ads',
      text: `¡Hola! Gracias por tu interés en nuestras propiedades exclusivas en la zona Poniente y Sur de CDMX. Contamos con inventario verificado bajo norma NOM-247.\n\nPara enviarte las 3 mejores opciones que se adapten a tu presupuesto: ¿buscas casa o departamento, y cuántas recámaras requieres?`,
    },
    {
      id: 'tpl-2',
      title: 'Invitación a Visita Física Personalizada',
      channel: 'WhatsApp',
      text: `¡Excelente día! Me da mucho gusto saludarte. Tenemos disponibilidad esta semana para que conozcas la propiedad personalmente con nuestro asesor asignado. ¿Qué horario te queda mejor: jueves a las 11:30 AM o sábado a las 12:00 PM?`,
    },
    {
      id: 'tpl-3',
      title: 'Captación de Propietario (Venta / Exclusiva)',
      channel: 'WhatsApp / Llamada',
      text: `Estimado(a) propietario(a): en Inmobiliaria CRM ofrecemos valuación comercial sin costo, contrato registrado ante PROFECO y póliza de seguridad jurídica. ¿Podemos agendar una llamada de 10 minutos para explicarle nuestra estrategia de venta en menos de 90 días?`,
    },
    {
      id: 'tpl-4',
      title: 'Compartición de Catálogo Digital Destacado',
      channel: 'TikTok / Instagram DM',
      text: `¡Hola! Aquí tienes nuestro catálogo digital interactivo del mes con departamentos en Polanco, Del Valle y Roma Norte: https://inmocrm.mx/catalogo-premium. Avísanos si deseas agendar un recorrido privado.`,
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  const handleCreateCoordinatorAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const selLead = leads.find((l) => l.id === aptLeadId);
    const selProp = properties.find((p) => p.id === aptPropertyId);
    const selAgent = employees.find((e) => e.id === aptAgentId);
    if (!selLead || !selProp || !selAgent) return;

    const created: Appointment = {
      id: `apt-${Date.now()}`,
      leadId: selLead.id,
      leadName: selLead.name,
      leadPhone: selLead.phone,
      agentId: selAgent.id,
      agentName: selAgent.name,
      propertyId: selProp.id,
      propertyTitle: selProp.title,
      date: aptDate,
      time: aptTime,
      status: 'programada',
    };

    onAddAppointment(created);
    setScheduledSuccess(true);
    setTimeout(() => setScheduledSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Citas & Primer Contacto
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Agendamiento coordinado con el asesor y biblioteca de respuestas rápidas para redes sociales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coordination Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-slate-900">
              Coordinar Visita (Cliente ↔ Asesor)
            </h3>
          </div>

          {scheduledSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>¡Cita coordinada y agregada al calendario del asesor con éxito!</span>
            </div>
          )}

          <form onSubmit={handleCreateCoordinatorAppointment} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Prospecto Interesado
              </label>
              <select
                value={aptLeadId}
                onChange={(e) => setAptLeadId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                Propiedad a Mostrar
              </label>
              <select
                value={aptPropertyId}
                onChange={(e) => setAptPropertyId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Asesor Asignado para la Cita
              </label>
              <select
                value={aptAgentId}
                onChange={(e) => setAptAgentId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Fecha Tentativa
                </label>
                <input
                  type="date"
                  required
                  value={aptDate}
                  onChange={(e) => setAptDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Horario
                </label>
                <input
                  type="text"
                  required
                  value={aptTime}
                  onChange={(e) => setAptTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              Confirmar y Enviar al Asesor
            </button>
          </form>
        </div>

        {/* Quick Reply Templates */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900">
                Plantillas de Respuestas Rápidas para Redes
              </h3>
            </div>
            <span className="text-xs text-slate-500">Un clic para copiar o compartir</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {templates.map((tpl) => {
              const isCopied = copiedTemplateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{tpl.title}</h4>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {tpl.channel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(tpl.id, tpl.text)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
                        title="Copiar texto al portapapeles"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line leading-relaxed font-mono">
                    {tpl.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
