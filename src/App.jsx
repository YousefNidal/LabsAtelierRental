import { useState } from 'react';
import { useApp } from './store/AppContext';
import { ROLES } from './store/data';

import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StorekeeperDashboard from './pages/StorekeeperDashboard';

const DEFAULT_PAGE = {
  [ROLES.CLIENT]:        'bookings',
  [ROLES.MANAGER]:       'bookings',
  [ROLES.ADMINISTRATOR]: 'dashboard',
  [ROLES.STOREKEEPER]:   'inventory',
};

export default function App() {
  const { state } = useApp();
  const { currentUser } = state;
  const [page, setPage] = useState(null);

  if (!currentUser) return <LoginPage />;

  const activePage = page || DEFAULT_PAGE[currentUser.role] || 'dashboard';

  const renderDashboard = () => {
    switch (currentUser.role) {
      case ROLES.CLIENT:        return <ClientDashboard page={activePage} />;
      case ROLES.MANAGER:       return <ManagerDashboard page={activePage} />;
      case ROLES.ADMINISTRATOR: return <AdminDashboard page={activePage} />;
      case ROLES.STOREKEEPER:   return <StorekeeperDashboard page={activePage} />;
      default:                  return <div style={{ padding: 32 }}>Unknown role</div>;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar active={activePage} onNav={setPage} />
      <main className="main-content">
        {renderDashboard()}
      </main>
    </div>
  );
}
