import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRole } from '../contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Label } from '../components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Upload, 
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useRole();

  // App notification alert banners
  const [notification, setNotification] = useState('');

  // -----------------------------------------------------
  // 1. PHOTO UPLOAD STATES
  // -----------------------------------------------------
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPhotoConfirmDialog, setShowPhotoConfirmDialog] = useState(false);

  // -----------------------------------------------------
  // 2. EDIT PROFILE STATES (Updated to read from RoleContext)
  // -----------------------------------------------------
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '+63 917 123 4567',
    address: 'Makati City, Metro Manila',
  });

  // Ensure profile data updates when the user context changes
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      fullName: user?.name || '',
      email: user?.email || '',
    }));
  }, [user]);

  // Password Change Workflow States
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Two-Factor Authentication Workflow States
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [faStep, setFaStep] = useState(1);
  const [faMethod, setFaMethod] = useState<'email' | 'phone'>('email');
  const [faInput, setFaInput] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [faError, setFaError] = useState('');

  // --- PHOTO UPLOAD HANDLERS ---
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setShowPhotoConfirmDialog(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const confirmPhotoUpdate = () => {
    if (previewImage) {
      setProfileImage(previewImage);
      setNotification('Profile picture updated successfully!');
      setShowPhotoConfirmDialog(false);
      setPreviewImage(null);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const cancelPhotoUpdate = () => {
    setShowPhotoConfirmDialog(false);
    setPreviewImage(null);
  };

  // --- EDIT PROFILE HANDLER ---
  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    setNotification('Personal information updated successfully!');
    setTimeout(() => setNotification(''), 4000);
  };

  // --- PASSWORD HANDLER ---
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password input fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setNotification('Account credentials updated successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPassword(false);
    setTimeout(() => setNotification(''), 4000);
  };

  // --- 2FA HANDLER ---
  const handle2FAVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setFaError('');

    if (faStep === 1) {
      if (!faInput.trim()) {
        setFaError(`Please enter a valid target ${faMethod === 'email' ? 'email address' : 'phone number'}.`);
        return;
      }
      setFaStep(2);
    } else if (faStep === 2) {
      if (!verificationCode.trim()) {
        setFaError('Please input the verification code sent to your device.');
        return;
      }
      setIsTwoFactorEnabled(true);
      setShow2FADialog(false);
      setNotification('Two-Factor Authentication (2FA) is now active on your security profile token.');
      setFaStep(1);
      setFaInput('');
      setVerificationCode('');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Alert Confirmation Banner Overlay */}
      {notification && (
        <div className="fixed top-5 right-5 flex items-center gap-3 bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl z-[100] transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium tracking-wide">{notification}</span>
        </div>
      )}

      {/* Top Grid: Avatar Card & Personal Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar Display Card */}
        <Card className="bg-card border-border shadow-sm flex flex-col items-center justify-center p-6 text-center">
          <CardContent className="pt-6 flex flex-col items-center space-y-4 w-full">
            <Avatar className="w-28 h-28 border-2 border-border shadow-md bg-[#fcd181] text-slate-900 text-3xl font-bold flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <AvatarFallback className="bg-[#fcd181] text-slate-900">
                  {profileData.fullName.charAt(0) || 'C'}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {profileData.fullName}
              </h2>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">
                {user?.roleTitle || 'HR Officer'}
              </p>
            </div>

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Upload Photo
            </Button>
          </CardContent>
        </Card>

        {/* Right Side: Personal Information Card */}
        <Card className="lg:col-span-2 bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold tracking-tight">Personal Information</CardTitle>
            
            {/* Dynamic Edit/Save Button Logic */}
            {isEditingProfile ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="font-medium" onClick={() => setIsEditingProfile(true)}>
                Edit Profile
              </Button>
            )}
          </CardHeader>
          
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Full Name
              </Label>
              <Input 
                value={profileData.fullName}
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                readOnly={!isEditingProfile} 
                className={`transition-colors ${!isEditingProfile ? 'bg-muted/40 border-transparent cursor-default focus-visible:ring-0 shadow-none' : 'bg-background border-border shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <span className="text-[10px] bg-amber-400/20 text-amber-500 font-bold px-1 rounded">ID</span> Employee ID
              </Label>
              {/* DYNAMIC ID FIX: Using user?.id instead of hardcoded EMP-00234 */}
              <Input 
                value={user?.id || 'Pending ID'} 
                readOnly 
                className="bg-muted/40 border-transparent cursor-default focus-visible:ring-0 shadow-none opacity-80" 
                title="Employee ID cannot be changed"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </Label>
              <Input 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                readOnly={!isEditingProfile} 
                className={`transition-colors ${!isEditingProfile ? 'bg-muted/40 border-transparent cursor-default focus-visible:ring-0 shadow-none' : 'bg-background border-border shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </Label>
              <Input 
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                readOnly={!isEditingProfile} 
                className={`transition-colors ${!isEditingProfile ? 'bg-muted/40 border-transparent cursor-default focus-visible:ring-0 shadow-none' : 'bg-background border-border shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50'}`} 
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Address
              </Label>
              <Input 
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                readOnly={!isEditingProfile} 
                className={`transition-colors ${!isEditingProfile ? 'bg-muted/40 border-transparent cursor-default focus-visible:ring-0 shadow-none' : 'bg-background border-border shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50'}`} 
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Join Date
              </Label>
              <Input 
                value="January 15, 2024" 
                readOnly 
                className="bg-muted/40 border-transparent cursor-default focus-visible:ring-0 shadow-none opacity-80" 
                title="Join Date cannot be changed"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Block: Security Settings Dashboard Panels */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold tracking-tight">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Account Password Field Section */}
          <div className="pb-4 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" /> Password
                </Label>
                <p className="text-xs font-mono text-muted-foreground tracking-widest pl-6">••••••••</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="sm:w-auto self-start font-medium"
                onClick={() => {
                  setPasswordError('');
                  setIsChangingPassword(!isChangingPassword);
                }}
              >
                {isChangingPassword ? 'Cancel Form' : 'Change Password'}
              </Button>
            </div>

            {/* Dynamic inline password form expansion layout panel */}
            {isChangingPassword && (
              <form onSubmit={handlePasswordUpdate} className="mt-4 pt-4 border-t border-dashed border-border max-w-md space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="old-pass" className="text-xs font-medium">Old Password</Label>
                  <Input 
                    id="old-pass" 
                    type="password" 
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-pass" className="text-xs font-medium">New Password</Label>
                  <Input 
                    id="new-pass" 
                    type="password" 
                    placeholder="Enter new account password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-pass" className="text-xs font-medium">Confirm New Password</Label>
                  <Input 
                    id="confirm-pass" 
                    type="password" 
                    placeholder="Confirm password match selection"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {passwordError && (
                  <div className="text-xs bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg font-medium flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {passwordError}
                  </div>
                )}

                <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Update Password
                </Button>
              </form>
            )}
          </div>

          {/* Two-Factor Authentication Security Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" /> Two-Factor Authentication
              </Label>
              <p className="text-xs text-muted-foreground pl-6">
                Add an extra layer of security to your operational workforce token.
              </p>
            </div>
            
            {/* Conditional verification factor flow toggle hooks */}
            <Button 
              variant="outline" 
              size="sm" 
              className={`sm:w-auto self-start font-medium ${isTwoFactorEnabled ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}`}
              onClick={() => {
                if (isTwoFactorEnabled) {
                  setIsTwoFactorEnabled(false);
                  setNotification('Two-Factor Authentication has been deactivated.');
                  setTimeout(() => setNotification(''), 4000);
                } else {
                  setFaError('');
                  setFaStep(1);
                  setFaInput('');
                  setVerificationCode('');
                  setShow2FADialog(true);
                }
              }}
            >
              {isTwoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Block: Fixed Micro-Task Quick Links Panel */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold tracking-tight">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="w-full justify-start text-sm font-medium border-border/80 hover:bg-muted/60 transition-colors"
            onClick={() => navigate('/attendance')}
          >
            My Attendance
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start text-sm font-medium border-border/80 hover:bg-muted/60 transition-colors"
            onClick={() => navigate('/payroll')}
          >
            Payroll History
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start text-sm font-medium border-border/80 hover:bg-muted/60 transition-colors"
            onClick={() => navigate('/benefits')}
          >
            My Benefits
          </Button>
        </CardContent>
      </Card>

      {/* Photo Upload Confirmation Modal */}
      <Dialog open={showPhotoConfirmDialog} onOpenChange={(open) => !open && cancelPhotoUpdate()}>
        <DialogContent className="sm:max-w-[480px] rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Profile Photo</DialogTitle>
            <DialogDescription className="text-sm">
              Preview your new profile picture before confirming the change.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center justify-center gap-8 w-full">
              {/* Current Photo */}
              <div className="flex flex-col items-center gap-2 opacity-60">
                <span className="text-xs font-semibold text-muted-foreground">Current</span>
                <Avatar className="w-20 h-20 border-2 border-border/50 shadow-sm bg-[#fcd181]/50 text-slate-900">
                  {profileImage ? (
                    <img src={profileImage} alt="Current profile" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-[#fcd181]/50 text-slate-900">
                      {profileData.fullName.charAt(0) || 'C'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              {/* Arrow */}
              <div className="text-muted-foreground/50">
                <ArrowRight className="w-6 h-6" />
              </div>

              {/* New Photo Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-foreground">New Photo</span>
                <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-md bg-muted text-slate-900">
                  {previewImage && (
                    <img src={previewImage} alt="New profile preview" className="w-full h-full object-cover" />
                  )}
                </Avatar>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={cancelPhotoUpdate}
              className="rounded-xl font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={confirmPhotoUpdate}
              className="bg-[#FFC570] text-slate-900 hover:bg-[#FFC570]/90 rounded-xl font-medium"
            >
              Confirm & Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comprehensive Multi-Step 2FA Factor Setup Accessible Modal Overlay */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Configure Two-Factor Verification</DialogTitle>
            <DialogDescription className="text-xs">
              Secure your account gateway token using biometric matching endpoints or message distribution lists.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handle2FAVerification}>
            {faStep === 1 ? (
              <div className="space-y-4 py-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">1. Choose Verification Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => { setFaMethod('email'); setFaInput(''); setFaError(''); }}
                      className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${faMethod === 'email' ? 'border-primary bg-primary/10 text-foreground font-semibold' : 'border-border bg-transparent text-muted-foreground'}`}
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-xs">Email Address</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFaMethod('phone'); setFaInput(''); setFaError(''); }}
                      className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${faMethod === 'phone' ? 'border-primary bg-primary/10 text-foreground font-semibold' : 'border-border bg-transparent text-muted-foreground'}`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="text-xs">Phone Number</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fa-target" className="text-xs font-medium">
                    {faMethod === 'email' ? 'Corporate Email Contact' : 'Mobile Number (+63)'}
                  </Label>
                  <Input
                    id="fa-target"
                    type={faMethod === 'email' ? 'email' : 'text'}
                    placeholder={faMethod === 'email' ? 'you@concentwo.com' : '+63 917 123 4567'}
                    value={faInput}
                    onChange={(e) => setFaInput(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-3">
                <div className="bg-muted/50 border border-border p-3 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-normal">
                    Verification code dispatch authorized! Input the 6-digit session pin requested via <strong>{faInput}</strong>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="verification-code" className="text-xs font-semibold tracking-wide">Enter Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    className="text-center font-mono text-lg tracking-widest focus:placeholder:opacity-0"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
              </div>
            )}

            {faError && (
              <div className="text-xs bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg font-medium flex items-center gap-2 mb-3">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {faError}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              {faStep === 2 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setFaStep(1); setFaError(''); setVerificationCode(''); }}
                >
                  Back
                </Button>
              )}
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto font-medium">
                {faStep === 1 ? 'Send Verification' : 'Verify & Enable'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}