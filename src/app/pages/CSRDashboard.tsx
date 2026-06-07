import { useState } from 'react';
import { useRole } from '../contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { BookOpen, ChevronDown, ChevronUp, FileText, CheckCircle, AlertTriangle, Clock, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// Knowledge base dataset
const knowledgeBaseContent: Record<string, { title: string; subtitle: string; sections: { heading: string; lines: string[] }[] }> = {
  'Greeting Script': {
    title: 'Standard Customer Greeting & Verification Script',
    subtitle: 'Mandatory introduction protocol for all inbound interactions.',
    sections: [
      {
        heading: 'Opening Phrase',
        lines: [
          '"Thank you for calling ConcenTwo support! My name is Hailey. How can I provide you with exceptional service today?"',
          'Listen actively to the customer\'s initial problem statement without interrupting.',
        ],
      },
      {
        heading: 'Account Verification Procedure',
        lines: [
          '"To ensure your account security, may I please have your full name, account number, and the billing address on file?"',
          'Cross-reference the provided details with the active CRM profile matrix fields.',
          '"Thank you. I have successfully verified your identity. Let me look into this issue immediately for you."',
        ],
      },
    ],
  },
  'Payment Issue Resolution': {
    title: 'Payment Issue & Billing Discrepancy Guide',
    subtitle: 'Standard diagnostic flow for double-charging or failed invoice settlement.',
    sections: [
      {
        heading: 'De-escalation Scripting',
        lines: [
          '"I understand how alarming a billing discrepancy can be, and I will resolve this charge anomaly for you today."',
        ],
      },
      {
        heading: 'Standard Investigation Steps',
        lines: [
          '1. Request the customer\'s Payment Reference Transaction ID.',
          '2. Cross-check internal payment processing logs against the settlement system records.',
          '3. Identify if the entry status is marked as Pending, Settled, or Failed.',
          '4. If a double-charge is validated, route to the Finance module for prompt correction.',
        ],
      },
    ],
  },
  'Account Verification Process': {
    title: 'Advanced Identity Verification & MFA Lockouts',
    subtitle: 'Protocol for managing multi-factor locks or unauthorized detail adjustments.',
    sections: [
      {
        heading: 'Security Verification Standard',
        lines: [
          'Verify a minimum of three unique account parameters: Account ID, Email Address, and last transaction value.',
          'Never reveal account information before completing identity confirmation steps.',
        ],
      },
      {
        heading: 'Handling MFA Reset Requests',
        lines: [
          'If standard verification parameters match, generate a temporary system bypass verification token.',
          'Instruct the user: "I have dispatched a secure authentication code to your registered device. Please read it back to confirm authorization."',
        ],
      },
    ],
  },
  'Refund Policy': {
    title: 'ConcenTwo Service Level Agreement & Refund Framework',
    subtitle: 'Corporate policy matrix governing reimbursement eligibility limits.',
    sections: [
      {
        heading: 'Eligibility Criteria',
        lines: [
          'Reimbursement eligibility claims must be formally filed through the user interface within 30 days of invoice generation.',
          'Full reimbursements are allocated solely if system down-time metrics fall below the core SLA threshold.',
        ],
      },
      {
        heading: 'Processing Milestones',
        lines: [
          'Standard financial processing evaluations require 3-5 business days for management assessment.',
          'Approved transaction corrections are automatically credited back via the customer\'s original payment method.',
        ],
      },
    ],
  },
  'Password Reset Guide': {
    title: 'Self-Service & Assisted Password Reset Flow',
    subtitle: 'Resolution path for forgotten security parameters and system lockouts.',
    sections: [
      {
        heading: 'Assisted Reset Walkthrough',
        lines: [
          '"I can certainly assist you in restoring account access. I am sending a secure token path link to your profile email address."',
          'Instruct the customer to access their inbox, check spam filters if missing, and follow the layout prompt instructions.',
        ],
      },
      {
        heading: 'Troubleshooting Common Faults',
        lines: [
          'If the recovery token path expires, verify that the server time matches and execute a fresh link generation dispatch.',
          'If account remains locked out due to consecutive failed passwords, advise user to wait 15 minutes for security cooling parameters.',
        ],
      },
    ],
  },
};

