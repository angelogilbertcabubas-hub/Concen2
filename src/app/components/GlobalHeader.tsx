import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useRole } from '../contexts/RoleContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext'; 
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../components/ui/sheet';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Calendar,
  Menu,
  Clock,
  FileText,
  Ticket,
  AppWindow,
  Archive,
  Mail,
  CheckCircle,
  Info,
  Home,
  DollarSign,
  Receipt,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import CompanyLogo from './CompanyLogo';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  sender: string;
  referenceId: string;
  priority: 'Routine' | 'Urgent' | 'Action Required';
  extendedMessage: string;
}

// Fabricated Role-Specific Notification Data Sets
const hrNotifs: Notification[] = [
  { 
    id: 'hr-1', title: 'Leave Request Pending', message: 'Hailey Swift (CSR) requested Sick Leave for April 10. Requires manager approval.', time: '10 mins ago', read: false,
    sender: 'HR Automated System', referenceId: 'LV-2026-892', priority: 'Action Required',
    extendedMessage: 'Employee Hailey Swift has submitted a medical certificate for a 1-day absence due to severe viral infection. The attached documents have been pre-verified by the clinic. Please review and apply the approval stamp to update the workforce roster.'
  },
  { 
    id: 'hr-2', title: 'Onboarding Task', message: 'New hire batch requires orientation document review and clearance.', time: '1 hour ago', read: false,
    sender: 'Talent Acquisition', referenceId: 'ONB-BATCH-42', priority: 'Urgent',
    extendedMessage: 'Batch 42 (15 new Customer Service Representatives) have completed their day 1 compliance modules. HR management signature is required on their NDO (Non-Disclosure Obligations) before system credentials can be dispatched.'
  },
  { 
    id: 'hr-3', title: 'Performance Review', message: 'Q1 Appraisals are due for the Customer Support Operations team.', time: '1 day ago', read: true,
    sender: 'Operations Director', referenceId: 'REV-Q1-26', priority: 'Routine',
    extendedMessage: 'This is an automated reminder that the Q1 Performance Appraisals window closes in 48 hours. Ensure all 1-on-1 coaching logs are synchronized with the central evaluation portal.'
  },
];

const financeNotifs: Notification[] = [
  { 
    id: 'fin-1', title: 'Reimbursement Claim', message: 'Jeff Hozier submitted an internet stipend claim for ₱1,500.', time: '5 mins ago', read: false,
    sender: 'Expense Portal', referenceId: 'RMB-99120', priority: 'Action Required',
    extendedMessage: 'A new internet allowance reimbursement claim has been routed to your queue. Receipt #ISP-0042 attached is valid and falls within the allowable threshold. Pending your final electronic signature for payout.'
  },
  { 
    id: 'fin-2', title: 'Payroll Processing', message: 'March 16-31 payroll draft is ready for final executive approval.', time: '2 hours ago', read: false,
    sender: 'Payroll System', referenceId: 'PAY-MAR-B2', priority: 'Urgent',
    extendedMessage: 'The preliminary payroll generation for the second half of March is complete. Total disbursements amount to ₱4,250,000. Night differentials and holiday premiums have been cross-checked with biometric logs. Awaiting sign-off.'
  },
  { 
    id: 'fin-3', title: 'Tax Report Generated', message: 'Q1 BIR Form 1601-C has been generated and filed successfully.', time: '1 day ago', read: true,
    sender: 'Treasury Department', referenceId: 'TAX-1601C-Q1', priority: 'Routine',
    extendedMessage: 'Confirmation: The quarterly withholding tax on compensation has been electronically filed via the eFPS portal. The digital receipt and confirmation reference have been archived in the compliance drive.'
  },
];

const csrNotifs: Notification[] = [
  { 
    id: 'csr-1', title: 'Schedule Update', message: 'Your shift on Friday has been adjusted to 8:00 AM - 5:00 PM.', time: '15 mins ago', read: false,
    sender: 'Workforce Management', referenceId: 'SCH-MOD-101', priority: 'Urgent',
    extendedMessage: 'Due to a sudden spike in forecasted call volumes for the morning queue, your Friday shift has been moved forward. Please ensure you are logged into the dialer by 7:55 AM. Thank you for your flexibility.'
  },
  { 
    id: 'csr-2', title: 'QA Score Available', message: 'Your Quality Assurance evaluation for week 2 is now published.', time: '3 hours ago', read: false,
    sender: 'QA Department', referenceId: 'QA-WK2-884', priority: 'Routine',
    extendedMessage: 'Your weekly call audit has been finalized. You scored an excellent 96% on your evaluated interaction with a frustrated customer. Empathy and resolution metrics were perfect. Click here to view the coaching notes.'
  },
  { 
    id: 'csr-3', title: 'Team Huddle', message: 'Mandatory team sync at 3:00 PM today via Microsoft Teams.', time: '5 hours ago', read: true,
    sender: 'Team Leader', referenceId: 'MTG-SYNC-09', priority: 'Action Required',
    extendedMessage: 'Please jump off the queue at 2:55 PM for a quick 15-minute huddle. We will be discussing the new process updates for the account password reset workflow. Attendance is mandatory.'
  },
];

