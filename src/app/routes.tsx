import { createBrowserRouter, Navigate } from 'react-router';
import { useAuth } from './contexts/AuthContext';
import { useRole } from './contexts/RoleContext';
import RootLayout from './layouts/RootLayout';
import Login from './pages/Login';
import TeamLeaderDashboard from './pages/TeamLeaderDashboard';
import CSRDashboard from './pages/CSRDashboard';
import TechSupportDashboard from './pages/TechSupportDashboard';
import LeaveRequest from './pages/LeaveRequest';
import Payroll from './pages/Payroll';
import Reimbursement from './pages/Reimbursement';
import Benefits from './pages/Benefits';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from './components/LoadingStates';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Dashboard router based on role
function DashboardRouter() {
  const { user } = useRole();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [user.role]);

  if (loading) return <DashboardSkeleton />;
  
  switch (user.role) {
    case 'hr':
      return <TeamLeaderDashboard />;
    case 'employee':
      return <CSRDashboard />;
    case 'finance':
      return <TechSupportDashboard />;
    default:
      return <CSRDashboard />;
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardRouter />,
      },
      {
        path: 'leave-request',
        element: <LeaveRequest />,
      },
      {
        path: 'payroll',
        element: <Payroll />,
      },
      {
        path: 'reimbursement',
        element: <Reimbursement />,
      },
      {
        path: 'benefits',
        element: <Benefits />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);