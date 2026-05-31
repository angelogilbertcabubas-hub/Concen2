import { useState } from 'react';
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
import { Receipt, Loader2, Calendar } from 'lucide-react';
import { mockReimbursements } from '../data/mockData';
import { toast } from 'sonner';

export default function Reimbursement() {
  const [loading, setLoading] = useState(false);
  const [claimType, setClaimType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!claimType) newErrors.claimType = 'This field is required';
    if (!amount) newErrors.amount = 'This field is required';
    if (!date) newErrors.date = 'This field is required';
    if (!description) newErrors.description = 'This field is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
    toast.success('Reimbursement Claim Submitted Successfully!', {
      description: 'Your claim has been sent for approval.',
    });

    setClaimType('');
    setAmount('');
    setDate('');
    setDescription('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Paid':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const totalPending = mockReimbursements
    .filter((r) => r.status === 'Approved')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPaid = mockReimbursements
    .filter((r) => r.status === 'Paid')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reimbursement</h1>
        <p className="text-muted-foreground mt-1">Submit and track your reimbursement claims.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Claims</p>
                <p className="text-2xl font-bold mt-1">₱{totalPending.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-500/10 text-yellow-500 p-3 rounded-xl">
                <Receipt className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid This Month</p>
                <p className="text-2xl font-bold mt-1">₱{totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-green-500/10 text-green-500 p-3 rounded-xl">
                <Receipt className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Submit Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="claim-type">
                  Claim Type <span className="text-destructive">*</span>
                </Label>
                <Select value={claimType} onValueChange={(val) => { setClaimType(val); setErrors({...errors, claimType: ''}); }}>
                  <SelectTrigger id="claim-type" className={errors.claimType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="internet">Internet Allowance</SelectItem>
                    <SelectItem value="office-supplies">Office Supplies</SelectItem>
                    <SelectItem value="training">Training & Certification</SelectItem>
                    <SelectItem value="medical">Medical Expenses</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.claimType && <p className="text-sm text-destructive">{errors.claimType}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Amount <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className={`pl-8 ${errors.amount ? 'border-destructive' : ''}`}
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setErrors({...errors, amount: ''}); }}
                    />
                  </div>
                  {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date of Expense <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => { setDate(e.target.value); setErrors({...errors, date: ''}); }}
                      className={`
                        pr-10
                        appearance-none
                        ${errors.date ? 'border-destructive' : ''}
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
                  {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please provide details about the expense..."
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setErrors({...errors, description: ''}); }}
                  className={errors.description ? 'border-destructive' : ''}
                  rows={4}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt">Upload Receipt</Label>
                <Input id="receipt" type="file" accept="image/*,.pdf" />
                <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  <><Receipt className="w-4 h-4 mr-2" /> Submit Claim</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reimbursement Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Eligible Expenses</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Transportation to/from work</li>
                <li>• Internet allowance</li>
                <li>• Office supplies</li>
                <li>• Training & certifications</li>
                <li>• Medical expenses</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Processing Time</h4>
              <p className="text-sm text-muted-foreground">Typically 5-7 business days after approval.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claim History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockReimbursements.length > 0 ? mockReimbursements.map((claim) => (
              <div key={claim.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{claim.id}</p>
                    <Badge variant="outline">{claim.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{claim.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-green-500">₱{claim.amount.toLocaleString()}</p>
                  <Badge variant={getStatusColor(claim.status)}>{claim.status}</Badge>
                </div>
              </div>
            )) : (
              <p className="text-center text-muted-foreground py-8">No claim history found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}