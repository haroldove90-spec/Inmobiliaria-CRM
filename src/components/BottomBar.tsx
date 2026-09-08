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
} from 'lucide-react';
import { UserRole, ActiveModule } from '../types';

interface BottomBarProps {
  currentRole: UserRole;
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  currentRole,
  activeModule,
  onSelectModule,
}) => {
  interface BottomItem {
    id: ActiveModule;
    label: string;
    icon: React.ReactNode;
  }

  const getItemsForRole = (role: UserRole): BottomItem[] => {
    switch (role) {
      case 'admin':
        return [
          { id: 'analytics', label: 'Analítica', icon: <BarChart3 className="w-5 h-5" /> },
          { id: 'employees', label: 'Equipo', icon: <Users className="w-5 h-5" /> },
          { id: 'inventory_control', label: 'Inventario', icon: <Building className="w-5 h-5" /> },
          { id: 'sales_supervision', label: 'Finanzas', icon: <BadgeDollarSign className="w-5 h-5" /> },
        ];
      case 'agent':
        return [
          { id: 'pipeline', label: 'Pipeline', icon: <Kanban className="w-5 h-5" /> },
          { id: 'inventory', label: 'Inmuebles', icon: <Search className="w-5 h-5" /> },
          { id: 'calendar', label: 'Agenda', icon: <Calendar className="w-5 h-5" /> },
          { id: 'closures', label: 'Cierres', icon: <FileCheck2 className="w-5 h-5" /> },
        ];
      case 'coordinator':
        return [
          { id: 'inbox', label: 'Bandeja', icon: <Inbox className="w-5 h-5" /> },
          { id: 'distribution', label: 'Asignar', icon: <Share2 className="w-5 h-5" /> },
          { id: 'appointments', label: 'Citas & WA', icon: <CalendarCheck2 className="w-5 h-5" /> },
        ];
      case 'compliance':
        return [
          { id: 'nom247', label: 'NOM-247', icon: <Scale className="w-5 h-5" /> },
          { id: 'safety_stps', label: 'STPS', icon: <ShieldCheck className="w-5 h-5" /> },
        ];
    }
  };

  const items = getItemsForRole(currentRole);

  const getActiveIndicator = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'text-blue-700 font-bold';
      case 'agent':
        return 'text-emerald-700 font-bold';
      case 'coordinator':
        return 'text-amber-700 font-bold';
      case 'compliance':
        return 'text-amber-800 font-bold';
    }
  };

  const activeColor = getActiveIndicator(currentRole);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg"
      aria-label="Navegación Móvil y Tablet"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 text-center transition-colors select-none ${
                isActive ? activeColor : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-slate-100' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] font-medium leading-none truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
