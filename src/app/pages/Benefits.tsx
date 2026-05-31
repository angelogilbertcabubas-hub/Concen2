import { useState } from 'react';
import { useRole } from '../contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  DollarSign,
  Heart,
  Calendar,
  GraduationCap,
  Clock,
  Award,
  Star,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { benefits } from '../data/mockData';
import { motion } from 'motion/react';

const iconMap: Record<string, any> = {
  peso: DollarSign,
  heart: Heart,
  calendar: Calendar,
  graduation: GraduationCap,
  clock: Clock,
  award: Award,
  star: Star,
  shield: Shield,
};

const benefitDetails: Record<string, any> = {
  'Competitive Salary': {
    whatsIncluded: [
      'Base salary aligned with industry standards',
      'Annual salary reviews based on performance',
      'Merit-based increases (average 8-12% for high performers)',
      'Market adjustment opportunities',
      'Transparent salary grading system',
      'Bi-annual performance bonuses',
    ],
    eligibility: 'All regular employees',
    howToClaim: 'Automatic - included in your employment contract',
  },
  'Health & Wellness': {
    whatsIncluded: [
      'HMO coverage up to ₱150,000 per year',
      'Dependents coverage (spouse + 2 children)',
      'Annual physical examination',
      'Dental and optical benefits',
      'Mental health counseling sessions (12 sessions/year)',
      'Wellness allowance of ₱5,000/year',
      'Free flu shots and health screenings',
    ],
    eligibility: 'Regular employees after 6 months of service',
    howToClaim: 'Submit HMO enrollment form to HR within 30 days of regularization',
  },
  'Paid Leave': {
    whatsIncluded: [
      '20 days vacation leave annually',
      '15 days sick leave annually',
      '5 days emergency leave',
      'Maternity leave (105 days)',
      'Paternity leave (7 days)',
      'Solo parent leave (7 days)',
      'Birthday leave (1 day)',
      'Bereavement leave (3-5 days)',
    ],
    eligibility: 'All regular employees; prorated for first year',
    howToClaim: 'File leave request through the portal at least 3 days in advance (except emergency)',
  },
  'Training & Career Development': {
    whatsIncluded: [
      'Professional certification reimbursement (up to ₱50,000/year)',
      'Access to online learning platforms (LinkedIn Learning, Coursera)',
      'Internal training programs and workshops',
      'Leadership development programs',
      'Conference and seminar sponsorship',
      'Mentorship programs',
      'Career coaching sessions',
    ],
    eligibility: 'All regular employees',
    howToClaim: 'Submit training request form for pre-approval, then claim reimbursement with completion certificate',
  },
  'Flexible Work': {
    whatsIncluded: [
      'Work-from-home options (2-3 days/week based on role)',
      'Flexible shift scheduling',
      'Core hours flexibility (adjust within 7am-7pm window)',
      'Compressed work week options',
      'Remote work equipment allowance (₱15,000 one-time)',
      'Internet stipend (₱1,500/month for WFH days)',
    ],
    eligibility: 'Regular employees with 3+ months tenure; subject to manager approval',
    howToClaim: 'Submit flexible work arrangement request through manager',
  },
  'Performance Incentives': {
    whatsIncluded: [
      'Monthly performance bonuses (up to 15% of basic salary)',
      'Quarterly team achievement bonuses',
      'Annual 13th month pay',
      'Year-end performance bonus (1-3 months salary)',
      'Spot bonuses for exceptional work',
      'Referral bonuses (₱10,000 per successful hire)',
    ],
    eligibility: 'All employees; bonus amounts vary by performance rating',
    howToClaim: 'Automatic based on performance evaluations',
  },
  'Employee Recognition': {
    whatsIncluded: [
      'Employee of the Month awards (₱5,000 + certificate)',
      'Quarterly MVP recognition',
      'Annual excellence awards ceremony',
      'Peer recognition platform',
      'Service milestone awards (gifts at 1, 3, 5, 10+ years)',
      'Team celebration budgets',
    ],
    eligibility: 'All employees',
    howToClaim: 'Nomination-based or automatic for service milestones',
  },
  'Job Security': {
    whatsIncluded: [
      'Regularization after 6 months probation',
      'Clear termination policies and due process',
      'SSS, PhilHealth, Pag-IBIG contributions',
      'Retirement planning seminars',
      'Separation benefits per DOLE standards',
      'Employment contract transparency',
    ],
    eligibility: 'All employees',
    howToClaim: 'Automatic coverage; consult HR for retirement planning',
  },
};

