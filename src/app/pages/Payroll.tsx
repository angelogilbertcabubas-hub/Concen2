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
import { Download, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { mockPayslips } from '../data/mockData';
import { motion } from 'motion/react';
import { toast } from 'sonner';

type Payslip = {
  period: string;
  amount: number;
  issued: string;
  status: string;
};

export default function Payroll() {
  const nextPayday = new Date('2026-04-15');
  const daysUntilPayday = Math.ceil((nextPayday.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleView = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setShowPreview(true);
  };

  const handleDownload = () => {
    toast.success('Payslip downloaded successfully!', {
      description: `${selectedPayslip?.period} payslip has been downloaded.`,
    });
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Payroll</h1>
        <p className="text-muted-foreground mt-1">View and download your payslips.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Next Payday</p>
                  <p className="text-2xl font-bold mt-1">₱28,450</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    April 15, 2026 • {daysUntilPayday} days
                  </p>
                </div>
                <div className="bg-green-500/10 text-green-500 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-2xl font-bold mt-1">₱55,990</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    March 2026 • 2 payslips
                  </p>
                </div>
                <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">YTD Earnings</p>
                  <p className="text-2xl font-bold mt-1">₱167,970</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    January - March 2026
                  </p>
                </div>
                <div className="bg-primary/10 text-primary p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payslip List */}
      <Card>
        <CardHeader>
          <CardTitle>Payslip History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPayslips.length > 0 ? mockPayslips.map((payslip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => handleView(payslip)}
              >
                <div className="flex-1">
                  <p className="font-semibold">{payslip.period}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Issued: {payslip.issued}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">
                      ₱{payslip.amount.toLocaleString()}
                    </p>
                    <Badge variant="default" className="mt-1">
                      {payslip.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(payslip);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <p className="text-center text-muted-foreground py-8">No payslips found.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Info */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Payslip Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Earnings</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-medium">₱25,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Night Differential</span>
                  <span className="font-medium">₱2,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overtime Pay</span>
                  <span className="font-medium">₱1,200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Performance Bonus</span>
                  <span className="font-medium">₱3,000</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>Gross Pay</span>
                  <span className="text-green-500">₱31,700</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Deductions</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SSS</span>
                  <span className="font-medium">₱1,125</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PhilHealth</span>
                  <span className="font-medium">₱437.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pag-IBIG</span>
                  <span className="font-medium">₱100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Withholding Tax</span>
                  <span className="font-medium">₱1,587.50</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>Net Pay</span>
                  <span className="text-primary">₱28,450</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payslip Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payslip Preview</DialogTitle>
            <DialogDescription>
              {selectedPayslip?.period}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Company Header */}
            <div className="text-center border-b border-border pb-4">
              <h2 className="text-2xl font-bold text-primary">ConcenTwo</h2>
              <p className="text-sm text-muted-foreground">One Platform. Every Role. Real-Time BPO Power.</p>
              <p className="text-xs text-muted-foreground mt-1">Issued: {selectedPayslip?.issued}</p>
            </div>

            {/* Earnings & Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Earnings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Basic Salary</span>
                    <span className="font-medium">₱25,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Night Differential</span>
                    <span className="font-medium">₱2,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overtime Pay</span>
                    <span className="font-medium">₱1,200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Performance Bonus</span>
                    <span className="font-medium">₱3,000</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span>Gross Pay</span>
                    <span className="text-green-500">₱31,700</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SSS</span>
                    <span className="font-medium">₱1,125</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PhilHealth</span>
                    <span className="font-medium">₱437.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pag-IBIG</span>
                    <span className="font-medium">₱100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Withholding Tax</span>
                    <span className="font-medium">₱1,587.50</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-destructive">₱3,250</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Net Pay</span>
                <span className="text-3xl font-bold text-primary">
                  ₱{selectedPayslip?.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Confirm Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}