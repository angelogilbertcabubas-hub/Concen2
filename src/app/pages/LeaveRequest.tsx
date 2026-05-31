import { useState } from 'react';
import { useRole } from '../contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Calendar, Check, X, Loader2 } from 'lucide-react';
import { mockLeaveHistory } from '../data/mockData';
import { toast } from 'sonner';

export default function LeaveRequest() {
  const { user } = useRole();

  const [loading, setLoading] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedLeaveId, setSelectedLeaveId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!leaveType) newErrors.leaveType = 'This field is required';
    if (!startDate) newErrors.startDate = 'This field is required';
    if (!endDate) newErrors.endDate = 'This field is required';
    if (!reason) newErrors.reason = 'This field is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);

    toast.success('Leave Request Submitted Successfully!', {
      description: 'Your request has been sent for approval.',
    });

    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setAmount('');
  };

  const handleReject = (leaveId: string) => {
    setSelectedLeaveId(leaveId);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success('Leave request rejected', {
      description: 'The employee has been notified.',
    });

    setShowRejectModal(false);
    setRejectReason('');
    setSelectedLeaveId('');
  };

  const canApprove = user.role === 'team-leader';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Leave Request</h1>
        <p className="text-muted-foreground mt-1">
          Submit and manage your leave requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Submit Leave Request</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Leave Type */}
              <div className="space-y-2">
                <Label htmlFor="leave-type">
                  Leave Type <span className="text-destructive">*</span>
                </Label>

                <Select
                  value={leaveType}
                  onValueChange={(val) => {
                    setLeaveType(val);
                    setErrors({ ...errors, leaveType: '' });
                  }}
                >
                  <SelectTrigger
                    id="leave-type"
                    className={errors.leaveType ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="vacation">Vacation Leave</SelectItem>
                    <SelectItem value="emergency">Emergency Leave</SelectItem>
                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                    <SelectItem value="paternity">Paternity Leave</SelectItem>
                  </SelectContent>
                </Select>

                {errors.leaveType && (
                  <p className="text-sm text-destructive">
                    {errors.leaveType}
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="start-date">
                    Start Date <span className="text-destructive">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setErrors({ ...errors, startDate: '' });
                      }}
                      className={`
                        pr-10
                        appearance-none
                        ${errors.startDate ? 'border-destructive' : ''}
                        [&::-webkit-calendar-picker-indicator]:opacity-0
                        [&::-webkit-calendar-picker-indicator]:absolute
                        [&::-webkit-calendar-picker-indicator]:right-0
                        [&::-webkit-calendar-picker-indicator]:w-[40px]
                        [&::-webkit-calendar-picker-indicator]:h-full
                        [&::-webkit-calendar-picker-indicator]:cursor-pointer
                      `}
                    />

                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3263] dark:text-white pointer-events-none" />
                  </div>

                  {errors.startDate && (
                    <p className="text-sm text-destructive">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="end-date">
                    End Date <span className="text-destructive">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setErrors({ ...errors, endDate: '' });
                      }}
                      className={`
                        pr-10
                        appearance-none
                        ${errors.endDate ? 'border-destructive' : ''}
                        [&::-webkit-calendar-picker-indicator]:opacity-0
                        [&::-webkit-calendar-picker-indicator]:absolute
                        [&::-webkit-calendar-picker-indicator]:right-0
                        [&::-webkit-calendar-picker-indicator]:w-[40px]
                        [&::-webkit-calendar-picker-indicator]:h-full
                        [&::-webkit-calendar-picker-indicator]:cursor-pointer
                      `}
                    />

                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3263] dark:text-white pointer-events-none" />
                  </div>

                  {errors.endDate && (
                    <p className="text-sm text-destructive">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Reason <span className="text-destructive">*</span>
                </Label>

                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for your leave request..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setErrors({ ...errors, reason: '' });
                  }}
                  className={errors.reason ? 'border-destructive' : ''}
                  rows={4}
                />

                {errors.reason && (
                  <p className="text-sm text-destructive">
                    {errors.reason}
                  </p>
                )}
              </div>

              {/* Optional Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Optional)</Label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₱
                  </span>

                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  For emergency leave with expenses
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Leave Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Sick Leave
                  </span>

                  <span className="font-semibold">8 days</span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: '80%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Vacation Leave
                  </span>

                  <span className="font-semibold">12 days</span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Emergency Leave
                  </span>

                  <span className="font-semibold">3 days</span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {mockLeaveHistory.length > 0 ? (
              mockLeaveHistory.map((leave) => (
                <div
                  key={leave.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{leave.id}</p>

                      <Badge variant="outline">{leave.type}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {leave.dates} • {leave.days} day(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(leave.status)}>
                      {leave.status}
                    </Badge>

                    {canApprove && leave.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(leave.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No leave requests found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reject Modal */}
      <Dialog
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>

            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">
                Reason for Rejection{' '}
                <span className="text-destructive">*</span>
              </Label>

              <Textarea
                id="reject-reason"
                placeholder="Explain why this request is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}