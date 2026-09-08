import React from 'react';
import { Building2, Download, LogOut, ShieldCheck, UserCheck, MessageSquareText, Award, Menu } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole | null;
  onLogout: () => void;
  onOpenInstall: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onLogout,
  onOpenInstall,
  onToggleSidebar,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Dirección General',
          tag: 'Administrador',
          icon: <ShieldCheck className="w-4 h-4 text-blue-700" />,
          bgColor: 'bg-blue-50 border-blue-200 text-blue-900',
          dotColor: 'bg-blue-600',
        };
      case 'agent':
        return {
          label: 'Asesor Comercial',
          tag: 'Agente Inmobiliario',
          icon: <UserCheck className="w-4 h-4 text-emerald-700" />,
          bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          dotColor: 'bg-emerald-600',
        };
      case 'coordinator':
        return {
          label: 'Atención & Leads',
          tag: 'Coordinador Omnicanal',
          icon: <MessageSquareText className="w-4 h-4 text-amber-700" />,
          bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
          dotColor: 'bg-amber-600',
        };
      case 'compliance':
        return {
          label: 'Normativa & STPS',
          tag: 'NOM-247 / CONOCER',
          icon: <Award className="w-4 h-4 text-amber-800" />,
          bgColor: 'bg-amber-50 border-amber-300 text-amber-950',
          dotColor: 'bg-amber-600',
        };
    }
  };

  const badgeInfo = currentRole ? getRoleBadge(currentRole) : null;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between transition-all">
      {/* Brand & Left controls */}
      <div className="flex items-center gap-3">
        {currentRole && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Alternar menú lateral"
            aria-label="Alternar menú lateral"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-900/10">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
              Inmobiliaria <span className="text-blue-700">CRM</span>
            </span>
            <span className="text-[11px] font-medium tracking-wide uppercase text-slate-500 hidden sm:block">
              Gestión Patrimonial Institucional
            </span>
          </div>
        </div>
      </div>

      {/* Right controls: Role indicator, Install App, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {badgeInfo && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold ${badgeInfo.bgColor}`}>
            <span className={`w-2 h-2 rounded-full ${badgeInfo.dotColor} animate-pulse`} />
            {badgeInfo.icon}
            <div className="leading-tight">
              <span className="block font-bold">{badgeInfo.label}</span>
              <span className="text-[10px] text-slate-500 hidden md:block font-normal">{badgeInfo.tag}</span>
            </div>
          </div>
        )}

        {/* PWA Quick Install Button */}
        <button
          onClick={onOpenInstall}
          id="btn-install-app"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
          title="Instalar aplicación en dispositivo"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Instalar App</span>
        </button>

        {/* Session Logout / Switch Role Button */}
        {currentRole && (
          <button
            onClick={onLogout}
            id="btn-logout"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            title="Cerrar sesión y cambiar de rol"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        )}
      </div>
    </header>
  );
};
