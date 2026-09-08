import React from 'react';
import { ShieldCheck, UserCheck, MessageSquareText, Award, ArrowRight, CheckCircle, Sparkles, Building2 } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectorHomeProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectorHome: React.FC<RoleSelectorHomeProps> = ({ onSelectRole }) => {
  const roles = [
    {
      id: 'admin' as UserRole,
      title: 'Administrador',
      subtitle: 'Dirección General',
      tag: 'Acceso Total',
      icon: <ShieldCheck className="w-8 h-8 text-blue-700" />,
      colorClass: 'border-blue-200 hover:border-blue-600 bg-white hover:bg-blue-50/40',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      btnClass: 'bg-blue-700 hover:bg-blue-800 text-white',
      modulesHighlight: [
        'KPIs y Ventas del Mes',
        'Directorio y Comisiones',
        'Aprobación de Inventario',
        'Firmas Notariales y Anticipos',
      ],
    },
    {
      id: 'agent' as UserRole,
      title: 'Asesor Inmobiliario',
      subtitle: 'Agente Comercial',
      tag: 'Ventas & Clientes',
      icon: <UserCheck className="w-8 h-8 text-emerald-700" />,
      colorClass: 'border-emerald-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/40',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      btnClass: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      modulesHighlight: [
        'Kanban de Prospectos',
        'Fichas Técnicas & WhatsApp',
        'Agenda y Bitácora de Citas',
        'Mis Cierres y Comisiones',
      ],
    },
    {
      id: 'coordinator' as UserRole,
      title: 'Atención al Cliente',
      subtitle: 'Coordinador de Leads',
      tag: 'Redes Sociales',
      icon: <MessageSquareText className="w-8 h-8 text-amber-600" />,
      colorClass: 'border-amber-200 hover:border-amber-500 bg-white hover:bg-amber-50/40',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
      modulesHighlight: [
        'Bandeja FB, IG, TikTok, WA',
        'Calificación Rápida',
        'Asignación Round-Robin',
        'Respuestas Rápidas & Agenda',
      ],
    },
    {
      id: 'compliance' as UserRole,
      title: 'Normativa STPS',
      subtitle: 'CONOCER / Legal',
      tag: 'Cumplimiento',
      icon: <Award className="w-8 h-8 text-amber-700" />,
      colorClass: 'border-amber-300 hover:border-amber-600 bg-white hover:bg-amber-50/40',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      btnClass: 'bg-amber-700 hover:bg-amber-800 text-white',
      modulesHighlight: [
        'Checklist NOM-247-SE-2021',
        'Contratos Adhesión PROFECO',
        'Certificación EC0110.02',
        'Protocolos STPS y Seguridad',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fade-in">
      {/* Institutional Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold">
          <Building2 className="w-4 h-4 text-blue-700" />
          <span>Sistema de Gestión Patrimonial Inmobiliaria</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Acceso por Roles al CRM
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-normal">
          Seleccione su perfil de trabajo para acceder a sus herramientas autorizadas y módulos protegidos.
        </p>
      </div>

      {/* Grid: 2 Columns Mobile / 4 Columns Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {roles.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelectRole(r.id)}
            className={`group cursor-pointer rounded-2xl p-4 sm:p-6 border-2 transition-all duration-200 shadow-sm hover:shadow-xl flex flex-col justify-between ${r.colorClass}`}
          >
            {/* Top icon and tag */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform">
                  {r.icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${r.badgeClass}`}>
                  {r.tag}
                </span>
              </div>

              {/* Title and Subtitle - Large legible text */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                  {r.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  {r.subtitle}
                </p>
              </div>

              {/* Module Highlights */}
              <ul className="space-y-2 pt-2 border-t border-slate-100 hidden sm:block">
                {r.modulesHighlight.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-4 mt-4">
              <button
                type="button"
                className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all ${r.btnClass}`}
              >
                <span>Ingresar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security & Access footer note */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Control de Acceso Restringido:</strong> Cada perfil cuenta con permisos específicos. Para cambiar de función, presione <em>"Cerrar Sesión"</em> en la cabecera.
          </span>
        </div>
        <span className="font-semibold text-slate-500 shrink-0">Versión 3.2 • PWA Ready</span>
      </div>
    </div>
  );
};
