import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
  const styles = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(({ id, message, type }) => {
          const Icon = icons[type] || Info;
          return (
            <div key={id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass border ${styles[type]} shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[280px] max-w-sm`}
              style={{ animation: 'bounceIn 0.4s ease forwards' }}>
              <Icon size={16} className="flex-shrink-0" />
              <span className="text-sm flex-1 text-white/90">{message}</span>
              <button onClick={() => remove(id)} className="opacity-50 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
