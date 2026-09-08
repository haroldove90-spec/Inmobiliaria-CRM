import React, { useState } from 'react';
import { Search, Filter, Share2, FileText, Lock, CheckCircle, MapPin, BedDouble, Bath, Car, Maximize, Printer, Copy, Check } from 'lucide-react';
import { Property, OperationType } from '../../types';

interface AgentInventoryProps {
  properties: Property[];
  onReserveProperty: (propertyId: string, clientName: string, amount: number, receiptRef: string) => void;
}

export const AgentInventory: React.FC<AgentInventoryProps> = ({
  properties,
  onReserveProperty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [operationFilter, setOperationFilter] = useState<'all' | OperationType>('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  
  // Sheet modal
  const [techSheetProperty, setTechSheetProperty] = useState<Property | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reserve modal
  const [reserveModalProperty, setReserveModalProperty] = useState<Property | null>(null);
  const [reserveClientName, setReserveClientName] = useState('');
  const [reserveAmount, setReserveAmount] = useState(250000);
  const [reserveReceipt, setReserveReceipt] = useState('TRANSF-BBVA-9912');

  const zones = Array.from(new Set(properties.map((p) => p.zone)));

  const filteredProperties = properties.filter((p) => {
    if (operationFilter !== 'all' && p.operation !== operationFilter) return false;
    if (zoneFilter !== 'all' && p.zone !== zoneFilter) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleShareWhatsApp = (prop: Property) => {
    const text = encodeURIComponent(
      `¡Hola! Te comparto la Ficha Técnica de la propiedad: *${prop.title}* (${prop.code}) en *${prop.zone}*.\n` +
      `Precio: ${formatCurrency(prop.price)} ${prop.currency}\n` +
      `Construcción: ${prop.constructionM2} m² | ${prop.bedrooms} Recámaras | ${prop.bathrooms} Baños\n` +
      `Cuenta con contrato registrado ante PROFECO y certificación NOM-247.\n` +
      `¿Cuándo te gustaría programar una visita física?`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = (prop: Property) => {
    navigator.clipboard.writeText(`https://inmocrm.mx/propiedad/${prop.code}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConfirmReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveModalProperty || !reserveClientName) return;
    onReserveProperty(reserveModalProperty.id, reserveClientName, reserveAmount, reserveReceipt);
    setReserveModalProperty(null);
    setReserveClientName('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventario & Fichas Técnicas
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Buscador avanzado, compartición directa por WhatsApp y solicitud de apartado temporal
          </p>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por título, código o colonia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50/60"
            />
          </div>

          {/* Operation */}
          <div>
            <select
              value={operationFilter}
              onChange={(e) => setOperationFilter(e.target.value as 'all' | OperationType)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50/60 text-slate-700"
            >
              <option value="all">Todas las operaciones</option>
              <option value="venta">En Venta</option>
              <option value="renta">En Renta</option>
              <option value="preventa">Preventa</option>
            </select>
          </div>

          {/* Zone */}
          <div>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50/60 text-slate-700"
            >
              <option value="all">Todas las zonas / colonias</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div>
            <input
              type="number"
              placeholder="Precio Máximo ($ MXN)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50/60 text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => {
          const isApartada = prop.status === 'apartada';
          return (
            <div
              key={prop.id}
              className={`bg-white rounded-2xl border ${
                isApartada ? 'border-amber-300' : 'border-slate-200'
              } shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow`}
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={prop.imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                      {prop.operation.toUpperCase()}
                    </span>
                    {isApartada && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-sm flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Apartada
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-xs">
                    {prop.code}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400">
                      {prop.propertyType}
                    </span>
                    <span className="text-xl font-black text-slate-900">
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

                  {/* Amenities / Specs badges */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center text-xs text-slate-600">
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <BedDouble className="w-3.5 h-3.5 mx-auto text-slate-400 mb-0.5" />
                      <span className="font-bold">{prop.bedrooms}</span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <Bath className="w-3.5 h-3.5 mx-auto text-slate-400 mb-0.5" />
                      <span className="font-bold">{prop.bathrooms}</span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <Car className="w-3.5 h-3.5 mx-auto text-slate-400 mb-0.5" />
                      <span className="font-bold">{prop.parkingSpots}</span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <Maximize className="w-3.5 h-3.5 mx-auto text-slate-400 mb-0.5" />
                      <span className="font-bold">{prop.constructionM2}m²</span>
                    </div>
                  </div>

                  {/* Reserved info banner if applicable */}
                  {prop.depositHold && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-0.5">
                      <div className="font-bold">Apartado por: {prop.depositHold.clientName}</div>
                      <div className="text-[11px] text-amber-700">
                        Anticipo: {formatCurrency(prop.depositHold.amountMxn)} • Ref: {prop.depositHold.receiptRef}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setTechSheetProperty(prop)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Ficha PDF
                </button>

                <button
                  onClick={() => handleShareWhatsApp(prop)}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  title="Compartir ficha por WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  WhatsApp
                </button>

                {!isApartada && (
                  <button
                    onClick={() => setReserveModalProperty(prop)}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 flex items-center justify-center gap-1 transition-colors"
                    title="Solicitud de apartado temporal"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Apartar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Ficha Técnica Rápida (Printable / PDF preview) */}
      {techSheetProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Ficha Técnica Oficial • {techSheetProperty.code}</h3>
              </div>
              <button
                onClick={() => setTechSheetProperty(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Printable Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{techSheetProperty.title}</h2>
                  <p className="text-xs text-slate-500">{techSheetProperty.address}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase block">Precio de Lista</span>
                  <span className="text-2xl font-black text-slate-900">
                    {formatCurrency(techSheetProperty.price)} {techSheetProperty.currency}
                  </span>
                </div>
              </div>

              {/* Photo */}
              <div className="h-64 w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                <img
                  src={techSheetProperty.imageUrl}
                  alt={techSheetProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Technical specs table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Construcción</span>
                  <strong className="text-sm text-slate-900">{techSheetProperty.constructionM2} m²</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Terreno</span>
                  <strong className="text-sm text-slate-900">{techSheetProperty.landM2} m²</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Recámaras</span>
                  <strong className="text-sm text-slate-900">{techSheetProperty.bedrooms} Habs</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Estacionamientos</span>
                  <strong className="text-sm text-slate-900">{techSheetProperty.parkingSpots} Autos</strong>
                </div>
              </div>

              {/* Amenidades y descripción */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-500">Memoria Descriptiva</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{techSheetProperty.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {techSheetProperty.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* NOM-247 Certification seal */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Inmueble con contrato de adhesión registrado ante PROFECO ({techSheetProperty.exclusiveContract.folioProfeco})</span>
                </div>
                <span className="font-bold">NOM-247-SE-2021</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleCopyLink(techSheetProperty)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar enlace público'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / Guardar PDF
                </button>
                <button
                  onClick={() => handleShareWhatsApp(techSheetProperty)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Enviar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Solicitud de Apartado Temporal */}
      {reserveModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg">Solicitud de Apartado Temporal</h3>
              </div>
              <button
                onClick={() => setReserveModalProperty(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReserve} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Propiedad a Bloquear</span>
                <span className="font-bold text-slate-900 text-sm">{reserveModalProperty.title}</span>
                <span className="text-xs text-blue-700 block font-semibold">{formatCurrency(reserveModalProperty.price)}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nombre del Cliente que Deposita
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Mauricio Garza"
                  value={reserveClientName}
                  onChange={(e) => setReserveClientName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Monto de Apartado ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={reserveAmount}
                    onChange={(e) => setReserveAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Referencia de Depósito
                  </label>
                  <input
                    type="text"
                    required
                    value={reserveReceipt}
                    onChange={(e) => setReserveReceipt(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-[12px] text-slate-500">
                Al confirmar el apartado temporal, el inmueble se retirará del catálogo público por 10 días hábiles para elaboración de contrato de promesa.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReserveModalProperty(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm shadow-sm"
                >
                  Confirmar Apartado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
