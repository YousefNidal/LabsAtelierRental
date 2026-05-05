import {
  LayoutDashboard, Shirt, Users, DollarSign, BarChart3,
  ClipboardList, FileText, ShoppingBag, Clock, Star,
  Package, RotateCcw, LogOut, Scissors,
} from 'lucide-react';
import { useApp } from '../store/AppContext';

const NAV = {
  client: [
    { id: 'catalog',   label: 'Catalog',      Icon: ShoppingBag },
    { id: 'bookings',  label: 'My Bookings',  Icon: ClipboardList },
    { id: 'history',   label: 'Order History',Icon: Clock },
    { id: 'reviews',   label: 'My Reviews',   Icon: Star },
  ],
  manager: [
    { id: 'bookings',   label: 'Bookings',    Icon: ClipboardList },
    { id: 'agreements', label: 'Agreements',  Icon: FileText },
    { id: 'clients',    label: 'Clients',     Icon: Users },
    { id: 'products',   label: 'Products',    Icon: Shirt },
  ],
  administrator: [
    { id: 'dashboard', label: 'Dashboard',    Icon: LayoutDashboard },
    { id: 'products',  label: 'Products',     Icon: Shirt },
    { id: 'users',     label: 'Users',        Icon: Users },
    { id: 'tariffs',   label: 'Tariffs',      Icon: DollarSign },
    { id: 'reports',   label: 'Reports',      Icon: BarChart3 },
  ],
  storekeeper: [
    { id: 'inventory', label: 'Inventory',    Icon: Package },
    { id: 'returns',   label: 'Returns',      Icon: RotateCcw },
    { id: 'products',  label: 'Products',     Icon: Shirt },
  ],
};

export default function Sidebar({ active, onNav }) {
  const { state, logout } = useApp();
  const user = state.currentUser;
  if (!user) return null;

  const items = NAV[user.role] || [];
  const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Scissors size={20} color="#fff" />
        </div>
        <div>
          <div className="sidebar-logo-text">Atelier</div>
          <div className="sidebar-logo-sub">Rental System</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Navigation</div>
        {items.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => onNav(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{user.role}</div>
          </div>
        </div>
        <button
          className="btn btn-sm"
          style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
          onClick={logout}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