type TicketItem = {
  id: string;
  title: string;
  user: string;
  time: string;
  priority: string;
  status: string;
  notes?: string; // NEW: Added optional notes field
};

export default function CSRDashboard() {
  const { user } = useRole();

  // Tickets dataset
  const [allTickets, setAllTickets] = useState<TicketItem[]>([
    { id: 'TK-10235', title: 'Account Verification', user: 'Sarah Johnson', time: '25 mins ago', priority: 'Medium', status: 'Open' },
    { id: 'TK-10236', title: 'Refund Request', user: 'Mike Brown', time: '1 hour ago', priority: 'High', status: 'Open' },
    { id: 'TK-10237', title: 'Password Reset', user: 'Emma Davis', time: '2 hours ago', priority: 'Low', status: 'Open' },
    { id: 'TK-10238', title: 'HMO Dependent Enrollment Inquiry', user: 'David Santos', time: '3 hours ago', priority: 'Low', status: 'Open' },
    { id: 'TK-10239', title: 'Payslip Discrepancy Claim', user: 'James Cruz', time: '4 hours ago', priority: 'High', status: 'Open' },
    { id: 'TK-10240', title: 'Figma Token Access Error', user: 'Charry Arga', time: '5 hours ago', priority: 'Medium', status: 'Open' },
  ]);

  // UI state variables
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedScriptKey, setSelectedScriptKey] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [ticketNote, setTicketNote] = useState(''); // NEW: Track the text input for the note

  // Sort tickets so 'Open' (unupdated) tickets are prioritized at the top
  const sortedTickets = [...allTickets].sort((a, b) => {
    if (a.status === 'Open' && b.status !== 'Open') return -1;
    if (a.status !== 'Open' && b.status === 'Open') return 1;
    return 0; // Maintain relative order if both have same status
  });

  // Determine tickets to view based on toggle state
  const visibleTickets = isExpanded ? sortedTickets : sortedTickets.slice(0, 3);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Low':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">Resolved</Badge>;
      case 'Escalated':
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20">Escalated</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Open</Badge>;
    }
  };

  const handleOpenTicketModal = (ticket: TicketItem) => {
    setSelectedTicket(ticket);
    setTicketNote(ticket.notes || ''); // Pre-fill with existing note if there is one
  };

  const handleUpdateTicketStatus = (newStatus: string) => {
    if (!selectedTicket) return;
    
    setAllTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, status: newStatus, notes: ticketNote } // Save the note alongside the status
          : ticket
      )
    );
    
    toast.success(`Ticket Updated`, {
      description: `${selectedTicket.id} has been marked as ${newStatus}.`
    });
    
    setSelectedTicket(null);
    setTicketNote('');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground mt-1">Here's your performance and queue overview today.</p>
      </div>

      {/* Main Grid Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tickets Queue Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Tickets Queue</CardTitle>
              <Badge variant="outline">{allTickets.length} Total</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {visibleTickets.map((ticket) => (
                    <motion.div
                      layout
                      key={ticket.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={() => handleOpenTicketModal(ticket)}
                      className="p-4 bg-muted/50 rounded-xl border border-border flex flex-col gap-2 overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-muted transition-all group"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#C78500] dark:text-primary group-hover:underline">{ticket.id}</span>
                            <Badge variant="outline" className={`text-[10px] px-2 py-0 ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority} Priority
                            </Badge>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <p className="font-semibold text-sm">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Customer: {ticket.user} • {ticket.time}
                          </p>
                        </div>
                      </div>
                      
                      {/* NEW: Visual display for existing notes directly on the card */}
                      {ticket.notes && (
                        <div className="mt-1 p-2.5 bg-background/50 border border-border/60 rounded-lg text-xs text-muted-foreground flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" />
                          <span className="line-clamp-2 leading-relaxed italic">"{ticket.notes}"</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Functional View All Tickets Action Button */}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" /> View All Tickets
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Customer Interactions Widget */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Customer Interactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'John Smith', activity: 'Payment processed successfully', log: '5 mins ago' },
                { name: 'Sarah Johnson', activity: 'Identity verification parameters authenticated', log: '15 mins ago' },
                { name: 'Mike Brown', activity: 'SLA refund claim request form evaluated', log: '1 hour ago' },
              ].map((interaction, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-foreground">{interaction.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{interaction.activity}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{interaction.log}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sidebar Knowledge Base Components */}
        <div className="space-y-6">
          {/* Leave Tracker summary panel */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Tracking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Sick Leave Credits</span>
                  <span>8 / 15 days</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '53%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Vacation Leave Credits</span>
                  <span>12 / 20 days</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Scripts & Knowledge Base Interactive Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="w-5 h-5" />
                <CardTitle className="text-foreground">Quick Scripts & Knowledge Base</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'Greeting Script',
                'Payment Issue Resolution',
                'Account Verification Process',
                'Refund Policy',
                'Password Reset Guide',
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full text-left p-3 rounded-lg bg-muted/50 dark:bg-slate-800/60 hover:bg-muted dark:hover:bg-slate-800/90 text-sm font-medium text-foreground hover:text-primary transition-all border border-transparent dark:border-slate-700/50 hover:border-border dark:hover:border-slate-600 flex items-center justify-between group shadow-sm dark:shadow-none"
                  onClick={() => setSelectedScriptKey(item)}
                >
                  <span>{item}</span>
                  <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ticket Management Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[450px] [&>button.absolute]:hidden">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="font-mono text-[#C78500] dark:text-primary bg-primary/5">{selectedTicket.id}</Badge>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedTicket.status)}
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setSelectedTicket(null)}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <DialogTitle className="text-xl font-bold">{selectedTicket.title}</DialogTitle>
                <DialogDescription>
                  Manage the status and notes for this customer request.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border border-border">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Customer Name</span>
                    <p className="text-sm font-semibold">{selectedTicket.user}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Priority Level</span>
                    <div>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* NEW: Input field for internal notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-xs font-semibold text-foreground">
                    Internal Notes / Comments
                  </label>
                  <textarea
                    id="notes"
                    value={ticketNote}
                    onChange={(e) => setTicketNote(e.target.value)}
                    placeholder="E.g., Escalated to billing team regarding double charge..."
                    className="w-full min-h-[90px] p-3 text-sm rounded-xl bg-muted/50 border border-border focus:ring-1 focus:ring-primary focus:border-primary resize-none placeholder:text-muted-foreground/60"
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <span className="text-sm font-semibold block">Update Status</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start text-xs ${selectedTicket.status === 'In Progress' ? 'border-blue-500 bg-blue-500/10 text-blue-600' : ''}`}
                      onClick={() => handleUpdateTicketStatus('In Progress')}
                    >
                      <Clock className="w-3.5 h-3.5 mr-2" /> In Progress
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start text-xs ${selectedTicket.status === 'Escalated' ? 'border-rose-500 bg-rose-500/10 text-rose-600' : ''}`}
                      onClick={() => handleUpdateTicketStatus('Escalated')}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mr-2" /> Escalate
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start text-xs ${selectedTicket.status === 'Resolved' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : ''}`}
                      onClick={() => handleUpdateTicketStatus('Resolved')}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-2" /> Resolve
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTicket(null)} className="px-4 py-2 border border-gray-300 rounded-lg">Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Knowledge Base Repository Modal Display Sheet */}
      <Dialog open={!!selectedScriptKey} onOpenChange={(open) => !open && setSelectedScriptKey(null)}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
          {selectedScriptKey && knowledgeBaseContent[selectedScriptKey] && (
            <>
              <DialogHeader className="p-6 border-b border-border bg-muted/30">
                <DialogTitle className="text-primary font-bold text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {knowledgeBaseContent[selectedScriptKey].title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs mt-1.5">
                  {knowledgeBaseContent[selectedScriptKey].subtitle}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {knowledgeBaseContent[selectedScriptKey].sections.map((section, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                      {section.heading}
                    </h4>
                    <div className="space-y-2">
                      {section.lines.map((line, lIdx) => {
                        const isQuote = line.startsWith('"');
                        return (
                          <p
                            key={lIdx}
                            className={`text-sm leading-relaxed ${
                              isQuote
                                ? 'p-3 bg-primary/10 border-l-4 border-primary rounded-r-lg font-mono italic text-foreground'
                                : 'text-muted-foreground pl-1'
                            }`}
                          >
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="p-4 border-t border-border bg-muted/20">
                <Button
                  type="button"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  onClick={() => setSelectedScriptKey(null)}
                >
                  Close Document
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}