const wellnessProgramDetails: Record<string, any> = {
  'Mental Health Support': {
    description: 'Comprehensive mental wellness resources to support your emotional and psychological well-being.',
    services: [
      '12 free confidential counseling sessions per year',
      '24/7 mental health hotline',
      'Stress management workshops',
      'Mindfulness and meditation programs',
      'Crisis intervention support',
      'Work-life balance coaching',
    ],
    howToAccess: 'Contact HR to schedule a confidential session or call the 24/7 hotline',
  },
  'Fitness Initiatives': {
    description: 'Programs designed to keep you active and healthy, both physically and mentally.',
    services: [
      'Gym membership discounts (40% off at partner gyms)',
      'Weekly Zumba and yoga classes',
      'Annual company fun run',
      'Sports team sponsorships (basketball, volleyball)',
      'Fitness tracker subsidies',
      'Health and nutrition workshops',
    ],
    howToAccess: 'Register through the wellness portal or contact the wellness committee',
  },
  'Work-Life Balance': {
    description: 'Initiatives to help you maintain harmony between your professional and personal life.',
    services: [
      'Flexible work arrangements',
      'No-meeting Fridays initiative',
      'Family day events (quarterly)',
      'Childcare assistance programs',
      'Time management workshops',
      'Volunteer time off (2 days/year)',
    ],
    howToAccess: 'Discuss flexible arrangements with your manager; events announced via company calendar',
  },
};

