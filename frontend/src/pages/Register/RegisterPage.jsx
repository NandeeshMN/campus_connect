import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, Users, ArrowRight, Camera, Mail, GraduationCap, Building, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Logo from '../../components/common/Logo';
import ThemeToggle from '../../components/common/ThemeToggle';

const majors = [
  'Computer Science',
  'Business Administration',
  'Biology & Life Sciences',
  'Mechanical Engineering',
  'Psychology',
  'Economics',
  'Electrical Engineering'
];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const { register: signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      full_name: '',
      username: '',
      password: '',
      email: '',
      department: '',
      academic_year: 'Freshman',
      profile_pic: null
    }
  });

  const watchFullName = watch('full_name', 'Student');
  const watchYear = watch('academic_year');

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('profile_pic', file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Check validation and step forward
  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ['full_name', 'username', 'password'];
    } else if (step === 2) {
      fieldsToValidate = ['email', 'department'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data) => {
    const res = await signup({
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      password: data.password,
      department: data.department,
      academic_year: data.academic_year,
      profile_image: previewUrl || ''
    });
    if (res.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Upper header */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main split panels */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Marketing Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/50 via-slate-100/50 to-brand-50/40 p-8 sm:p-12 flex flex-col justify-center dark:from-slate-900/60 dark:to-slate-950">
          <div className="max-w-md mx-auto space-y-8">
            <Logo iconSize={28} />
            
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                The future of collegiate networking starts here.
              </h1>
              <p className="text-sm sm:text-base text-slate-655 dark:text-slate-400 leading-relaxed">
                Connect with classmates, find campus events, and share your academic journey with a community that understands the hustle.
              </p>
            </div>

            {/* Bullets feature items */}
            <div className="space-y-6 pt-4">
              
              <div className="flex gap-4">
                <div className="h-10 w-10 flex items-center justify-center bg-brand-100 text-brand-600 rounded-xl dark:bg-brand-900/40 dark:text-brand-450 shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Verified Community</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Exclusively for students with .edu emails.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 flex items-center justify-center bg-indigo-100 text-indigo-650 rounded-xl dark:bg-indigo-900/40 dark:text-indigo-400 shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Department Circles</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Join discussions specific to your major.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Form Wizard Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-slate-900/20 border-l border-slate-100 dark:border-slate-800/60">
          <div className="w-full max-w-[480px]">
            
            {/* Step progress tracker */}
            <div className="flex items-center justify-between mb-8 select-none">
              <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                Step {step} of 3
              </span>
              
              <div className="flex gap-1.5">
                <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* STEP 1: Account Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Set up your username and password</p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      icon={User}
                      error={errors.full_name?.message}
                      {...register('full_name', { required: 'Full Name is required' })}
                    />

                    <Input
                      label="Username"
                      placeholder="johndoe24"
                      icon={User}
                      error={errors.username?.message}
                      {...register('username', { 
                        required: 'Username is required',
                        minLength: { value: 3, message: 'Username must be at least 3 characters' }
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
                  </div>

                  <Button
                    onClick={nextStep}
                    variant="primary"
                    className="w-full py-3"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* STEP 2: Academic Journey */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Academic Journey</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Tell us where you study and major</p>
                  </div>

                  <div className="space-y-5">
                    <Input
                      label="Email Address"
                      placeholder="name@domain.com"
                      icon={Mail}
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email Address is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Must be a valid email address'
                        }
                      })}
                    />

                    {/* Department Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-755 dark:text-slate-300">Department / Major</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-455">
                          <Building size={18} />
                        </div>
                        <select
                          className="w-full pl-11 pr-10 py-3 text-slate-900 bg-slate-50/70 border border-slate-200/80 rounded-xl outline-none text-base appearance-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:bg-slate-900/40 dark:text-white dark:border-slate-800 dark:focus:border-brand-500"
                          {...register('department', { required: 'Please select a major' })}
                        >
                          <option value="">Select your major</option>
                          {majors.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <ChevronDown size={18} />
                        </div>
                      </div>
                      {errors.department && (
                        <span className="text-xs font-semibold text-red-500">{errors.department.message}</span>
                      )}
                    </div>

                    {/* Academic Year chips selection */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Academic Year</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Freshman', 'Sophomore', 'Junior', 'Senior'].map((y) => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => setValue('academic_year', y)}
                            className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 ${
                              watchYear === y
                                ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-400'
                                : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/50 text-slate-700 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-900/70'
                            }`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation actions */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-sm font-bold text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-2.5 px-4 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      Back
                    </button>
                    <Button
                      onClick={nextStep}
                      variant="primary"
                      className="flex-1 py-3"
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Personalize Profile */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personalize Profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Add a picture to finish registration</p>
                  </div>

                  <div className="flex flex-col items-center gap-6 py-4">
                    {/* Avatar Upload circle */}
                    <div className="relative">
                      <label className="group relative h-28 w-28 rounded-full border-4 border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-center items-center cursor-pointer overflow-hidden transition-all shadow-md select-none">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview Avatar" className="h-full w-full object-cover group-hover:opacity-80 transition-opacity" />
                        ) : (
                          <>
                            <Camera size={26} className="text-slate-400 group-hover:scale-105 transition-transform" />
                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Upload Photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    <div className="text-center space-y-1 max-w-sm">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Almost there, {watchFullName}!
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                        Upload a photo so your classmates can recognize you in the campus circles.
                      </p>
                    </div>

                    {/* Disclaimer agreement chip widget */}
                    <div className="w-full flex items-start gap-3 bg-brand-50/40 p-4 rounded-xl border border-brand-100/30 dark:bg-brand-950/20 dark:border-brand-900/20">
                      <div className="p-1 rounded bg-brand-100 text-brand-655 dark:bg-brand-900/50 dark:text-brand-400 mt-0.5">
                        <Shield size={14} />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                        By clicking Join, you agree to our Student Conduct Guidelines and Privacy Policy.
                      </p>
                    </div>
                  </div>

                  {/* Submit actions */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-sm font-bold text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-2.5 px-4 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      Back
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1 py-3 text-base"
                      isLoading={isLoading}
                    >
                      Join CampusConnect
                    </Button>
                  </div>
                </div>
              )}
            </form>

            {/* Bottom members trigger footer link */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850/60 text-center select-none">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Already a member?{' '}
                <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Mini footer */}
      <footer className="w-full bg-slate-100 dark:bg-slate-950/80 border-t border-slate-200/50 dark:border-slate-850 px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-450 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-800 dark:text-slate-200">CampusConnect</span>
          <span>© 2024. All rights reserved.</span>
        </div>
        <div className="flex gap-4 font-semibold">
          <a href="#about" className="hover:text-brand-600 transition-colors">About</a>
          <a href="#privacy" className="hover:text-brand-600 transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-brand-600 transition-colors">Terms</a>
          <a href="#help" className="hover:text-brand-600 transition-colors">Help</a>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
