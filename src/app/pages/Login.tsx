import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useRole, UserRole } from '../contexts/RoleContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Eye, EyeOff, CheckCircle2, Sun, Moon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import CompanyLogo from '../components/CompanyLogo';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { switchRole } = useRole();
  const { theme, setTheme } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Modal State Controls
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showContactHR, setShowContactHR] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  // Contact HR form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const demoAccounts = [
    { role: 'hr', email: 'hr@concentwo.com', password: 'hrpass123' },
    { role: 'employee', email: 'employee@concentwo.com', password: 'emppass123' },
    { role: 'finance', email: 'finance@concentwo.com', password: 'finpass123' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreedToTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const account = demoAccounts.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (!account) {
      setLoading(false);
      setError('Invalid email or password.');
      return;
    }

    switchRole(account.role as UserRole);
    login();
    setLoading(false);
    navigate('/dashboard');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForgotPassword(false);
    setNotification('Password reset link has been sent to your email address.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification('Message sent successfully! The HR team will contact you soon.');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setShowContactHR(false);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 md:p-8">
      {notification && (
        <div className="fixed top-5 right-5 flex items-center gap-3 bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl z-[100]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium tracking-wide">{notification}</span>
        </div>
      )}

      <div className="w-full max-w-4xl">
        <div className="bg-card rounded-[24px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-border/50 min-h-[550px]">
          {/* Left Decorative Column */}
          <div className="hidden md:block md:w-[45%] bg-gradient-to-b from-[#fde0a3] to-[#fac06d] dark:from-slate-800 dark:to-slate-900" />

          {/* Login Form */}
          <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
            <div className="text-center space-y-3 mb-8">
              <div className="flex flex-col items-center justify-center gap-3">
                <CompanyLogo className="w-16 h-16 border border-border/40 bg-white shadow-md" />
                <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-1">
                  <span className="text-[#1B3045] dark:text-white">Concen</span>
                  <span className="text-[#F7C14D]">Two</span>
                </h1>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                One Platform. Infinite Possibilities.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@concentwo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAboutUs(true)}
                  className="text-xs text-[#1B3045] dark:text-[#6db0fa] hover:underline font-medium"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-[#fac06d] hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="flex items-start space-x-2 pt-1 pb-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-slate-900 dark:text-slate-300 font-medium leading-none">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[#fac06d] hover:underline font-semibold"
                  >
                    Terms & Conditions
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-[#fac06d] hover:underline font-semibold"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {error && (
                <div className="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#fac06d] text-slate-900 hover:bg-[#ebc273] h-11 font-bold text-base rounded-xl"
                disabled={!agreedToTerms || loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="pt-8 mt-6 border-t border-border/60 text-center md:text-left text-sm text-muted-foreground">
              Need help?{' '}
              <button
                type="button"
                onClick={() => setShowContactHR(true)}
                className="text-primary hover:underline font-medium"
              >
                Contact HR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 bg-card border border-border rounded-full shadow-xl hover:bg-muted"
        >
          {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* --- MODALS --- */}

      {/* Forgot Password */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Enter your email address and we'll send you a reset link.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="space-y-4 py-4">
              <Label>Email</Label>
              <Input type="email" placeholder="you@concentwo.com" required />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowForgotPassword(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#fac06d] text-slate-900">Send Reset Link</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact HR */}
      <Dialog open={showContactHR} onOpenChange={setShowContactHR}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle style={{ color: '#fac06d' }}>Contact HR Team</DialogTitle>
            <DialogDescription>Have questions or problems logging in?</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Enter your full name" required />
              </div>
              <div className="space-y-1">
                <Label>Email Address</Label>
                <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-1">
                <Label>Message</Label>
                <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="How can we help you?" className="w-full min-h-[100px] p-2 bg-muted rounded-md text-sm border focus:outline-none" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-[#fac06d] text-slate-900">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Terms & Conditions - FIXED TEXT COLOR */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>ConcenTwo Terms & Conditions</DialogTitle></DialogHeader>
          <div className="text-sm space-y-4 text-slate-700 dark:text-slate-300">
            <ul className="list-disc pl-5 space-y-3">
              <li>By accessing the ConcenTwo HR & Operations Platform, all employees and administrators agree to comply fully with established corporate security metrics and compliance standards.</li>
              <li>Users are solely responsible for maintaining the absolute containment of their active profile authorization tokens.</li>
              <li>ConcenTwo maintains active background logs to audit operational floor performance metrics and ensure comprehensive platform integrity.</li>
              <li>Any exploit vectors or system leaks, including the manual modification of payroll logs, will trigger immediate and mandatory account lockouts.</li>
              <li>Line agents and queue managers must review and guarantee the factual validity of all submitted performance records.</li>
              <li>The corporate technology support team reserves localized permissions to temporarily scale or suspend interface access parameters at their discretion.</li>
              <li>By selecting "I Understand" and initializing authentication tokens, you accept these terms.</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowTermsModal(false); setAgreedToTerms(true); }} className="bg-[#fac06d] text-slate-900">I Understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy - FIXED TEXT COLOR */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Privacy Policy</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <ul className="list-decimal pl-5 space-y-3">
                <li><strong>How we collect user information:</strong> We collect login tokens, authentication records, and active session data to ensure continuous, secure platform access.</li>
                <li><strong>How we preserve user data securely:</strong> All profile records and operational logs are preserved in encrypted enterprise data environments.</li>
                <li><strong>Procedures for deleting user information:</strong> Upon request, system administrators will execute standard offboarding protocols, securely purging user data within 30 days.</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPrivacyModal(false)} className="bg-[#fac06d] text-slate-900">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* About Us - FIXED TEXT COLOR */}
      <Dialog open={showAboutUs} onOpenChange={setShowAboutUs}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>About Us</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <p><strong>One Platform. Infinite Possibilities.</strong></p>
            <p>ConcenTwo is built to empower BPO teams and streamline human resources, payroll, and daily operations. Our mission is to consolidate your entire operational toolkit into one unified platform, giving your team infinite possibilities for growth and efficiency.</p>
            <p>Our founding team brings decades of experience in business process outsourcing, ensuring that every feature is crafted specifically for the fast-paced, high-demand environment of modern call centers and support agencies.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAboutUs(false)} className="bg-[#fac06d] text-slate-900">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}