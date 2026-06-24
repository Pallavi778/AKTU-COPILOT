import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

const variants = {
  error: {
    wrapper: 'bg-red-50 border-red-200 text-red-800',
    icon: XCircle,
    iconClass: 'text-red-500',
  },
  success: {
    wrapper: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle2,
    iconClass: 'text-green-500',
  },
  warning: {
    wrapper: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: AlertCircle,
    iconClass: 'text-amber-500',
  },
  info: {
    wrapper: 'bg-brand-50 border-brand-200 text-brand-800',
    icon: Info,
    iconClass: 'text-brand-500',
  },
};

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  if (!message) return null;

  const v = variants[type] || variants.info;
  const Icon = v.icon;

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm animate-slide-up ${v.wrapper} ${className}`}
    >
      <Icon size={16} className={`${v.iconClass} mt-0.5 shrink-0`} />
      <p className="flex-1 font-body leading-relaxed">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Alert;
