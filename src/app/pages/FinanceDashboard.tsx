import { useState } from 'react';
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
import { Activity, Check, X, FileText, ChevronRight, Building2, ShieldAlert, Layers, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ApprovalItem = {
  id: string;
  category?: string;
  amount?: string;
  description?: string;
  from?: string;
  priority?: 'Critical' | 'High' | 'Medium' | 'Low';
  submittedAt?: string;
};

type DocContent = {
  title: string;
  scope: string;
  guidelines: string[];
};

type DetailModalContent = {
  title: string;
  id: string;
  meta: Record<string, string>;
  breakdown: Record<string, string>;
};

export default function FinanceOperationsDashboard() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<DocContent | null>(null);
  const [rejectingItem, setRejectingItem] = useState<ApprovalItem | null>(null);
  const [approvingItem, setApprovingItem] = useState<ApprovalItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [inspectingDetails, setInspectingDetails] = useState<DetailModalContent | null>(null);

  const metrics = [
    { title: 'Budget Utilization', value: '67%', status: 'On track', statusStyle: 'bg-amber-500/10 text-amber-500 dark:text-amber-400', progress: 67, barColor: 'bg-amber-400' },
    { title: 'Budget Remaining', value: '₱ 449,235 / ₱ 670,500', status: 'On track', statusStyle: 'bg-amber-500/10 text-amber-500 dark:text-amber-400', progress: 65, barColor: 'bg-amber-500' },
    { title: 'Invoice System', value: '45ms', status: 'Excellent', statusStyle: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400', progress: 45, barColor: 'bg-emerald-500' },
    { title: 'Payment Processing', value: '85ms', status: 'Excellent', statusStyle: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400', progress: 30, barColor: 'bg-emerald-500' },
  ];

  const payrollData = [
    { month: 'Jan', amount: 3.8 },
    { month: 'Feb', amount: 3.9 },
    { month: 'Mar', amount: 4.1 },
    { month: 'Apr', amount: 4.2 },
    { month: 'May', amount: 4.25 },
  ];

  // Expanded Mock Data with Reimbursements
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    { id: 'TGG-410', category: 'Event', amount: '₱ - 19,250', description: '(Company Party: For Daisy) [Payment]', from: 'Scott Fitzgerald', priority: 'Critical', submittedAt: 'May 28, 2026' },
    { id: 'ART-2033', category: 'Equipment', amount: '₱ - 8,250', description: '(Artemis III Network Cables) [Payment]', from: 'NASA', priority: 'High', submittedAt: 'May 29, 2026' },
    { id: 'XOXO-143', category: 'Pay', amount: '₱ - 6,700', description: '(Overtime Compensation) [Payment]', from: 'Backburner', priority: 'Medium', submittedAt: 'May 30, 2026' },
    { id: 'TRV-992', category: 'Travel', amount: '₱ - 3,450', description: '(Client Visit - Transport/Meals) [Reimbursement]', from: 'Sarah Jenkins', priority: 'Medium', submittedAt: 'May 25, 2026' },
    { id: 'SFT-102', category: 'Software', amount: '₱ - 2,100', description: '(Adobe Cloud Subscription) [Reimbursement]', from: 'Mark Rivera', priority: 'Low', submittedAt: 'May 26, 2026' },
    { id: 'OFC-774', category: 'Supplies', amount: '₱ - 4,200', description: '(Ergonomic Office Chair Component) [Reimbursement]', from: 'Elena Rose', priority: 'High', submittedAt: 'May 27, 2026' },
    { id: 'EDU-551', category: 'Training', amount: '₱ - 12,000', description: '(AWS Certification Exam) [Reimbursement]', from: 'David Santos', priority: 'High', submittedAt: 'May 28, 2026' },
    { id: 'TEL-443', category: 'Telecom', amount: '₱ - 1,800', description: '(Remote Work Internet Subsidy) [Reimbursement]', from: 'Jeff Hozier', priority: 'Low', submittedAt: 'May 29, 2026' },
    { id: 'MNT-881', category: 'Maintenance', amount: '₱ - 5,600', description: '(Office Appliance Repair) [Reimbursement]', from: 'Kevin Garcia', priority: 'Medium', submittedAt: 'May 30, 2026' }
  ]);

  const documentationData: Record<string, DocContent> = {
    'Tax Compliance Guide': {
      title: 'PEZA & VAT Tax Compliance Guide',
      scope: 'Applicable to export-oriented BPO service seats, international client invoices, and local zero-rated VAT processing.',
      guidelines: [
        'Ensure all client invoices contain the registered PEZA or BOI entitlement numbers to qualify for 0% VAT treatments.',
        'Withholding taxes for local operational vendors must strictly adhere to the updated BIR Expanded Withholding Tax (EWT) grid.',
        'Submit monthly sales declarations and proof of foreign currency inward remittances through the corporate bank portal by the 10th.',
      ],
    },
    'Expense Policy': {
      title: 'BPO Operational Expense & Procurement Policy',
      scope: 'Standard limits for client accounts, workforce shifts, and hardware provisioning across production floor teams.',
      guidelines: [
        'Team bonding or employee milestones (e.g., account milestones) are strictly capped at ₱500 per head, subject to management approval.',
        'Night shift taxi allowances or shuttle subsidies must match valid trip logs validated directly against active internal roster files.',
        'Hardware procurement items exceeding ₱5,000 must route through standard competitive bidding processes with three registered suppliers.',
      ],
    },
    'Audit Procedures': {
      title: 'Night Differential & Payroll Audit Procedures',
      scope: 'Standard control checks ensuring alignment between recorded agent hours, biometric logs, and payroll payouts.',
      guidelines: [
        'Cross-reference client system production logs against timecard data before signing off on active shift disbursements.',
        'Audit 10% of total night differential premiums (10 PM to 6 AM shifts) manually against biometric gate passes weekly.',
        'Flag split-shift adjustments or holiday premiums exceeding 16 continuous hours for mandatory site leader exceptions.',
      ],
    },
  };

  const systemLogs = [
    { id: 'LOG-991', status: 'APPROVED', statusClass: 'text-green-500 border-green-500/20 bg-green-500/5', time: '9:38 PM', title: 'Project: Hail Mary' },
    { id: 'LOG-992', status: 'RETURNED FOR ADJUSTMENT', statusClass: 'text-amber-500 border-amber-500/20 bg-amber-500/5', time: '2:00 PM', title: 'Salary Negotiation' },
  ];

  const handleConfirmReject = async () => {
    if (!rejectingItem) return;
    const targetId = rejectingItem.id;
    setLoadingId(targetId);
    await new Promise((res) => setTimeout(res, 500));
    setApprovals((prev) => prev.filter((item) => item.id !== targetId));
    toast.error(`Request ${targetId} has been rejected.`, {
      className: 'bg-rose-500 text-white border-none',
    });
    setRejectingItem(null);
    setRejectionReason('');
    setLoadingId(null);
  };

  const handleConfirmApprove = async () => {
    if (!approvingItem) return;
    const targetId = approvingItem.id;
    setLoadingId(targetId);
    await new Promise((res) => setTimeout(res, 500));
    setApprovals((prev) => prev.filter((item) => item.id !== targetId));
    toast.success(`Request ${targetId} has been approved.`, {
      className: 'bg-emerald-500 text-white border-none',
    });
    setApprovingItem(null);
    setApprovalRemarks('');
    setLoadingId(null);
  };

  const triggerViewDetails = (source: ApprovalItem | typeof systemLogs[number]) => {
    if ('status' in source) {
      setInspectingDetails({
        title: source.title,
        id: source.id,
        meta: { 'Log Reference': source.id, 'Timestamp': source.time, 'System Evaluation': source.status },
        breakdown: { 'Allocation Scope': 'Cross-dock project resource pooling.', 'Audit Sign-off': 'Passed parameters.', 'Clearing Channel': 'Treasury Ledger Direct' },
      });
    } else {
      const submitted = source.submittedAt || 'Unknown';
      const deadline = new Date(new Date(submitted).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      
      setInspectingDetails({
        title: source.description?.replace(/[()\[\]]/g, '') || 'Reimbursement Audit File',
        id: source.id,
        meta: { 
          'Request ID': source.id, 
          'Filing Representative': source.from || 'System Entry', 
          'Risk Categorization': source.priority || 'Standard',
          'Submitted Date': submitted,
          'Deadline Date': deadline
        },
        breakdown: { 'Declared Amount': source.amount || '₱0.00', 'BPO Classification': source.category || 'Operational Overhead', 'System Validation Line': 'Awaiting executive lock.' },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 text-foreground antialiased">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back, Jeff Hozier</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Financial Operations and Budget Overview</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white/90">Financial Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <Card key={i} className="shadow-sm border-border bg-card">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">{metric.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tracking-tight text-card-foreground">{metric.value}</span>
                      <Badge className={`text-[10px] font-bold rounded px-1.5 py-0 border-none ${metric.statusStyle}`}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                  <Activity className="w-4 h-4 text-amber-400 opacity-70" />
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${metric.barColor} rounded-full`} style={{ width: `${metric.progress}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border bg-card">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-slate-900 dark:text-white/90">Pending Approvals</CardTitle></CardHeader>
          {/* SCROLLBAR FIX: Added 'custom-scrollbar' class here */}
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {approvals.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 1 }} exit={{ opacity: 0, x: -30, height: 0 }} transition={{ duration: 0.2 }} className="p-4 bg-muted/30 dark:bg-muted/10 border border-border rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-card-foreground text-xs">{item.id}</span>
                        {item.category && <Badge variant="outline" className="text-[9px] bg-background text-muted-foreground border-border px-1.5 py-0 rounded">{item.category}</Badge>}
                      </div>
                      <p className="text-xs font-bold text-card-foreground"><span className="text-rose-600 dark:text-rose-400 font-extrabold">{item.amount}</span> <span className="font-medium text-muted-foreground ml-0.5">{item.description}</span></p>
                      <p className="text-[10px] text-muted-foreground/80">From: {item.from}</p>
                      {item.submittedAt && <p className="text-[10px] font-semibold text-muted-foreground mt-1">Submitted: {item.submittedAt}</p>}
                    </div>
                    <Badge className={`text-[9px] font-bold px-1.5 py-0 rounded text-white ${item.priority === 'Critical' ? 'bg-rose-600' : 'bg-amber-500'}`}>{item.priority}</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => triggerViewDetails(item)} className="w-full sm:flex-1 flex items-center justify-between px-4 py-2 bg-background border border-border rounded-lg text-xs font-semibold text-muted-foreground shadow-sm hover:bg-muted/50">View Details <ChevronRight className="w-3.5 h-3.5" /></button>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={loadingId !== null} onClick={() => setApprovingItem(item)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 rounded-lg flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </Button>
                      <Button size="sm" disabled={loadingId !== null} onClick={() => setRejectingItem(item)} className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-4 rounded-lg flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader><CardTitle className="text-sm font-bold text-slate-900 dark:text-white/90">Internal Documentation</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(documentationData).map((docKey) => (
              <button key={docKey} onClick={() => setActiveDoc(documentationData[docKey])} className="w-full flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/10 border border-border rounded-xl hover:bg-amber-500/10 transition-all text-left">
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-card-foreground">{docKey}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader><CardTitle className="text-base font-bold text-slate-900 dark:text-white/90">Payroll Distribution Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={payrollData}>
                <defs><linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FFC570" stopOpacity={0.8}/><stop offset="95%" stopColor="#FFC570" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fill: 'currentColor', opacity: 0.7 }} />
                {/* UPDATED LABEL HERE */}
                <YAxis tick={{ fill: 'currentColor', opacity: 0.7 }} label={{ value: 'Millions (₱)', angle: -90, position: 'insideLeft', fill: 'currentColor', opacity: 0.7 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="amount" stroke="#FFC570" strokeWidth={2} fillOpacity={1} fill="url(#colorPayroll)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* --- High Contrast Modals --- */}
      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent className="sm:max-w-[425px] bg-card p-6 border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-rose-600 dark:text-rose-400">Reject Request</DialogTitle>
            <DialogDescription className="text-sm text-foreground pt-2">
              Please provide a valid reason for rejecting the request submitted by{' '}
              <span className="font-semibold">{rejectingItem?.from}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request Summary</p>
              <p className="text-sm font-medium text-foreground">{rejectingItem?.id} - {rejectingItem?.category}</p>
              <p className="text-xs text-muted-foreground">{rejectingItem?.description}</p>
              <p className="text-xs font-bold text-rose-500 mt-1">{rejectingItem?.amount}</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="reason" className="text-sm font-semibold">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="reason"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Required. Provide justification for the rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-semibold">Attachments (Optional)</span>
              <label htmlFor="file-upload-reject-finance" className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <input id="file-upload-reject-finance" type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
                <p className="text-xs text-muted-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-[10px] text-muted-foreground/70">PDF, JPG, PNG up to 5MB</p>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => { setRejectingItem(null); setRejectionReason(''); }}>Cancel</Button>
            <Button
              type="button"
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim() || loadingId === rejectingItem?.id}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!approvingItem} onOpenChange={(open) => !open && setApprovingItem(null)}>
        <DialogContent className="sm:max-w-[425px] bg-card p-6 border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Confirm Approval</DialogTitle>
            <DialogDescription className="text-sm text-foreground pt-2">
              Review the details before approving the request submitted by{' '}
              <span className="font-semibold">{approvingItem?.from}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request Summary</p>
              <p className="text-sm font-medium text-foreground">{approvingItem?.id} - {approvingItem?.category}</p>
              <p className="text-xs text-muted-foreground">{approvingItem?.description}</p>
              <p className="text-xs font-bold text-rose-500 mt-1">{approvingItem?.amount}</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="remarks" className="text-sm font-semibold">
                Remarks (Optional)
              </label>
              <textarea
                id="remarks"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Add any notes for the requester..."
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-semibold">Attachments (Optional)</span>
              <label htmlFor="file-upload-approve-finance" className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <input id="file-upload-approve-finance" type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
                <p className="text-xs text-muted-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-[10px] text-muted-foreground/70">PDF, JPG, PNG up to 5MB</p>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => { setApprovingItem(null); setApprovalRemarks(''); }}>Cancel</Button>
            <Button
              type="button"
              onClick={handleConfirmApprove}
              disabled={loadingId === approvingItem?.id}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!inspectingDetails} onOpenChange={(open) => !open && setInspectingDetails(null)}>
        <DialogContent className="bg-card text-foreground border border-border sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{inspectingDetails?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-2">
            <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-xl border border-border">
              {inspectingDetails && Object.entries(inspectingDetails.meta).map(([key, val]) => (
                <div key={key} className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{key}</span>
                  <p className={key === 'Deadline Date' ? "text-xs font-semibold text-rose-500 dark:text-rose-400" : "text-xs font-bold text-foreground dark:text-slate-100"}>{val}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase">Operational Breakdown</h4>
              <div className="divide-y divide-border border border-border rounded-xl bg-background text-xs">
                {inspectingDetails && Object.entries(inspectingDetails.breakdown).map(([label, description]) => (
                  <div key={label} className="flex justify-between p-3">
                    <span className="font-semibold text-muted-foreground">{label}</span>
                    <span className="font-bold text-foreground dark:text-slate-100 text-right">{description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setInspectingDetails(null)} className="w-full bg-[#0f2d59] hover:bg-[#0f2d59]/90 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors">Close Record View</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!activeDoc} onOpenChange={(open) => !open && setActiveDoc(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card text-foreground">
          <DialogHeader><DialogTitle className="text-xl font-bold">{activeDoc?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed text-foreground dark:text-slate-100 font-medium">
            <p>{activeDoc?.scope}</p>
            <ul className="list-disc pl-5 space-y-2">
                {activeDoc?.guidelines.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
          <DialogFooter><Button onClick={() => setActiveDoc(null)} className="bg-amber-600 text-white rounded-xl">Acknowledge</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}