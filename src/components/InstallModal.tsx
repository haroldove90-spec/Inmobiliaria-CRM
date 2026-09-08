import React from 'react';
import { Download, Smartphone, Laptop, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 rounded-xl border border-blue-400/30 text-blue-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Instalar Inmobiliaria CRM</h3>
              <p className="text-xs text-slate-400">Acceso rápido sin descargas de tienda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {isInstalled ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">¡Aplicación ya instalada!</h4>
              <p className="text-sm text-slate-600">
                La aplicación ya se encuentra agregada a su dispositivo y puede ejecutarse directamente desde su pantalla de inicio o aplicaciones.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">En Android / Google Chrome:</strong>
                    Haga clic en el botón de abajo o seleccione el menú de 3 puntos en el navegador y elija <em>"Instalar aplicación"</em>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">En iPhone / iPad (Safari):</strong>
                    Presione el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) y seleccione <strong>"Agregar al inicio"</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Laptop className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">En Computadora (Chrome / Edge):</strong>
                    Haga clic en el icono de instalación en la barra de direcciones superior o presione el botón inferior.
                  </div>
                </div>
              </div>

              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Instalar en Este Dispositivo
                </button>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
