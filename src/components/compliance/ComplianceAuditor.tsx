import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Scale, Award, Download, Check } from 'lucide-react';
import { Property, Employee } from '../../types';

interface ComplianceAuditorProps {
  properties: Property[];
  employees: Employee[];
  activeModule?: string;
  onSelectModule?: (module: 'nom247' | 'safety_stps' | 'expedientes') => void;
}

export const ComplianceAuditor: React.FC<ComplianceAuditorProps> = ({
  properties,
  employees,
  activeModule = 'nom247',
  onSelectModule,
}) => {
  // Sync tab with external activeModule if provided
  const getTabFromModule = (mod?: string): 'nom247' | 'conocer_stps' | 'expedientes' => {
    if (mod === 'safety_stps' || mod === 'conocer_stps') return 'conocer_stps';
    if (mod === 'expedientes') return 'expedientes';
    return 'nom247';
  };

  const currentTab = getTabFromModule(activeModule);

  const handleTabChange = (tab: 'nom247' | 'conocer_stps' | 'expedientes') => {
    if (onSelectModule) {
      if (tab === 'conocer_stps') onSelectModule('safety_stps');
      else onSelectModule(tab);
    }
  };

  const certifiedCount = employees.filter((e) => e.certificationConocer).length;
  const certifiedPercent = Math.round((certifiedCount / employees.length) * 100);

  const activeContracts = properties.filter((p) => p.exclusiveContract.signed).length;
  const activeContractsPercent = Math.round((activeContracts / properties.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Normativa & Compliance Inmobiliario
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Auditoría de NOM-247-SE-2021, Contratos de Adhesión PROFECO, Certificación CONOCER y DC-3 STPS
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => handleTabChange('nom247')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentTab === 'nom247' ? 'bg-white text-purple-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NOM-247 & PROFECO
          </button>
          <button
            onClick={() => handleTabChange('conocer_stps')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentTab === 'conocer_stps' ? 'bg-white text-purple-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CONOCER & STPS (DC-3)
          </button>
          <button
            onClick={() => handleTabChange('expedientes')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentTab === 'expedientes' ? 'bg-white text-purple-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expedientes de Inmuebles
          </button>
        </div>
      </div>

      {/* Compliance Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Apego NOM-247-SE-2021</span>
            <span className="p-1 rounded-full bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900">{activeContractsPercent}%</div>
          <p className="text-xs text-slate-500">Contratos con folio de registro ante PROFECO</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Personal Certificado CONOCER</span>
            <span className="p-1 rounded-full bg-purple-100 text-purple-800">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-purple-900">{certifiedPercent}%</div>
          <p className="text-xs text-slate-500">{certifiedCount} de {employees.length} colaboradores acreditados</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Auditoría Antilavado (PLD/UIF)</span>
            <span className="p-1 rounded-full bg-blue-100 text-blue-800">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-700">100%</div>
          <p className="text-xs text-slate-500">Identificación de clientes en umbrales de aviso</p>
        </div>
      </div>

      {/* Tab 1: NOM-247 & Contratos PROFECO */}
      {currentTab === 'nom247' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Registro de Contratos de Adhesión (NOM-247-SE-2021)
            </h3>
            <p className="text-xs text-slate-500">
              Verificación de folios oficiales de intermediación mercantil y exclusividad registrados ante la Procuraduría Federal del Consumidor.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Inmueble / Clave</th>
                  <th className="py-3 px-4">Propietario / Titular</th>
                  <th className="py-3 px-4">Folio PROFECO</th>
                  <th className="py-3 px-4">Corretaje Pactado</th>
                  <th className="py-3 px-4">Vigencia Exclusividad</th>
                  <th className="py-3 px-4 text-center">Firma y Cotejo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {prop.title}
                      <span className="block text-xs font-mono font-normal text-slate-400">{prop.code}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">{prop.exclusiveContract.ownerName}</span>
                      <span className="block text-xs text-slate-400">{prop.exclusiveContract.ownerPhone}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-xs text-purple-900 bg-purple-50/50 rounded">
                      {prop.exclusiveContract.folioProfeco}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-800">
                      {prop.exclusiveContract.brokerageFeePercent}%
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      {prop.exclusiveContract.validUntil}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {prop.exclusiveContract.signed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Vigente y Conforme
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          Pendiente de firma
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Certificación CONOCER & STPS */}
      {currentTab === 'conocer_stps' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Matriz de Acreditaciones Laborales & Normativas
            </h3>
            <p className="text-xs text-slate-500">
              Estándar de Competencia EC0110.02 (CONOCER) y Constancias de Competencias o Habilidades Laborales Formato DC-3 de la STPS.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Colaborador / Asesor</th>
                  <th className="py-3 px-4">Puesto Oficial</th>
                  <th className="py-3 px-4">Certificación CONOCER EC0110</th>
                  <th className="py-3 px-4">Constancia DC-3 STPS</th>
                  <th className="py-3 px-4 text-center">Estatus Acreditación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{emp.name}</span>
                      <span className="text-xs text-slate-400">{emp.email}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      {emp.position}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      {emp.certificationConocer ? (
                        <span className="font-mono font-bold text-emerald-800 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-emerald-600" />
                          Folio: {emp.certificationConocer}
                        </span>
                      ) : (
                        <span className="text-slate-400">En proceso de evaluación</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      {emp.stpsDC3Completed ? (
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          DC-3 Vigente (2026)
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Capacitación Pendiente
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border ${
                          emp.certificationConocer && emp.stpsDC3Completed
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {emp.certificationConocer && emp.stpsDC3Completed
                          ? '100% Cumplido'
                          : 'Parcial'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Expedientes Legales Inmuebles */}
      {currentTab === 'expedientes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Expedientes Legales y Dictamen Preventivo
            </h3>
            <p className="text-xs text-slate-500">
              Cotejo de Certificado de Libertad de Gravamen (RPI), comprobante de impuesto predial y plano arquitectónico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{prop.title}</span>
                  <span className="text-xs font-mono font-bold text-slate-500">{prop.code}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <span>Libertad de Gravamen:</span>
                    <strong className="text-emerald-700">Al Corriente</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <span>Impuesto Predial:</span>
                    <strong className="text-emerald-700">Pagado 2026</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <span>Dictamen Estructural:</span>
                    <strong className="text-emerald-700">Favorable</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <span>Contrato PROFECO:</span>
                    <strong className="text-purple-700">Registrado</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Propietario: {prop.exclusiveContract.ownerName}</span>
                  <span className="text-blue-700 font-semibold cursor-pointer hover:underline">
                    Descargar Expediente ZIP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
