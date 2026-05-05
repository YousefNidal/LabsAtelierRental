import { X, AlertCircle, CheckCircle, Info, Star, Inbox } from 'lucide-react';

export const CATEGORY_ICON = {
  'Evening Wear': '🌙',
  'Formal':       '🎩',
  'Wedding':      '💍',
  'Cocktail':     '🥂',
  'Vintage':      '🪞',
  'Prom':         '✨',
  'Casual':       '☀️',
};

export const STATUS_BADGE = {
  'New Booking':       { cls: 'badge-blue',   label: 'New' },
  'Booking Confirmed': { cls: 'badge-purple',  label: 'Confirmed' },
  'Rental Active':     { cls: 'badge-green',   label: 'Active' },
  'Return Inspection': { cls: 'badge-yellow',  label: 'Inspection' },
  'Penalty Pending':   { cls: 'badge-red',     label: 'Penalty' },
  'Booking Completed': { cls: 'badge-gray',    label: 'Completed' },
  'Booking Cancelled': { cls: 'badge-red',     label: 'Cancelled' },
  'Booking Deleted':   { cls: 'badge-gray',    label: 'Deleted' },
  available:           { cls: 'badge-green',   label: 'Available' },
  rented:              { cls: 'badge-purple',  label: 'Rented' },
  repair:              { cls: 'badge-yellow',  label: 'In Repair' },
  'write-off':         { cls: 'badge-red',     label: 'Write-off' },
  excellent:           { cls: 'badge-green',   label: 'Excellent' },
  good:                { cls: 'badge-blue',    label: 'Good' },
  fair:                { cls: 'badge-yellow',  label: 'Fair' },
  damaged:             { cls: 'badge-red',     label: 'Damaged' },
};

export function Badge({ value }) {
  const info = STATUS_BADGE[value] || { cls: 'badge-gray', label: value };
  return <span className={`badge ${info.cls}`}>{info.label}</span>;
}

export function StarRating({ rating, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? '#d97706' : 'none'} color={i < rating ? '#d97706' : '#d1d5db'} />
      ))}
    </span>
  );
}

export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            className="btn btn-secondary btn-sm btn-icon"
            onClick={onClose}
            style={{ padding: 6, display: 'flex', alignItems: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="empty-state">
      <div style={{ marginBottom: 12, color: '#d1d5db', display: 'flex', justifyContent: 'center' }}>
        {typeof Icon === 'string'
          ? <span style={{ fontSize: 48 }}>{Icon}</span>
          : Icon ? <Icon size={52} strokeWidth={1.2} /> : <Inbox size={52} strokeWidth={1.2} />
        }
      </div>
      <h3>{title}</h3>
      {subtitle && <p style={{ marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

export function Alert({ type = 'info', children }) {
  const config = {
    error:   { cls: 'alert-error',   Icon: AlertCircle },
    success: { cls: 'alert-success', Icon: CheckCircle },
    info:    { cls: 'alert-info',    Icon: Info },
  }[type] || { cls: 'alert-info', Icon: Info };

  return (
    <div className={`alert ${config.cls}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <config.Icon size={16} />
      {children}
    </div>
  );
}

// Kept for backward compat
export const CATEGORY_EMOJI = CATEGORY_ICON;