// Mock Database for the Search Engine
const mockSearchData = [
  { id: 'EMP-00234', title: 'Clairo Webster', type: 'Employee', path: '/profile', icon: User },
  { id: 'EMP-00512', title: 'Hailey Swift', type: 'Employee', path: '/profile', icon: User },
  { id: 'TK-10234', title: 'Hardware Issue: Monitor replacement', type: 'Ticket', path: '/dashboard', icon: Ticket },
  { id: 'TK-10288', title: 'Payroll Dispute: Overtime mismatch', type: 'Ticket', path: '/payroll', icon: Ticket },
  { id: 'POL-001', title: 'Annual Leave Policy & Guidelines', type: 'Policy', path: '/benefits', icon: FileText },
  { id: 'POL-002', title: 'Code of Conduct 2026', type: 'Policy', path: '/profile', icon: FileText },
  { id: 'NAV-001', title: 'Reimbursement Portal', type: 'Page', path: '/reimbursement', icon: AppWindow },
  { id: 'NAV-002', title: 'My Attendance Logs', type: 'Page', path: '/attendance', icon: AppWindow },
];

export default function GlobalHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useRole();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme(); 
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEndShiftConfirm, setShowEndShiftConfirm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Dynamically load notifications based on active user role
  useEffect(() => {
    if (user?.roleTitle?.toLowerCase().includes('hr')) {
      setNotifications(hrNotifs);
    } else if (user?.roleTitle?.toLowerCase().includes('finance')) {
      setNotifications(financeNotifs);
    } else {
      setNotifications(csrNotifs);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEndShift = () => {
    setShowEndShiftConfirm(false);
    logout();
    navigate('/');
  };

  // Open modal and mark as read
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotifications(false); // Close dropdown
    setNotifications(prevNotifications =>
      prevNotifications.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  // Notification Actions
  const handleMarkAsUnread = () => {
    if (!selectedNotification) return;
    setNotifications(prev =>
      prev.map(n => (n.id === selectedNotification.id ? { ...n, read: false } : n))
    );
    setSelectedNotification(null);
  };

  const handleArchiveNotification = () => {
    if (!selectedNotification) return;
    setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
    setSelectedNotification(null);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return mockSearchData.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.id.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearchResultClick = (path: string) => {
    setShowSearch(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-card dark:bg-[#1B3045] border-r border-border dark:border-[#2a3f5a]">
                <MobileNav />
              </SheetContent>
            </Sheet>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
            >
              <CompanyLogo className="w-10 h-10 border border-border/40 bg-white shadow-sm" />
              <span className="hidden sm:inline font-bold text-lg text-[#1B3045] dark:text-foreground tracking-tight">
                ConcenTwo
              </span>
            </button>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-muted/70 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-xl text-muted-foreground hover:bg-muted dark:hover:bg-slate-800 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search Employee ID, Ticket #, Policy…</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSearch(true)}>
              <Search className="w-5 h-5" />
            </Button>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">
                Shift ends in 3h 18m
              </span>
            </div>

            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed md:absolute top-16 md:top-auto left-4 right-4 md:left-auto md:right-0 mt-2 md:w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        <span className="text-xs text-muted-foreground font-medium">{unreadCount} New</span>
                      </div>
                      
                      <div className="max-h-[320px] overflow-y-auto">
                        {notifications.length === 0 ? (
                           <div className="p-6 text-center text-muted-foreground text-sm">No notifications</div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 border-b border-border transition-all cursor-pointer select-none ${
                                !notification.read 
                                  ? 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800' 
                                  : 'bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm truncate transition-colors ${
                                    !notification.read ? 'text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-600 dark:text-slate-400 font-normal'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  
                                  <p className={`text-sm mt-1 truncate transition-colors ${
                                    !notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  
                                  <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mt-2 tracking-wider">
                                    {notification.time}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)] dark:shadow-[0_0_8px_rgba(251,191,36,0.2)]" />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/attendance')}
              title="My Attendance"
            >
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Theme">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.roleTitle}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setShowEndShiftConfirm(true)} className="hidden lg:flex bg-primary text-primary-foreground hover:bg-primary/90">
              End Shift
            </Button>
          </div>
        </div>
      </header>

      {/* Detailed Notification Modal */}
      <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 overflow-hidden border border-border bg-card shadow-xl">
          {selectedNotification && (
            <>
              <div className="p-6 pb-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Info className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold border-none ${
                      selectedNotification.priority === 'Action Required' ? 'bg-amber-500/10 text-amber-500' :
                      selectedNotification.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {selectedNotification.priority}
                    </Badge>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{selectedNotification.time}</span>
                </div>
                
                <DialogTitle className="text-xl font-bold text-foreground tracking-tight leading-tight mb-2">
                  {selectedNotification.title}
                </DialogTitle>
                
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/60 my-4 bg-muted/20 rounded-lg px-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Sender</span>
                    <p className="text-xs font-semibold text-foreground truncate">{selectedNotification.sender}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ref ID</span>
                    <p className="text-xs font-mono font-bold text-muted-foreground">{selectedNotification.referenceId}</p>
                  </div>
                </div>

                <div className="mt-4 mb-6">
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {selectedNotification.extendedMessage}
                  </p>
                </div>
              </div>

              <DialogFooter className="bg-muted/30 p-4 border-t border-border flex sm:justify-between items-center gap-2">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 sm:flex-none text-xs font-semibold border-border hover:bg-muted text-muted-foreground"
                    onClick={handleMarkAsUnread}
                  >
                    <Mail className="w-3.5 h-3.5 mr-1.5" /> Unread
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 sm:flex-none text-xs font-semibold border-border hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 text-muted-foreground"
                    onClick={handleArchiveNotification}
                  >
                    <Archive className="w-3.5 h-3.5 mr-1.5" /> Archive
                  </Button>
                </div>
                <Button 
                  size="sm"
                  className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold text-xs shadow-sm"
                  onClick={() => setSelectedNotification(null)}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Acknowledge
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Functional Interactive Search Modal */}
      <Dialog open={showSearch} onOpenChange={(open) => {
        setShowSearch(open);
        if (!open) setSearchQuery('');
      }}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Portal</DialogTitle>
            <DialogDescription>Search corporate employee listings, tickets, and policy documents.</DialogDescription>
          </DialogHeader>

          <div className="p-4 pr-12 bg-muted/30 border-b border-border relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search Employee ID, Ticket #, Policy…"
                className="pl-10 h-12 text-base bg-card border-border/60 focus-visible:ring-primary/50 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {!searchQuery.trim() ? (
              <div className="p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">Recent Searches</h4>
                <div className="space-y-1">
                  <button onClick={() => handleSearchResultClick('/profile')} className="flex items-center gap-3 text-sm text-foreground hover:bg-muted w-full text-left px-3 py-2.5 rounded-xl transition-colors">
                    <User className="w-4 h-4 text-muted-foreground" /> <span>Employee ID: EMP-00234</span>
                  </button>
                  <button onClick={() => handleSearchResultClick('/dashboard')} className="flex items-center gap-3 text-sm text-foreground hover:bg-muted w-full text-left px-3 py-2.5 rounded-xl transition-colors">
                    <Ticket className="w-4 h-4 text-muted-foreground" /> <span>Ticket #TK-10234</span>
                  </button>
                  <button onClick={() => handleSearchResultClick('/benefits')} className="flex items-center gap-3 text-sm text-foreground hover:bg-muted w-full text-left px-3 py-2.5 rounded-xl transition-colors">
                    <FileText className="w-4 h-4 text-muted-foreground" /> <span>Leave Policy</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-3 pt-2">Results for "{searchQuery}"</h4>
                    {searchResults.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.id} onClick={() => handleSearchResultClick(item.path)} className="flex items-center justify-between w-full text-left p-3 hover:bg-muted rounded-xl transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-muted group-hover:bg-background transition-colors">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground leading-tight">{item.title}</span>
                              <span className="text-xs text-muted-foreground font-mono mt-0.5">{item.id}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] font-semibold bg-background">{item.type}</Badge>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No results found</h3>
                    <p className="text-sm text-muted-foreground mt-1">We couldn't find anything matching "{searchQuery}".</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>Are you sure you want to logout? Any unsaved changes will be lost.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
            <Button onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEndShiftConfirm} onOpenChange={setShowEndShiftConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Shift</DialogTitle>
            <DialogDescription>Are you sure you want to end your shift? You will be logged out.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndShiftConfirm(false)}>Cancel</Button>
            <Button onClick={handleEndShift} className="bg-primary text-primary-foreground hover:bg-primary/90">End Shift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MobileNav() {
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
    <div className="flex flex-col h-full pt-10 px-4 bg-card dark:bg-[#1B3045]">
      {/* Mobile Sidebar Branding Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <CompanyLogo className="w-8 h-8 border border-border/40 bg-white shadow-sm" />
        <span className="font-bold text-lg text-[#1B3045] dark:text-white tracking-tight">
          ConcenTwo
        </span>
      </div>

      {/* Navigation List */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-[#fac06d] text-[#1B3045] shadow-md font-bold'
                  : 'text-[#1B3045] dark:text-slate-300 hover:bg-muted dark:hover:bg-white/10 hover:text-[#1B3045] dark:hover:text-white hover:translate-x-1.5'
              }`}
            >
              <Icon 
                className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                  isActive 
                    ? 'scale-110' 
                    : 'group-hover:scale-110 group-hover:text-[#fac06d]'
                }`} 
              />
              <span className="font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}