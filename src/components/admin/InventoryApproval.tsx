import React, { useState } from 'react';
import { Building, CheckCircle2, XCircle, FileText, ShieldCheck, Eye, MapPin, Tag } from 'lucide-react';
import { Property, PropertyStatus } from '../../types';

interface InventoryApprovalProps {
  properties: Property[];
  onUpdatePropertyStatus: (propertyId: string, newStatus: PropertyStatus) => void;
}

export const InventoryApproval: React.FC<InventoryApprovalProps> = ({
  properties,
  onUpdatePropertyStatus,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'revision' | 'publicada' | 'apartada'>('all');

  const filteredProperties = properties.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'revision':
        return { label: 'En Revisión', class: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'publicada':
        return { label: 'Publicada / Activa', class: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'apartada':
        return { label: 'Apartada (Con Depósito)', class: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'rechazada':
        return { label: 'Rechazada', class: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'vendida':
        return { label: 'Vendida / Cerrada', class: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Control Total de Inventario
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Validación de dictámenes, contratos de exclusividad y publicación
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({properties.length})
          </button>
          <button
            onClick={() => setStatusFilter('revision')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'revision' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revisión ({properties.filter((p) => p.status === 'revision').length})
          </button>
          <button
            onClick={() => setStatusFilter('publicada')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'publicada' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Publicadas ({properties.filter((p) => p.status === 'publicada').length})
          </button>
          <button
            onClick={() => setStatusFilter('apartada')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'apartada' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Apartadas ({properties.filter((p) => p.status === 'apartada').length})
          </button>
        </div>
      </div>

      {/* Properties Approval List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => {
          const badge = getStatusBadge(prop.status);
          return (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Image banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={prop.imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                    {prop.code}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      {prop.operation === 'venta' ? 'En Venta' : prop.operation === 'renta' ? 'En Renta' : 'Preventa'} • {prop.propertyType}
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      {formatCurrency(prop.price)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                    {prop.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prop.address}</span>
                  </div>

                  {/* Owner & Exclusivity Contract Pill */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Propietario: {prop.exclusiveContract.ownerName}</span>
                      <span className="text-emerald-700 font-bold">{prop.exclusiveContract.brokerageFeePercent}% Corretaje</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Folio PROFECO: {prop.exclusiveContract.folioProfeco}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedProperty(prop)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver Ficha y Contrato
                </button>

                {prop.status === 'revision' && (
                  <>
                    <button
                      onClick={() => onUpdatePropertyStatus(prop.id, 'publicada')}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors"
                      title="Aprobar y publicar en catálogo"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => onUpdatePropertyStatus(prop.id, 'rechazada')}
                      className="py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors"
                      title="Rechazar publicación"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {prop.status === 'publicada' && (
                  <button
                    onClick={() => onUpdatePropertyStatus(prop.id, 'revision')}
                    className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Pausar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">{selectedProperty.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="h-56 w-full rounded-xl overflow-hidden">
                <img
                  src={selectedProperty.imageUrl}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Precio Lista</span>
                  <span className="font-bold text-slate-900 text-sm">{formatCurrency(selectedProperty.price)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Construcción</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProperty.constructionM2} m²</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Recámaras</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProperty.bedrooms} Habs</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Estacionamientos</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProperty.parkingSpots} Cajones</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase text-slate-500">Descripción</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedProperty.description}</p>
              </div>

              {/* Contrato de Exclusividad & NOM-247 */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>Historial de Contrato de Exclusividad y Corretaje</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div><strong>Propietario:</strong> {selectedProperty.exclusiveContract.ownerName}</div>
                  <div><strong>Teléfono:</strong> {selectedProperty.exclusiveContract.ownerPhone}</div>
                  <div><strong>Folio Adhesión PROFECO:</strong> {selectedProperty.exclusiveContract.folioProfeco}</div>
                  <div><strong>Comisión Pactada:</strong> {selectedProperty.exclusiveContract.brokerageFeePercent}% sobre venta final</div>
                  <div><strong>Vigencia de Exclusividad:</strong> Hasta {selectedProperty.exclusiveContract.validUntil}</div>
                  <div><strong>Firma Digital:</strong> {selectedProperty.exclusiveContract.signed ? '✅ Registrada y Cotejada' : '⚠️ Pendiente de firma'}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl"
              >
                Cerrar
              </button>
              {selectedProperty.status === 'revision' && (
                <button
                  onClick={() => {
                    onUpdatePropertyStatus(selectedProperty.id, 'publicada');
                    setSelectedProperty(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm"
                >
                  Aprobar y Publicar Inmueble
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
