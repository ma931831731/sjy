import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      id="global-mt-toast"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in duration-200 select-none pointer-events-none"
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
      <span className="font-medium tracking-tight whitespace-nowrap">{message}</span>
    </div>
  );
};
