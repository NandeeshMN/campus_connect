import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Mail, User, ArrowRight, Shield, Users, BookOpen,
  MessageSquare, Briefcase, FileText, GraduationCap,
  Building, ChevronDown, Camera, Send, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import ThemeToggle from '../../components/common/ThemeToggle';
import Footer from '../../components/common/Footer';

// ─── Majors list (same as RegisterPage) ──────────────────────────────────────
const majors = [
  'Computer Science',
  'Business Administration',
  'Biology & Life Sciences',
  'Mechanical Engineering',
  'Psychology',
  'Economics',
  'Electrical Engineering',
];

const features = [
  { icon: <Zap size={18} />,          color: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',   title: 'Social Feed',            desc: 'Share achievements & campus updates' },
  { icon: <BookOpen size={18} />,     color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400', title: 'Resource Hub',           desc: 'Academic notes, PYQs, certifications' },
  { icon: <MessageSquare size={18} />,color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400', title: 'Messaging',         desc: 'Connect directly with classmates' },
  { icon: <Briefcase size={18} />,    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',    title: 'Placement Prep',         desc: 'Resume hub & placement resources' },
  { icon: <FileText size={18} />,     color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',        title: 'Academic Notes',         desc: 'Share & discover study material' },
  { icon: <Users size={18} />,        color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400', title: 'Student Community',     desc: 'Participate in campus activities' },
];

// ─── Left Info Panel ──────────────────────────────────────────────────────────
const LeftPanel = () => (
  <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] bg-gradient-to-br from-brand-600 via-indigo-700 to-violet-800 flex-col justify-between p-10 xl:p-14 relative overflow-hidden">

    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

    <div className="relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
        <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight">CampusConnect</span>
      </div>

      {/* Headline */}
      <div className="mb-10">
        <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-3">
          Connect · Learn · Grow Together
        </h1>
        <p className="text-white/70 text-sm xl:text-base leading-relaxed">
          CampusConnect is a college-exclusive social networking and resource-sharing platform where students thrive together.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 gap-4">
        {features.map(({ icon, color, title, desc }) => (
          <div key={title} className="flex items-start gap-3 group">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-white/15`}>
              <span className="text-white">{icon}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{title}</p>
              <p className="text-xs text-white/60">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom tagline */}
    <div className="relative z-10 mt-8">
      <div className="flex items-center gap-2 text-white/50 text-xs font-semibold">
        <Shield size={14} />
        <span>College-exclusive · Verified community · Private & secure</span>
      </div>
    </div>
  </div>
);

// ─── Login Form (inner) ───────────────────────────────────────────────────────
const LoginForm = ({ onSwitch }) => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false }
  });

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (res?.success) navigate('/home');
  };

  return (
    <div className="w-full">
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your CampusConnect account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          placeholder="name@domain.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email Address is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Must be a valid email address' }
          })}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30 h-4 w-4 dark:border-slate-700 dark:bg-slate-900"
              {...register('rememberMe')}
            />
            Remember me
          </label>
          <a
            href="#forgot"
            className="text-brand-600 hover:text-brand-700 font-semibold dark:text-brand-400 transition-colors"
            onClick={(e) => { e.preventDefault(); alert('Forgot password trigger.'); }}
          >
            Forgot password?
          </a>
        </div>

        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3 text-base shadow-lg shadow-brand-500/20">
          <span>Sign in to CampusConnect</span>
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
        <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or continue with</span>
        </div>
      </div>

      {/* OAuth */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button variant="outline" className="flex items-center justify-center gap-2 text-sm py-2.5" onClick={() => alert('Mock OAuth: Google')}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.65 4.5 1.8l2.4-2.4C17.3 1.7 14.85 1 12.24 1c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.77 0 9.6-4.06 9.6-9.8 0-.66-.06-1.32-.16-1.915h-9.44z"/></svg>
          Google
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2 text-sm py-2.5" onClick={() => alert('Mock OAuth: Apple')}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05 1.88-3.08 1.88-1.05 0-1.37-.62-2.57-.62-1.18 0-1.56.62-2.56.62-1.02 0-2.23-1-3.23-1.95-2.03-1.98-3.58-5.6-3.58-9.03 0-5.43 3.53-8.3 7.02-8.3 1.1 0 2.13.4 2.8.78 1.05.6 1.45.68 2.18.68.73 0 1.25-.13 2.15-.65.92-.53 2.05-.8 3.12-.8 3.03 0 5.48 2.17 6.3 5.04-6.4 2.67-5.38 10.7 1.05 13.06-.68 1.7-1.58 3.4-3.17 4.25zM12.03 3.25c1.47-1.78 2.45-4.25 2.18-6.72-2.12.08-4.7 1.4-6.22 3.18-1.32 1.53-2.48 4.05-2.18 6.5 2.37.18 4.75-1.18 6.22-2.96z" transform="translate(0,-2) scale(0.95)"/></svg>
          Apple
        </Button>
      </div>

      <p className="text-sm text-center text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <button onClick={onSwitch} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
          Create Account
        </button>
      </p>
    </div>
  );
};

// ─── Register Form (inner, 3-step) ────────────────────────────────────────────
const RegisterForm = ({ onSwitch }) => {
  const [step, setStep] = useState(1);
  const { register: signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      full_name: '', username: '', password: '',
      email: '', department: '', academic_year: 'Freshman', profile_pic: null
    }
  });

  const watchFullName = watch('full_name', 'Student');
  const watchYear = watch('academic_year');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setValue('profile_pic', file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const nextStep = async () => {
    const fields = step === 1 ? ['full_name', 'username', 'password'] : step === 2 ? ['email', 'department'] : [];
    const ok = await trigger(fields);
    if (ok) setStep(p => p + 1);
  };

  const prevStep = () => setStep(p => Math.max(1, p - 1));

  const onSubmit = async (data) => {
    const res = await signup({
      full_name: data.full_name, username: data.username, email: data.email,
      password: data.password, department: data.department,
      academic_year: data.academic_year, profile_image: previewUrl || ''
    });
    if (res?.success) navigate('/login');
  };

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Step {step} of 3</span>
        <div className="flex gap-1.5">
          {[1,2,3].map(s => (
            <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step >= s ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create your account</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set up your username and password</p>
            </div>
            <Input label="Full Name" placeholder="John Doe" icon={User} error={errors.full_name?.message}
              {...register('full_name', { required: 'Full Name is required' })} />
            <Input label="Username" placeholder="johndoe24" icon={User} error={errors.username?.message}
              {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'At least 3 characters' } })} />
            <PasswordInput label="Password" placeholder="••••••••" error={errors.password?.message}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
            <Button onClick={nextStep} variant="primary" className="w-full py-3" icon={ArrowRight} iconPosition="right">Continue</Button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Academic Journey</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tell us where you study and your major</p>
            </div>
            <Input label="Email Address" placeholder="name@domain.com" icon={Mail} error={errors.email?.message}
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' } })} />
            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department / Major</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Building size={18} /></div>
                <select
                  className="w-full pl-11 pr-10 py-3 text-slate-900 bg-slate-50/70 border border-slate-200/80 rounded-xl outline-none appearance-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:bg-slate-900/40 dark:text-white dark:border-slate-800"
                  {...register('department', { required: 'Please select a major' })}
                >
                  <option value="">Select your major</option>
                  {majors.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={18} /></div>
              </div>
              {errors.department && <span className="text-xs font-semibold text-red-500">{errors.department.message}</span>}
            </div>
            {/* Year */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Academic Year</label>
              <div className="grid grid-cols-2 gap-2">
                {['Freshman','Sophomore','Junior','Senior'].map(y => (
                  <button key={y} type="button" onClick={() => setValue('academic_year', y)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${watchYear === y
                      ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-300'
                    }`}>{y}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={prevStep} className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-2.5 px-4 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900">Back</button>
              <Button onClick={nextStep} variant="primary" className="flex-1 py-3" icon={ArrowRight} iconPosition="right">Continue</Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Personalize Profile</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add a photo to finish registration</p>
            </div>
            <div className="flex flex-col items-center gap-5 py-2">
              <label className="group relative h-28 w-28 rounded-full border-4 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-center items-center cursor-pointer overflow-hidden shadow-md">
                {previewUrl
                  ? <img src={previewUrl} alt="Preview" className="h-full w-full object-cover group-hover:opacity-80 transition-opacity" />
                  : <><Camera size={26} className="text-slate-400" /><span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Upload Photo</span></>
                }
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <div className="text-center">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Almost there, {watchFullName}!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Upload a photo so your classmates can recognize you.</p>
              </div>
              <div className="w-full flex items-start gap-3 bg-brand-50/40 p-4 rounded-xl border border-brand-100/30 dark:bg-brand-950/20 dark:border-brand-900/20">
                <div className="p-1 rounded bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400 mt-0.5"><Shield size={14} /></div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">By clicking Join, you agree to our Student Conduct Guidelines and Privacy Policy.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={prevStep} className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 py-2.5 px-4 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900">Back</button>
              <Button type="submit" variant="primary" className="flex-1 py-3 text-base" isLoading={isLoading}>Join CampusConnect</Button>
            </div>
          </div>
        )}
      </form>

      <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
        Already a member?{' '}
        <button onClick={onSwitch} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">Sign In</button>
      </p>
    </div>
  );
};

// ─── Main AuthPage ─────────────────────────────────────────────────────────────
const AuthPage = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Theme toggle */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Main body */}
      <div className="flex-1 flex">

        {/* Left info panel */}
        <LeftPanel />

        {/* Right auth panel */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white dark:bg-slate-900">
          
          {/* Mobile logo (shown only below lg) */}
          <div className="lg:hidden mb-8 text-center">
            <Logo iconSize={26} className="justify-center" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Connect · Learn · Grow</p>
          </div>

          {/* Flip card wrapper */}
          <div className="w-full max-w-[460px]" style={{ perspective: '1200px' }}>
            <div
              style={{
                transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
                transformStyle: 'preserve-3d',
                transform: showRegister ? 'rotateY(180deg)' : 'rotateY(0deg)',
                position: 'relative',
                minHeight: showRegister ? '680px' : '520px',
              }}
            >
              {/* Login face */}
              <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: showRegister ? 'absolute' : 'relative', width: '100%' }}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                  <LoginForm onSwitch={() => setShowRegister(true)} />
                </div>
              </div>

              {/* Register face */}
              <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: showRegister ? 'relative' : 'absolute', top: 0, left: 0, width: '100%' }}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                  <RegisterForm onSwitch={() => setShowRegister(false)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Footer */}
      <Footer />
    </div>
  );
};

export default AuthPage;
