// src/components/Toast.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container with aria-live */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border text-sm font-medium shadow-md transition-all duration-200 animate-reveal ${
              toast.type === 'success'
                ? 'bg-moss-50 border-moss-600 text-moss-700'
                : toast.type === 'error'
                ? 'bg-red-50 border-alert-700 text-alert-700'
                : 'bg-surface border-sand-200 text-ink-900'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-moss-600 shrink-0 mt-0.5 stroke-[1.5]" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-alert-700 shrink-0 mt-0.5 stroke-[1.5]" />
            ) : (
              <Info className="w-5 h-5 text-ink-500 shrink-0 mt-0.5 stroke-[1.5]" />
            )}
            <div className="flex-1 text-xs leading-relaxed">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-ink-400 hover:text-ink-900 p-1 -mr-1 -mt-1 rounded focus:outline-none focus:ring-1 focus:ring-saffron-500"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
