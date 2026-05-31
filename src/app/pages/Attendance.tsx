import { useState } from 'react';
import { useRole } from '../contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'; // Fixed the path to use standard shadcn 'select'
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, XCircle, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

type AttendanceLog = {
  date: string;
  day: string;
  timeIn: string;
  timeOut: string;
  hoursWorked: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
};

export default function Attendance() {
  const { user } = useRole();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [clockLoading, setClockLoading] = useState<boolean>(false);

  // Core historical attendance mock data array matrix
  const [logs] = useState<AttendanceLog[]>([
    { date: '2026-05-15', day: 'Friday', timeIn: '08:54 AM', timeOut: '06:02 PM', hoursWorked: '9.1h', status: 'Present' },
    { date: '2026-05-14', day: 'Thursday', timeIn: '09:18 AM', timeOut: '06:00 PM', hoursWorked: '8.7h', status: 'Late' },
    { date: '2026-05-13', day: 'Wednesday', timeIn: '08:45 AM', timeOut: '06:15 PM', hoursWorked: '9.5h', status: 'Present' },
    { date: '2026-05-12', day: 'Tuesday', timeIn: '--:--', timeOut: '--:--', hoursWorked: '0h', status: 'Absent' },
    { date: '2026-05-11', day: 'Monday', timeIn: '08:52 AM', timeOut: '06:05 PM', hoursWorked: '9.2h', status: 'Present' },
    { date: '2026-05-09', day: 'Friday', timeIn: '--:--', timeOut: '--:--', hoursWorked: '0h', status: 'On Leave' },
    { date: '2026-05-08', day: 'Thursday', timeIn: '08:59 AM', timeOut: '06:00 PM', hoursWorked: '9.0h', status: 'Present' },
  ]);

  // Calendar render grid array constructor for May 2026
  const calendarDays = [
    { dayNumber: 26, isCurrentMonth: false, status: 'none' },
    { dayNumber: 27, isCurrentMonth: false, status: 'none' },
    { dayNumber: 28, isCurrentMonth: false, status: 'none' },
    { dayNumber: 29, isCurrentMonth: false, status: 'none' },
    { dayNumber: 30, isCurrentMonth: false, status: 'none' },
    { dayNumber: 1, isCurrentMonth: true, status: 'Present' },
    { dayNumber: 2, isCurrentMonth: true, status: 'Weekend' },
    { dayNumber: 3, isCurrentMonth: true, status: 'Weekend' },
    { dayNumber: 4, isCurrentMonth: true, status: 'Present' },
    { dayNumber: 5, isCurrentMonth: true, status: 'Present' },
    { dayNumber: 6, isCurrentMonth: true, status: 'Late' },
    { dayNumber: 7, isCurrentMonth: true, status: 'Present' },
    { dayNumber: 8, isCurrentMonth: true, status: 'Present' },
    { dayNumber: 9, isCurrentMonth: true, status: 'On Leave' },
    { dayNumber: 10, isCurrentMonth: true, status: 'Weekend' },
    { dayNumber: 11, isCurrentMonth: true, status: 'Present' },
    { dayNumber: 12, isCurrentMonth: true, status: 'Absent' },
    { dayNumber: 13, isCurrentMonth: true, status: 'Present' },
    { dayNumber: 14, isCurrentMonth: true, status: 'Late' },
    { dayNumber: 15, isCurrentMonth: true, status: 'Present' },
    { dayNumber: 16, isCurrentMonth: true, status: 'Weekend' },
    { dayNumber: 17, isCurrentMonth: true, status: 'Weekend' },
    { dayNumber: 18, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 19, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 20, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 21, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 22, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 23, isCurrentMonth: true, status: 'Weekend' },
    { dayNumber: 24, isCurrentMonth: true, status: 'Weekend' },
    { dayNumber: 25, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 26, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 27, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 28, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 29, isCurrentMonth: true, status: 'Future' },
    { dayNumber: 30, isCurrentMonth: true, status: 'Weekend' },
    { dayNumber: 31, isCurrentMonth: true, status: 'Weekend' },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Present':
        return { color: 'text-green-500 bg-green-500/10 border-green-500/20', dot: 'bg-green-500', icon: CheckCircle2 };
      case 'Late':
        return { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-500', icon: AlertTriangle };
      case 'Absent':
        return { color: 'text-destructive bg-destructive/10 border-destructive/20', dot: 'bg-destructive', icon: XCircle };
      case 'On Leave':
        return { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-500', icon: Coffee };
      case 'Weekend':
        return { color: 'text-muted-foreground bg-muted/40 border-transparent opacity-40', dot: 'bg-muted-foreground', icon: Clock };
      default:
        return { color: 'text-muted-foreground bg-muted/20 border-transparent', dot: 'bg-muted-foreground', icon: Clock };
    }
  };

  const handleClockToggle = async () => {
    setClockLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (isClockedIn) {
      setIsClockedIn(false);
      toast.error('Clocked Out Successfully', {
        description: 'Shift session recorded on May 17, 2026.',
      });
    } else {
      setIsClockedIn(true);
      toast.success('Clocked In Successfully', {
        description: 'Active session tracking established.',
      });
    }
    setClockLoading(false);
  };

  const filteredLogs = filterStatus === 'all' 
    ? logs 
    : logs.filter(log => log.status.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Attendance</h1>
          <p className="text-muted-foreground mt-1">Track shift records, timelines, and monthly calendar summary.</p>
        </div>

        {/* Real-Time Shift Execution Widget */}
        <Card className="sm:max-w-xs w-full shadow-md bg-card border border-border">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-medium">Shift Session</p>
              <p className="text-sm font-bold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                {isClockedIn ? 'Active Log-In' : 'Inactive'}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleClockToggle}
              disabled={clockLoading}
              className={`font-semibold text-xs px-4 ${
                isClockedIn 
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {clockLoading ? 'Syncing...' : isClockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Interactive Calendar Tracker View */}
        <Card className="lg:col-span-1 h-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <CalendarIcon className="w-5 h-5" />
              <CardTitle className="text-foreground text-lg">May 2026 Summary</CardTitle>
            </div>
            <CardDescription>Visual matrix code representation of active days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Days of Week Row */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => <div key={idx}>{d}</div>)}
            </div>

            {/* Calendar Days Matrix Array Map */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const config = getStatusConfig(day.status);
                return (
                  <div
                    key={index}
                    className={`aspect-square flex flex-col items-center justify-between p-1 rounded-md text-xs font-medium border border-transparent transition-all ${
                      !day.isCurrentMonth ? 'opacity-20 pointer-events-none' : ''
                    } ${
                      day.status === 'Future' ? 'bg-muted/10 opacity-40 text-muted-foreground' : ''
                    } ${
                      day.status !== 'none' && day.status !== 'Future' && day.status !== 'Weekend'
                        ? `${config.color} border`
                        : 'bg-muted/30 text-foreground'
                    }`}
                  >
                    <span className="self-start text-[10px] opacity-70">{day.dayNumber}</span>
                    {day.status !== 'none' && day.status !== 'Future' && day.status !== 'Weekend' && (
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mb-0.5`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Color Legend Palette Matrix */}
            <div className="pt-4 border-t border-border grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Present
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-yellow-500" /> Late Shift entry
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-destructive" /> Absent Mark
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Allocated Leave
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Columns: Tabular History Log Engine List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Historical Log Entries</CardTitle>
              <CardDescription>Detailed chronological listing of shift log boundaries.</CardDescription>
            </div>

            {/* Filter Selector Module */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[150px] bg-muted/50 border-none">
                <SelectValue placeholder="All Records" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="on leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase font-semibold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time In</th>
                    <th className="py-3 px-4">Time Out</th>
                    <th className="py-3 px-4 text-center">Rendered</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <AnimatePresence initial={false}>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log, index) => {
                        const config = getStatusConfig(log.status);
                        const StatusIcon = config.icon;

                        return (
                          <motion.tr
                            key={log.date}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-3.5 px-4">
                              <p className="font-semibold">{log.date}</p>
                              <p className="text-xs text-muted-foreground">{log.day}</p>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs">{log.timeIn}</td>
                            <td className="py-3.5 px-4 font-mono text-xs">{log.timeOut}</td>
                            <td className="py-3.5 px-4 text-center font-medium font-mono text-xs">{log.hoursWorked}</td>
                            <td className="py-3.5 px-4 text-right">
                              <Badge variant="outline" className={`inline-flex items-center gap-1 text-[11px] font-semibold py-0.5 px-2.5 ${config.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {log.status}
                              </Badge>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-muted-foreground py-12 italic">
                          No logging items match the active selection filters.
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}