export default function Benefits() {
  const { user } = useRole();
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const [showHandbook, setShowHandbook] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  const [selectedWellness, setSelectedWellness] = useState<string | null>(null);
  const [showContactHR, setShowContactHR] = useState(false);

  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [notification, setNotification] = useState('');

  const openBenefitModal = (title: string) => {
    setSelectedBenefit(title);
  };

  const openWellnessModal = (title: string) => {
    setSelectedWellness(title);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');

    if (!contactMessage.trim()) {
      setContactError('Please fill out your message before sending.');
      return;
    }

    setNotification('Message sent successfully! The HR team will review your benefits inquiry soon.');
    setContactMessage('');
    setShowContactHR(false);

    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  return (
    <div className="space-y-6 relative">
      {notification && (
        <div className="fixed top-5 right-5 flex items-center gap-3 bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl z-[100] transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium tracking-wide">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Employee Benefits</h1>
        <p className="text-muted-foreground mt-1">
          Discover the comprehensive benefits package we offer to support your well-being and growth.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = iconMap[benefit.icon];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-3 rounded-xl">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openBenefitModal(benefit.title)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How to Avail Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">1. Review Eligibility</h4>
              <p className="text-sm text-muted-foreground">
                Check your employment status and tenure to see which benefits you're eligible for.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">2. Submit Application</h4>
              <p className="text-sm text-muted-foreground">
                Complete the benefit application form through the HR portal or contact your HR representative.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">3. Wait for Approval</h4>
              <p className="text-sm text-muted-foreground">
                Most benefit applications are processed within 3-5 business days.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">4. Enjoy Your Benefits</h4>
              <p className="text-sm text-muted-foreground">
                Once approved, you can start utilizing your benefits immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">HR Support</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our HR team is here to help you understand and maximize your benefits.
              </p>
              <Button 
                className="w-full bg-[#fcd181] hover:bg-[#fcd181]/90 text-slate-900 font-semibold"
                onClick={() => {
                  setContactError('');
                  setShowContactHR(true);
                }}
              >
                Contact HR
              </Button>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Resources</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowHandbook(true)}
                >
                  📄 Benefits Handbook
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowFAQs(true)}
                >
                  📋 FAQs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wellness Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Wellness Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Mental Health Support',
                description: 'Free counseling sessions and mental wellness resources',
                icon: '🧠',
              },
              {
                title: 'Fitness Initiatives',
                description: 'Gym membership discounts and wellness activities',
                icon: '💪',
              },
              {
                title: 'Work-Life Balance',
                description: 'Flexible schedules and remote work options',
                icon: '⚖️',
              },
            ].map((program, index) => (
              <div
                key={index}
                className="p-4 bg-muted/50 rounded-lg text-center hover:bg-muted cursor-pointer transition-colors"
                onClick={() => openWellnessModal(program.title)}
              >
                <div className="text-4xl mb-3">{program.icon}</div>
                <h4 className="font-semibold text-sm mb-2">{program.title}</h4>
                <p className="text-xs text-muted-foreground">{program.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefit Detail Modal */}
      <Dialog open={!!selectedBenefit} onOpenChange={() => setSelectedBenefit(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedBenefit}</DialogTitle>
            <DialogDescription>
              Comprehensive details about this benefit
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              {selectedBenefit && benefitDetails[selectedBenefit] && (
                <>
                  <div>
                    <h4 className="font-semibold mb-3">What's Included</h4>
                    <ul className="space-y-2">
                      {benefitDetails[selectedBenefit].whatsIncluded.map((item: string, i: number) => (
                        /* FIXED: Swapped stray closing </td> layout mismatch tag for proper </li> syntax closure */
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Eligibility</h4>
                    <p className="text-sm text-muted-foreground">
                      {benefitDetails[selectedBenefit].eligibility}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How to Claim</h4>
                    <p className="text-sm text-muted-foreground">
                      {benefitDetails[selectedBenefit].howToClaim}
                    </p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Wellness Program Detail Modal */}
      <Dialog open={!!selectedWellness} onOpenChange={() => setSelectedWellness(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedWellness}</DialogTitle>
            <DialogDescription>
              {selectedWellness && wellnessProgramDetails[selectedWellness]?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {selectedWellness && wellnessProgramDetails[selectedWellness] && (
              <>
                <div>
                  <h4 className="font-semibold mb-3">Services Available</h4>
                  <ul className="space-y-2">
                    {wellnessProgramDetails[selectedWellness].services.map((service: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">✓</span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How to Access</h4>
                  <p className="text-sm text-muted-foreground">
                    {wellnessProgramDetails[selectedWellness].howToAccess}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Benefits Handbook Modal */}
      <Dialog open={showHandbook} onOpenChange={setShowHandbook}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Employee Benefits Handbook</DialogTitle>
            <DialogDescription>
              ConcenTwo BPO Employee Benefits Guide 2026
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-120px)] pr-4">
            <div className="space-y-6 py-4">
              <section>
                <h3 className="text-lg font-bold mb-3">Welcome to ConcenTwo Benefits</h3>
                <p className="text-sm text-muted-foreground">
                  At ConcenTwo, we believe that our employees are our greatest asset. This comprehensive benefits handbook outlines all the benefits available to you as a valued member of our team. We are committed to supporting your health, growth, and well-being throughout your career with us.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-3">Eligibility Requirements</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Probationary Employees (0-6 months)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Basic salary and 13th month pay</li>
                      <li>• SSS, PhilHealth, Pag-IBIG contributions</li>
                      <li>• Pro-rated leave credits</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Regular Employees (6+ months)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• All probationary benefits plus:</li>
                      <li>• Full HMO coverage</li>
                      <li>• Performance bonuses</li>
                      <li>• Full leave entitlements</li>
                      <li>• Training and development programs</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-3">Benefits Claiming Process</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Step 1: Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Verify your eligibility for the specific benefit by checking your employment status, tenure, and benefit coverage period.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Step 2: Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Prepare all required documents (receipts, medical certificates, application forms, etc.). Ensure all documents are complete and properly filled out.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Step 3: Submission</h4>
                    <p className="text-sm text-muted-foreground">
                      Submit your benefit claim through the employee portal or directly to HR. Keep copies of all submitted documents for your records.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Step 4: Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      HR will review your application within 3-5 business days. You will receive email notifications about the status of your claim.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Step 5: Approval & Disbursement</h4>
                    <p className="text-sm text-muted-foreground">
                      Once approved, reimbursements are processed in the next payroll cycle. HMO and insurance benefits are activated within 24-48 hours.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-3">Important Policies</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Benefit Forfeiture</h4>
                    <p className="text-sm text-muted-foreground">
                      Unused leave credits exceeding the maximum carryover (5 days) will be forfeited at year-end. Some benefits may be forfeited upon resignation or termination as per company policy.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Abuse of Benefits</h4>
                    <p className="text-sm text-muted-foreground">
                      Fraudulent claims or misuse of benefits may result in disciplinary action, including termination. All benefit usage is monitored and subject to audit.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Changes to Benefits</h4>
                    <p className="text-sm text-muted-foreground">
                      ConcenTwo reserves the right to modify, add, or remove benefits as business needs change. Employees will be notified at least 30 days in advance of any significant changes.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-3">Contact Information</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm"><strong>HR Department:</strong> hr@concentwo.com</p>
                  <p className="text-sm"><strong>Benefits Hotline:</strong> (02) 8123-4567</p>
                  <p className="text-sm"><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
                </div>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* FAQs Modal */}
      <Dialog open={showFAQs} onOpenChange={setShowFAQs}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Frequently Asked Questions</DialogTitle>
            <DialogDescription>
              Common questions about employee benefits
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-120px)] pr-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>When do I become eligible for HMO benefits?</AccordionTrigger>
                <AccordionContent>
                  You become eligible for HMO coverage after completing 6 months of regular employment. You must submit your HMO enrollment form within 30 days of your regularization date to activate coverage.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Can I convert unused leave credits to cash?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can convert unused vacation leave credits to cash at the end of each year, subject to a maximum of 5 days. Sick leave credits cannot be converted to cash but can be carried over to the next year (maximum 10 days carryover).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I add dependents to my HMO coverage?</AccordionTrigger>
                <AccordionContent>
                  To add dependents (spouse and up to 2 children), submit the HMO dependent enrollment form along with required documents (marriage certificate, birth certificates) to HR. Processing takes 5-7 business days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>What happens to my benefits if I resign?</AccordionTrigger>
                <AccordionContent>
                  Upon resignation, you will receive payment for unused vacation leave credits. HMO coverage remains active until your last day of employment. 13th month pay is prorated based on months worked.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How long does it take to process reimbursement claims?</AccordionTrigger>
                <AccordionContent>
                  Most reimbursement claims are processed within 3-5 business days after submission. Approved claims are disbursed in the next payroll cycle. Complex claims may take up to 10 business days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Can I use my training allowance for any course?</AccordionTrigger>
                <AccordionContent>
                  Training allowances can be used for job-related courses, certifications, and professional development programs. All training requests must be pre-approved by your manager and HR to ensure alignment with your role and career path.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Is there a limit to performance bonuses?</AccordionTrigger>
                <AccordionContent>
                  Monthly performance bonuses can go up to 15% of your basic salary, based on individual and team KPIs. Year-end bonuses range from 1 to 3 months' salary depending on your performance rating and company performance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>How do I access mental health counseling?</AccordionTrigger>
                <AccordionContent>
                  Contact HR to schedule a confidential counseling session. You are entitled to 12 free sessions per year. All sessions are confidential and will not affect your employment record. A 24/7 mental health hotline is also available.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger>Can I work from home permanently?</AccordionTrigger>
                <AccordionContent>
                  Work-from-home arrangements depend on your role and department needs. Most positions offer hybrid setups (2-3 days WFH per week). Discuss permanent WFH options with your manager, subject to approval based on role requirements and performance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger>What government benefits are automatically deducted?</AccordionTrigger>
                <AccordionContent>
                  All employees have mandatory deductions for SSS, PhilHealth, and Pag-IBIG contributions as required by Philippine law. These contributions entitle you to government benefits including healthcare, loans, and retirement benefits. Contribution rates are updated annually based on government regulations.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Contact HR Modal Wrapper Form Layout */}
      <Dialog open={showContactHR} onOpenChange={setShowContactHR}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold">Contact HR Team</DialogTitle>
            <DialogDescription className="text-foreground">
              Have questions about your benefits? Our HR team is here to help!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleContactSubmit}>
            <div className="grid gap-4 py-4">
              {/* Full Name Field (Auto-filled) */}
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </label>
                <Input
                  id="name"
                  defaultValue={user.name}
                  readOnly
                  className="bg-muted text-muted-foreground border-none focus-visible:ring-0 cursor-default"
                />
              </div>

              {/* Email Field (Auto-filled based on name) */}
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </label>
                <Input
                  id="email"
                  defaultValue={`${user.name.split(' ')[0].toLowerCase()}@concentwo.com`}
                  readOnly
                  className="bg-muted text-muted-foreground border-none focus-visible:ring-0 cursor-default"
                />
              </div>

              {/* Message Field */}
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="How can we help you?"
                  className="min-h-[100px] flex w-full rounded-md bg-muted border-none px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none resize-none"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>

              {/* Local input warning validation placeholder */}
              {contactError && (
                <div className="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 text-xs rounded-lg px-3 py-2 font-medium">
                  {contactError}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-[#fcd181] hover:bg-[#ebc273] text-slate-900 font-semibold text-base"
              >
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}