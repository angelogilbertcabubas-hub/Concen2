import { useState } from 'react';
import { useRole } from '../contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Users,
  TrendingDown,
  HeartPulse,
  Check,
  X,
  AlertCircle,
  MessageSquare,
  User,
  Briefcase,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  TrendingUp,
  Phone,
  Calendar,
  Clock
} from 'lucide-react';
import { mockAgents, mockLeaveRequests, mockScheduleRequests, mockAbsences } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

type Agent = {
  id: string;
  name: string;
  status: string;
  aht: string;
  csat: number;
  quality: number;
};

// Custom Tooltip for the Sparkline Charts to match your images
const SparklineTooltip = ({ active, payload, label, chartColor, title }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-slate-100 text-xs rounded-lg p-2.5 shadow-xl border border-slate-700 min-w-[120px]">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        <p className="font-semibold" style={{ color: chartColor }}>
          {title} : {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function HRDashboard() {
  const { user } = useRole();
  const [error, setError] = useState(false);
  
  // Track requests inside component state
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [scheduleRequests, setScheduleRequests] = useState(mockScheduleRequests);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Rejection modal states
  const [rejectingItem, setRejectingItem] = useState<{
    id: string;
    name: string;
    type: 'leave' | 'schedule';
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Interactive Overlay States
  const [activeMessageAgent, setActiveMessageAgent] = useState<Agent | null>(null);
  const [chatText, setChatText] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [activeProfileAgent, setActiveProfileAgent] = useState<Agent | null>(null);

  // HR-Specific KPIs with Sparkline Data
  const kpis = [
    {
      title: 'Active Headcount',
      value: '1,245',
      trendText: '+12 hires this month',
      isPositiveTrend: true, // More headcount = positive growth
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      chartColor: '#3b82f6', // Tailwind blue-500
      data: [
        { name: 'Week 1', val: 1233 }, { name: 'Week 2', val: 1235 }, 
        { name: 'Week 3', val: 1238 }, { name: 'Week 4', val: 1245 }
      ]
    },
    {
      title: 'Absenteeism Rate',
      value: '2.4%',
      trendText: '-0.5% vs last week',
      isPositiveTrend: true, // Lower absenteeism = good (green)
      icon: TrendingDown,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      chartColor: '#22c55e', // Tailwind green-500
      data: [
        { name: 'Mon', val: 3.2 }, { name: 'Tue', val: 3.5 }, 
        { name: 'Wed', val: 2.9 }, { name: 'Thu', val: 2.6 }, { name: 'Fri', val: 2.4 }
      ]
    },
    {
      title: 'Open Requisitions',
      value: '18',
      trendText: '-4 filled this week',
      isPositiveTrend: true, // Fewer open reqs = hiring is happening (green)
      icon: Briefcase,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      chartColor: '#f59e0b', // Tailwind amber-500
      data: [
        { name: 'Mon', val: 22 }, { name: 'Tue', val: 21 }, 
        { name: 'Wed', val: 20 }, { name: 'Thu', val: 18 }, { name: 'Fri', val: 18 }
      ]
    },
    {
      title: 'Avg. eNPS Score',
      value: '+42',
      trendText: '+2 points this quarter',
      isPositiveTrend: true, // Higher eNPS = better morale
      icon: HeartPulse,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      chartColor: '#a855f7', // Tailwind purple-500
      data: [
        { name: 'Jan', val: 38 }, { name: 'Feb', val: 39 }, 
        { name: 'Mar', val: 40 }, { name: 'Apr', val: 42 }
      ]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500';
      case 'On Call': return 'bg-blue-500';
      case 'Break': return 'bg-yellow-500';
      case 'Offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleApprove = async (id: string, employeeName: string, type: 'leave' | 'schedule') => {
    setActionLoadingId(id);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (type === 'leave') {
      setLeaveRequests(prev => prev.filter(req => req.id !== id));
      toast.success('Leave Request Approved', { description: `Successfully approved leave request for ${employeeName}.` });
    } else {
      setScheduleRequests(prev => prev.filter(req => req.id !== id));
      toast.success('Schedule Change Approved', { description: `Successfully approved schedule swap for ${employeeName}.` });
    }
    setActionLoadingId(null);
  };

  const handleConfirmReject = async () => {
    if (!rejectingItem) return;
    const { id, name, type } = rejectingItem;

    setActionLoadingId(id);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (type === 'leave') {
      setLeaveRequests(prev => prev.filter(req => req.id !== id));
      toast.error('Leave Request Rejected', { description: `Rejected leave request for ${name}.` });
    } else {
      setScheduleRequests(prev => prev.filter(req => req.id !== id));
      toast.error('Schedule Change Rejected', { description: `Rejected schedule swap for ${name}.` });
    }

    setActionLoadingId(null);
    setRejectingItem(null);
    setRejectionReason('');
  };

  const handleSendMessage = async () => {
    if (!chatText.trim() || !activeMessageAgent) return;
    setIsSendingChat(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    toast.success(`Message Sent`, { description: `Forwarded securely to ${activeMessageAgent.name}.` });
    setIsSendingChat(false);
    setActiveMessageAgent(null);
    setChatText('');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h3 className="text-lg font-semibold">Error Loading Dashboard</h3>
            <Button onClick={() => setError(false)}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeLeaveCount = leaveRequests.filter(req => req.status === 'Pending').length;
  const activeScheduleCount = scheduleRequests.length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground mt-1">Here is your daily human resources and workforce overview.</p>
      </div>

      {/* KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.title}</p>
                      <p className="text-3xl font-bold mt-2 text-foreground tracking-tight">{kpi.value}</p>
                      <p className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${kpi.isPositiveTrend ? 'text-green-500 dark:text-green-400' : 'text-rose-500 dark:text-rose-400'}`}>
                        {kpi.isPositiveTrend ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {kpi.trendText}
                      </p>
                    </div>
                    <div className={`${kpi.bgColor} ${kpi.color} p-2.5 rounded-full`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Embedded Sparkline Chart */}
                  <div className="h-[45px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kpi.data}>
                        <Tooltip 
                          cursor={{ stroke: kpi.chartColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                          content={<SparklineTooltip chartColor={kpi.chartColor} title={kpi.title} />} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="val" 
                          stroke={kpi.chartColor} 
                          strokeWidth={2.5} 
                          dot={false} 
                          activeDot={{ r: 4, fill: kpi.chartColor, strokeWidth: 2, stroke: '#fff' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Live Roster & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Employee Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {mockAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(agent.status)}`} />
                    <div>
                      <p className="font-semibold text-sm">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Badge variant={agent.status === 'Available' ? 'default' : 'secondary'} className="text-[11px] font-medium px-2 py-0.5">
                      {agent.status}
                    </Badge>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title={`Send direct message to ${agent.name}`}
                      onClick={() => setActiveMessageAgent(agent)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title={`View detailed profile for ${agent.name}`}
                      onClick={() => setActiveProfileAgent(agent)}
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {/* Leave Requests Sub-Section */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Leave Requests</h4>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {activeLeaveCount > 0 ? (
                      leaveRequests
                        .filter(req => req.status === 'Pending')
                        .map((request) => (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-3 bg-muted/50 rounded-lg space-y-2 overflow-hidden"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-sm">{request.name}</p>
                                <p className="text-xs text-muted-foreground">{request.type}</p>
                                <p className="text-xs text-muted-foreground mt-1">{request.dates}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleApprove(request.id, request.name, 'leave')}
                                disabled={actionLoadingId === request.id}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 text-white border-none"
                                onClick={() => setRejectingItem({ id: request.id, name: request.name, type: 'leave' })}
                                disabled={actionLoadingId === request.id}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </motion.div>
                        ))
                    ) : (
                      <p className="text-xs text-muted-foreground py-2 italic text-center">No pending leave requests.</p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Schedule Changes Sub-Section */}
              <div className="pt-2">
                <h4 className="font-semibold text-sm mb-3">Schedule Changes</h4>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {activeScheduleCount > 0 ? (
                      scheduleRequests.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-3 bg-muted/50 rounded-lg space-y-2 overflow-hidden"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{request.name}</p>
                              <p className="text-xs text-muted-foreground">{request.request}</p>
                              <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleApprove(request.id, request.name, 'schedule')}
                              disabled={actionLoadingId === request.id}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 text-white border-none"
                              onClick={() => setRejectingItem({ id: request.id, name: request.name, type: 'schedule' })}
                              disabled={actionLoadingId === request.id}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground py-2 italic text-center">No pending schedule changes.</p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Who's Absent Today & Onboarding Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Who's Absent Today</CardTitle>
          </CardHeader>
          <CardContent>
            {mockAbsences.length > 0 ? (
              <div className="space-y-3">
                {mockAbsences.map((absence, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">{absence.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {absence.reason} • {absence.contact} • Since {absence.since}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No absences today</p>
            )}
          </CardContent>
        </Card>

        {/* Onboarding Pipeline Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {[
                { id: 'OB-01', name: 'Alex Rivera', role: 'Network Engineer', stage: 'Document Review', progress: 40 },
                { id: 'OB-02', name: 'Jamie Chen', role: 'Cybersecurity Analyst', stage: 'Orientation', progress: 75 },
                { id: 'OB-03', name: 'Taylor Swift', role: 'Customer Support', stage: 'Final Clearance', progress: 95 },
              ].map((hire) => (
                <div key={hire.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{hire.name}</p>
                      <p className="text-xs text-muted-foreground">{hire.role}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{hire.stage}</Badge>
                  </div>
                  <div className="w-full bg-muted-foreground/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${hire.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mandatory Request Rejection Reason Modal Overlay */}
      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive font-bold">Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a valid reason for rejecting the request submitted by{' '}
              <span className="font-semibold text-foreground">{rejectingItem?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <label htmlFor="reason" className="text-sm font-semibold">
                Reason for Rejection <span className="text-destructive">*</span>
              </label>
              <textarea
                id="reason"
                placeholder="Type the reason why this request is being denied..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[120px] flex w-full rounded-md bg-muted border-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setRejectingItem(null); setRejectionReason(''); }}>Cancel</Button>
            <Button
              type="button"
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim() || actionLoadingId === rejectingItem?.id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Operational Direct Message Action Modal Overlays */}
      <Dialog open={!!activeMessageAgent} onOpenChange={(open) => !open && setActiveMessageAgent(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Direct Message Portal
            </DialogTitle>
            <DialogDescription>
              Secure administrative messaging wire directly routed to{' '}
              <span className="font-semibold text-foreground">{activeMessageAgent?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <div className="space-y-2">
              <textarea
                placeholder={`Type an official message or announcement to transmit to ${activeMessageAgent?.name}...`}
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className="min-h-[130px] flex w-full rounded-md bg-muted border-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setActiveMessageAgent(null); setChatText(''); }}>Cancel</Button>
            <Button
              type="button"
              onClick={handleSendMessage}
              disabled={!chatText.trim() || isSendingChat}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              <Send className="w-4 h-4 mr-1.5" /> {isSendingChat ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESTORED: Comprehensive Agent Profile Overlay Sheet */}
      <Dialog open={!!activeProfileAgent} onOpenChange={(open) => !open && setActiveProfileAgent(null)}>
        <DialogContent className="sm:max-w-[500px] overflow-hidden p-0 bg-card border-border shadow-2xl">
          {activeProfileAgent && (
            <>
              {/* Profile Card Header Segment banner */}
              <div className="bg-muted/50 p-6 border-b border-border flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#f5a524] text-slate-900 flex items-center justify-center font-bold text-xl shadow-inner">
                  {activeProfileAgent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-bold text-foreground">{activeProfileAgent.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="text-[#f5a524]">{activeProfileAgent.id}</span>
                    <span>•</span>
                    <span className="text-foreground">{activeProfileAgent.status}</span>
                  </div>
                </div>
              </div>

              {/* Restored Detailed Grid Layout */}
              <div className="p-6 space-y-5 text-sm">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1.5">
                  Corporate Employee Credentials
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                  {/* Row 1 */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Department Position
                    </span>
                    <p className="font-bold text-foreground text-sm">Customer Service Representative</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Performance Tier
                    </span>
                    <p className="font-bold text-foreground text-sm">
                      Tier II <span className="text-muted-foreground font-medium text-xs">(Quality Score: <span className="text-purple-500 font-bold">{activeProfileAgent.quality}%</span>)</span>
                    </p>
                  </div>

                  {/* Row 2 */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </span>
                    <p className="font-bold text-foreground text-sm lowercase">{activeProfileAgent.name.replace(/\s+/g, '')}@concentwo.com</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Contact Number
                    </span>
                    <p className="font-bold text-foreground text-sm">+63 917 555 {activeProfileAgent.id.slice(-3).replace(/\D/g, '0').padStart(3, '0')}</p>
                  </div>

                  {/* Row 3 */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Active Shift Schedule
                    </span>
                    <p className="font-bold text-foreground text-sm">10:00 PM - 07:00 AM <span className="text-muted-foreground font-medium text-xs">(Graveyard)</span></p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Corporate Hire Date
                    </span>
                    <p className="font-bold text-foreground text-sm">November 14, 2024</p>
                  </div>
                </div>

                {/* Bottom Performance Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60">
                  <div className="text-center space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground">Assigned AHT Metric</p>
                    <p className="text-lg font-extrabold text-blue-500">{activeProfileAgent.aht}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground">Assigned CSAT Yield</p>
                    <p className="text-lg font-extrabold text-emerald-500">{activeProfileAgent.csat}%</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-4 border-t border-border bg-muted/20">
                <Button 
                  type="button" 
                  className="w-full bg-[#f5a524] text-slate-900 hover:bg-[#e0941d] font-bold" 
                  onClick={() => setActiveProfileAgent(null)}
                >
                  Close Profile Sheet
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}