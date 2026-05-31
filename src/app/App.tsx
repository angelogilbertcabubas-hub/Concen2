import { Routes, Route, Navigate, BrowserRouter, useLocation } from 'react-router';
import { RoleProvider, useRole } from './contexts/RoleContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; 
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

// Page Components
import Login from './pages/Login';
import TeamLeaderDashboard from './pages/TeamLeaderDashboard'; 
import CSRDashboard from './pages/CSRDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import Attendance from './pages/Attendance'; 
import LeaveRequest from './pages/LeaveRequest';
import Payroll from './pages/Payroll';
import Reimbursement from './pages/Reimbursement';
import Benefits from './pages/Benefits';
import Profile from './pages/Profile';

// Shared Layout Core UI Components
import GlobalHeader from './components/GlobalHeader';
import Sidebar from './components/Sidebar';

function DashboardSwitcher() {
  const { user } = useRole();

  // Route employee/csr roles explicitly to the CSRDashboard
  if (user.role === 'employee' || user.role === 'csr') {
    return <CSRDashboard />;
  }
  
  // Route hr and team leaders to the TeamLeaderDashboard
  if (user.role === 'hr' || user.role === 'team-leader') {
    return <TeamLeaderDashboard />;
  }
  
  // Route finance role to the FinanceDashboard
  if (user.role === 'finance') {
    return <FinanceDashboard />;
  }
  
  // Fallback route
  return <CSRDashboard />;
}

function MainLayout() {
  // 1. Get the current route location
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <GlobalHeader />
      
      <div className="flex">
        <aside className="hidden lg:block w-64 border-r border-border h-[calc(100vh-64px)] sticky top-16 bg-card transition-colors duration-200">
          <Sidebar />
        </aside>
        
        <main className="flex-1 p-6 h-[calc(100vh-64px)] overflow-x-hidden overflow-y-auto">
          
          {/* 2. Wrap the dynamic content area in AnimatePresence */}
          <AnimatePresence mode="wait">
            
            {/* 3. The Motion Container that actually animates */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full"
            >
              
              {/* 4. Pass the location explicitly to Routes so it doesn't instantly snap on exit */}
              <Routes location={location}>
                <Route path="/dashboard" element={<DashboardSwitcher />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leave-request" element={<LeaveRequest />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/reimbursement" element={<Reimbursement />} />
                <Route path="/benefits" element={<Benefits />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              
            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <Toaster richColors closeButton position="top-right" />
            <Routes>
              <Route path="/" element={<Login />} />
              {/* The /* wildcard is critical here so child routes don't break */}
              <Route path="/*" element={<MainLayout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}