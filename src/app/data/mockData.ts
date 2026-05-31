export const mockAgents = [
  { id: '001', name: 'Maria Santos', status: 'Available', aht: '4:15', csat: 94, quality: 98 },
  { id: '002', name: 'Juan Dela Cruz', status: 'On Call', aht: '5:22', csat: 89, quality: 95 },
  { id: '003', name: 'Ana Reyes', status: 'Available', aht: '3:58', csat: 96, quality: 99 },
  { id: '004', name: 'Pedro Garcia', status: 'Break', aht: '4:45', csat: 91, quality: 94 },
  { id: '005', name: 'Sofia Bautista', status: 'Available', aht: '4:10', csat: 93, quality: 97 },
  { id: '006', name: 'Miguel Torres', status: 'On Call', aht: '4:52', csat: 88, quality: 92 },
  { id: '007', name: 'Isabella Cruz', status: 'Available', aht: '4:05', csat: 95, quality: 98 },
  { id: '008', name: 'Diego Ramos', status: 'Offline', aht: '5:15', csat: 87, quality: 91 },
  { id: '009', name: 'Lucia Fernandez', status: 'Available', aht: '3:50', csat: 97, quality: 99 },
  { id: '010', name: 'Carlos Mendoza', status: 'On Call', aht: '4:38', csat: 90, quality: 93 },
  { id: '011', name: 'Rosa Villanueva', status: 'Available', aht: '4:20', csat: 92, quality: 96 },
  { id: '012', name: 'Antonio Lopez', status: 'Break', aht: '4:55', csat: 89, quality: 94 },
  { id: '013', name: 'Elena Martinez', status: 'Available', aht: '4:08', csat: 94, quality: 97 },
  { id: '014', name: 'Ricardo Gomez', status: 'On Call', aht: '4:42', csat: 91, quality: 95 },
  { id: '015', name: 'Carmen Silva', status: 'Available', aht: '4:12', csat: 93, quality: 98 },
];

export const mockLeaveRequests = [
  { id: 'LR-2026-001', name: 'Maria Santos', type: 'Sick Leave', dates: 'Apr 5 - Apr 7', status: 'Pending', amount: null },
  { id: 'LR-2026-002', name: 'Juan Dela Cruz', type: 'Vacation Leave', dates: 'Apr 10 - Apr 14', status: 'Pending', amount: null },
  { id: 'LR-2026-003', name: 'Ana Reyes', type: 'Emergency Leave', dates: 'Apr 3', status: 'Approved', amount: null },
];

export const mockScheduleRequests = [
  { id: 'SR-2026-001', name: 'Pedro Garcia', request: 'Shift swap with Sofia Bautista', date: 'Apr 8', status: 'Pending' },
  { id: 'SR-2026-002', name: 'Miguel Torres', request: 'Early out request - 2 hours', date: 'Apr 5', status: 'Pending' },
];

export const mockAbsences = [
  { name: 'Diego Ramos', reason: 'Sick Leave', contact: 'Notified', since: '9:00 AM' },
];

export const mockTickets = [
  { id: 'TK-10234', customer: 'John Smith', subject: 'Payment Issue', priority: 'High', status: 'Open', time: '10 mins ago' },
  { id: 'TK-10235', customer: 'Sarah Johnson', subject: 'Account Verification', priority: 'Medium', status: 'Open', time: '25 mins ago' },
  { id: 'TK-10236', customer: 'Mike Brown', subject: 'Refund Request', priority: 'High', status: 'Open', time: '1 hour ago' },
  { id: 'TK-10237', customer: 'Emma Davis', subject: 'Password Reset', priority: 'Low', status: 'In Progress', time: '2 hours ago' },
];

export const mockBugTickets = [
  { id: 'BUG-5012', system: 'CRM Portal', issue: 'Login timeout error', priority: 'Critical', assigned: 'Jeff Hozier', status: 'In Progress' },
  { id: 'BUG-5013', system: 'Payroll API', issue: 'Duplicate entry on OT calculation', priority: 'High', assigned: 'Jeff Hozier', status: 'Open' },
  { id: 'BUG-5014', system: 'HR Dashboard', issue: 'Leave balance not updating', priority: 'Medium', assigned: 'Support Team', status: 'Open' },
];

export const mockPayslips = [
  { period: 'March 16-31, 2026', amount: 28450, issued: 'Apr 1, 2026', status: 'Paid' },
  { period: 'March 1-15, 2026', amount: 27890, issued: 'Mar 16, 2026', status: 'Paid' },
  { period: 'February 16-28, 2026', amount: 28100, issued: 'Mar 1, 2026', status: 'Paid' },
  { period: 'February 1-15, 2026', amount: 27650, issued: 'Feb 16, 2026', status: 'Paid' },
];

export const mockReimbursements = [
  { id: 'RB-2026-042', type: 'Transportation', amount: 850, date: 'Mar 28, 2026', status: 'Approved' },
  { id: 'RB-2026-041', type: 'Internet Allowance', amount: 1500, date: 'Mar 15, 2026', status: 'Paid' },
  { id: 'RB-2026-038', type: 'Office Supplies', amount: 450, date: 'Mar 10, 2026', status: 'Paid' },
];

export const mockLeaveHistory = [
  { id: 'LV-2026-012', type: 'Sick Leave', dates: 'Mar 20-21, 2026', days: 2, status: 'Approved' },
  { id: 'LV-2026-008', type: 'Vacation Leave', dates: 'Feb 14-18, 2026', days: 5, status: 'Approved' },
  { id: 'LV-2026-003', type: 'Emergency Leave', dates: 'Jan 25, 2026', days: 1, status: 'Approved' },
];

export const benefits = [
  {
    title: 'Competitive Salary',
    description: 'We offer industry-leading compensation packages with regular performance reviews and salary adjustments.',
    icon: 'peso',
  },
  {
    title: 'Health & Wellness',
    description: 'Comprehensive HMO coverage for you and your dependents, plus mental health support and wellness programs.',
    icon: 'heart',
  },
  {
    title: 'Paid Leave',
    description: '20 days paid time off annually, plus sick leave, emergency leave, and special holiday benefits.',
    icon: 'calendar',
  },
  {
    title: 'Training & Career Development',
    description: 'Continuous learning opportunities, certifications, and clear career progression paths.',
    icon: 'graduation',
  },
  {
    title: 'Flexible Work',
    description: 'Hybrid work arrangements, flexible scheduling, and work-life balance initiatives.',
    icon: 'clock',
  },
  {
    title: 'Performance Incentives',
    description: 'Monthly performance bonuses, quarterly incentives, and annual achievement awards.',
    icon: 'award',
  },
  {
    title: 'Employee Recognition',
    description: 'Regular recognition programs, employee of the month awards, and team celebrations.',
    icon: 'star',
  },
  {
    title: 'Job Security',
    description: 'Stable employment with a growing company, regularization benefits, and retirement planning.',
    icon: 'shield',
  },
];

export const systemLogs = [
  { time: '9:38 PM', event: 'CRM_API: Authentication success - User: maria.santos@concentwo.com', level: 'info' },
  { time: '9:35 PM', event: 'PAYROLL_SYS: Batch process completed - 487 records updated', level: 'success' },
  { time: '9:32 PM', event: 'HR_PORTAL: Connection timeout - Retrying...', level: 'warning' },
  { time: '9:28 PM', event: 'CRM_API: High response time detected - 450ms', level: 'warning' },
  { time: '9:25 PM', event: 'BACKUP_SYS: Daily backup completed successfully', level: 'success' },
];
