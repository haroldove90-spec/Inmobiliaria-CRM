import React from 'react';
import {
  BarChart3,
  Users,
  Building,
  BadgeDollarSign,
  Kanban,
  Search,
  Calendar,
  FileCheck2,
  Inbox,
  Share2,
  CalendarCheck2,
  Scale,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { UserRole, ActiveModule } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeModule,
  onSelectModule,
  onLogout,
  collapsed = false,
  onToggleCollapse,
}) => {
  interface ModuleItem {
    id: ActiveModule;
    label: string;
    description: string;
    icon: React.ReactNode;
  }

  const getModulesForRole = (role: UserRole): ModuleItem[] => {
    switch (role) {
      case 'admin':
        return [
          {
            id: 'analytics',
            label: 'Dashboard Ejecutivo & Analítica',
            description: 'KPIs, rendimiento y conversión',
            icon: <BarChart3 className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'employees',
            label: 'Gestión de Empleados & Comisiones',
            description: 'Equipo, acuerdos y permisos',
            icon: <Users className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'inventory_control',
            label: 'Control Total de Inventario',
            description: 'Aprobación y exclusividades',
            icon: <Building className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'sales_supervision',
            label: 'Supervisión de Ventas y Finanzas',
            description: 'Pipeline global y firmas notariales',
            icon: <BadgeDollarSign className="w-5 h-5 shrink-0" />,
          },
        ];
      case 'agent':
        return [
          {
            id: 'pipeline',
            label: 'CRM & Pipeline Personal',
            description: 'Tablero Kanban y seguimiento',
            icon: <Kanban className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'inventory',
            label: 'Inventario & Fichas Técnicas',
            description: 'Buscador, WhatsApp y apartados',
            icon: <Search className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'calendar',
            label: 'Agenda & Citas',
            description: 'Visitas y bitácora post-visita',
            icon: <Calendar className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'closures',
            label: 'Mis Cierres & Comisiones',
            description: 'Operaciones en firma y cobros',
            icon: <FileCheck2 className="w-5 h-5 shrink-0" />,
          },
        ];
      case 'coordinator':
        return [
          {
            id: 'inbox',
            label: 'Bandeja Omnicanal',
            description: 'FB, IG, TikTok, WA y calificación',
            icon: <Inbox className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'distribution',
            label: 'Distribución & Asignación',
            description: 'Asignación manual y rotativa',
            icon: <Share2 className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'appointments',
            label: 'Gestión de Citas & Plantillas',
            description: 'Agenda inicial y respuestas rápidas',
            icon: <CalendarCheck2 className="w-5 h-5 shrink-0" />,
          },
        ];
      case 'compliance':
        return [
          {
            id: 'nom247',
            label: 'NOM-247 & CONOCER',
            description: 'Auditoría y adhesión PROFECO',
            icon: <Scale className="w-5 h-5 shrink-0" />,
          },
          {
            id: 'safety_stps',
            label: 'Seguridad STPS & Capacitación',
            description: 'Protocolos de visita y normativas',
            icon: <ShieldCheck className="w-5 h-5 shrink-0" />,
          },
        ];
    }
  };

  const modules = getModulesForRole(currentRole);

  const getRoleTheme = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          activeClass: 'bg-blue-700 text-white shadow-sm font-semibold',
          hoverClass: 'hover:bg-blue-50 text-slate-700',
          accent: 'text-blue-700',
        };
      case 'agent':
        return {
          activeClass: 'bg-emerald-700 text-white shadow-sm font-semibold',
          hoverClass: 'hover:bg-emerald-50 text-slate-700',
          accent: 'text-emerald-700',
        };
      case 'coordinator':
        return {
          activeClass: 'bg-amber-600 text-white shadow-sm font-semibold',
          hoverClass: 'hover:bg-amber-50 text-slate-700',
          accent: 'text-amber-600',
        };
      case 'compliance':
        return {
          activeClass: 'bg-amber-700 text-white shadow-sm font-semibold',
          hoverClass: 'hover:bg-amber-50 text-slate-700',
          accent: 'text-amber-700',
        };
    }
  };

  const theme = getRoleTheme(currentRole);

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Sidebar Bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        {!collapsed && (
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Módulos del Perfil
            </span>
            <span className="text-sm font-semibold text-slate-800">
              Navegación Lateral
            </span>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors mx-auto"
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Modules List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {modules.map((mod) => {
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                isActive ? theme.activeClass : theme.hoverClass
              }`}
              title={mod.label}
            >
              {mod.icon}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-medium truncate leading-tight">
                    {mod.label}
                  </span>
                  <span
                    className={`block text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    {mod.description}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Security & Compliance Note */}
      {!collapsed && (
        <div className="p-4 mx-3 mb-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Acceso Seguro</span>
          </div>
          <p className="text-[12px] text-slate-500 leading-relaxed">
            Permisos restringidos activos para este perfil.
          </p>
        </div>
      )}

      {/* Bottom Switch Role */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors text-sm font-medium cursor-pointer"
          title="Cerrar sesión para navegar en otros roles"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-rose-600" />
          {!collapsed && <span>Cambiar de Perfil</span>}
        </button>
      </div>
    </aside>
  );
};
