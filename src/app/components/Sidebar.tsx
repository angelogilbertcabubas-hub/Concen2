import { useNavigate, useLocation } from 'react-router';
import { Home, FileText, DollarSign, Receipt, Gift, User } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Leave Request', path: '/leave-request' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll' },
    { icon: Receipt, label: 'Reimbursement', path: '/reimbursement' },
    { icon: Gift, label: 'Benefits', path: '/benefits' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col md:w-20 lg:w-64 border-r border-border bg-card sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted text-foreground'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:block font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
