import { Outlet } from 'react-router';
import { useNavigate, useLocation } from 'react-router';
import GlobalHeader from '../components/GlobalHeader';
import Sidebar from '../components/Sidebar';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <GlobalHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Floating Quick Leave Button - Mobile CSR */}
      {location.pathname === '/dashboard' && (
        <Button
          onClick={() => navigate('/leave-request')}
          className="lg:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 z-40"
          aria-label="Quick Leave Request"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}

function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Leave', path: '/leave-request', icon: '📅' },
    { label: 'Payroll', path: '/payroll', icon: '💰' },
    { label: 'Benefits', path: '/benefits', icon: '🎁' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
              location.pathname === item.path
                ? 'text-[#1B3045] dark:text-primary'
                : 'text-[#1B3045] dark:text-muted-foreground'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}