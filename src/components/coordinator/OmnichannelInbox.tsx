import React, { useState } from 'react';
import { Inbox, Plus, MessageCircle, Phone, Globe, Share2, Tag, Check, Filter } from 'lucide-react';
import { Lead, LeadSource, LeadInterest } from '../../types';

interface OmnichannelInboxProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  onSelectLeadForDistribution: (lead: Lead) => void;
}

export const OmnichannelInbox: React.FC<OmnichannelInboxProps> = ({
  leads,
  onAddLead,
  onSelectLeadForDistribution,
}) => {
  const [sourceFilter, setSourceFilter] = useState<'all' | LeadSource>('all');
  const [showQuickQualifyModal, setShowQuickQualifyModal] = useState(false);

  // Form state for rapid qualification
  const [qualifyForm, setQualifyForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'facebook' as LeadSource,
    interestType: 'comprador' as LeadInterest,
    budgetMin: 4000000,
    budgetMax: 8000000,
    preferredZone: 'Condesa Hipódromo',
    bedrooms: 2,
    notes: '',
  });

  const getSourceBadge = (source: LeadSource) => {
    switch (source) {
      case 'facebook':
        return { label: 'Facebook Ads', class: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'instagram':
        return { label: 'Instagram Reels', class: 'bg-pink-100 text-pink-800 border-pink-200' };
      case 'tiktok':
        return { label: 'TikTok Inmuebles', class: 'bg-slate-900 text-white border-slate-700' };
      case 'whatsapp':
        return { label: 'WhatsApp Directo', class: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'portal':
        return { label: 'Portal Inmobiliario', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'call':
        return { label: 'Llamada Telefónica', class: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
  };

  const getInterestBadge = (interest: LeadInterest) => {
    switch (interest) {
      case 'comprador':
        return { label: 'Comprador', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'arrendatario':
        return { label: 'Arrendatario', class: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'propietario_captacion':
        return { label: 'Propietario / Listar Inmueble', class: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (sourceFilter === 'all') return true;
    return l.source === sourceFilter;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleQuickQualify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualifyForm.name || !qualifyForm.phone) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: qualifyForm.name,
      phone: qualifyForm.phone,
      email: qualifyForm.email || 'contacto@inmocrm.mx',
      source: qualifyForm.source,
      interestType: qualifyForm.interestType,
      budgetMin: Number(qualifyForm.budgetMin),
      budgetMax: Number(qualifyForm.budgetMax),
      currency: 'MXN',
      preferredZone: qualifyForm.preferredZone,
      bedrooms: Number(qualifyForm.bedrooms),
      stage: 'calificado',
      notes: qualifyForm.notes || 'Calificado rápidamente en bandeja omnicanal.',
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'whatsapp',
          note: `Lead calificado desde ${qualifyForm.source.toUpperCase()}.`,
          author: 'Coordinador de Leads',
        }
      ],
      createdAt: new Date().toISOString(),
    };

    onAddLead(newLead);
    setShowQuickQualifyModal(false);
    setQualifyForm({
      name: '',
      phone: '',
      email: '',
      source: 'facebook',
      interestType: 'comprador',
      budgetMin: 4000000,
      budgetMax: 8000000,
      preferredZone: 'Condesa Hipódromo',
      bedrooms: 2,
      notes: '',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bandeja de Entrada & Captación Omnicanal
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Registro unificado de prospectos de Meta Ads, TikTok, WhatsApp y portales inmobiliarios
          </p>
        </div>
        <button
          onClick={() => setShowQuickQualifyModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Calificación Rápida de Contacto</span>
        </button>
      </div>

      {/* Sources Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setSourceFilter('all')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            sourceFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Todas las Fuentes ({leads.length})
        </button>
        {(['facebook', 'instagram', 'tiktok', 'whatsapp', 'portal', 'call'] as LeadSource[]).map((src) => {
          const badge = getSourceBadge(src);
          const count = leads.filter((l) => l.source === src).length;
          return (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                sourceFilter === src
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {badge.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Fuente de Captación</th>
                <th className="py-3.5 px-4">Prospecto / Teléfono</th>
                <th className="py-3.5 px-4">Perfil de Interés</th>
                <th className="py-3.5 px-4">Presupuesto & Zona</th>
                <th className="py-3.5 px-4">Asignación Asesor</th>
                <th className="py-3.5 px-4 text-right">Acción Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const sourceBadge = getSourceBadge(lead.source);
                const interestBadge = getInterestBadge(lead.interestType);
                return (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${sourceBadge.class}`}>
                        {sourceBadge.label}
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1">
                        Registrado: {lead.createdAt.split('T')[0]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block leading-tight">
                        {lead.name}
                      </span>
                      <span className="text-xs text-slate-500 block">{lead.phone}</span>
                      <span className="text-[11px] text-slate-400">{lead.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${interestBadge.class}`}>
                        {interestBadge.label}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1 line-clamp-1">
                        {lead.notes || 'Sin notas'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block text-xs">
                        {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
                      </span>
                      <span className="text-xs text-slate-500">{lead.preferredZone}</span>
                    </td>
                    <td className="py-4 px-4">
                      {lead.assignedAgentId ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Asignado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 animate-pulse">
                          ⚠️ Sin Asignar
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onSelectLeadForDistribution(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Canalizar / Asignar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Formulario de Calificación Rápida */}
      {showQuickQualifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg">Formulario de Calificación Rápida</h3>
              </div>
              <button
                onClick={() => setShowQuickQualifyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickQualify} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nombre del Contacto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sra. Mónica Villarreal"
                  value={qualifyForm.name}
                  onChange={(e) => setQualifyForm({ ...qualifyForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+52 55 0000 0000"
                    value={qualifyForm.phone}
                    onChange={(e) => setQualifyForm({ ...qualifyForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Fuente de Entrada
                  </label>
                  <select
                    value={qualifyForm.source}
                    onChange={(e) => setQualifyForm({ ...qualifyForm, source: e.target.value as LeadSource })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="facebook">Facebook Ads</option>
                    <option value="instagram">Instagram Reels</option>
                    <option value="tiktok">TikTok Inmuebles</option>
                    <option value="whatsapp">WhatsApp Directo</option>
                    <option value="portal">Portal Inmuebles24 / Lamudi</option>
                    <option value="call">Llamada Telefónica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Perfil de Calificación
                </label>
                <select
                  value={qualifyForm.interestType}
                  onChange={(e) => setQualifyForm({ ...qualifyForm, interestType: e.target.value as LeadInterest })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="comprador">Comprador (Busca adquirir casa / departamento)</option>
                  <option value="arrendatario">Arrendatario (Busca renta residencial)</option>
                  <option value="propietario_captacion">Propietario (Desea listar/promover su inmueble)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Presupuesto Máximo ($)
                  </label>
                  <input
                    type="number"
                    value={qualifyForm.budgetMax}
                    onChange={(e) => setQualifyForm({ ...qualifyForm, budgetMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Zona / Ubicación
                  </label>
                  <input
                    type="text"
                    value={qualifyForm.preferredZone}
                    onChange={(e) => setQualifyForm({ ...qualifyForm, preferredZone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Notas de Calificación
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre urgencia, financiamiento o características..."
                  value={qualifyForm.notes}
                  onChange={(e) => setQualifyForm({ ...qualifyForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickQualifyModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm shadow-sm"
                >
                  Guardar y Calificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
