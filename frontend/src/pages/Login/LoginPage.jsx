import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Logo from '../../components/common/Logo';
import ThemeToggle from '../../components/common/ThemeToggle';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 overflow-hidden transition-colors duration-300">
      
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] bg-brand-500/20 dark:bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Theme Toggle upper corner */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[460px] z-10 flex flex-col items-center gap-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1 select-none">
          <Logo iconSize={26} className="justify-center" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Premium Collegiate Social Network
          </p>
        </div>

        {/* Card Frame */}
        <Card variant="glass" className="w-full shadow-2xl border border-white/20 dark:border-slate-800/40 p-8">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please enter your university credentials
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* University Email Input */}
            <Input
              label="University Email"
              placeholder="name@university.edu"
              icon={Mail}
              error={errors.email?.message}
              {...register('email', {
                required: 'University Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.edu(\.[^\s@]+)?$/,
                  message: 'Must be a valid university email (.edu)'
                }
              })}
            />

            {/* Password Input */}
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30 h-4.5 w-4.5 dark:border-slate-700 dark:bg-slate-900"
                  {...register('rememberMe')}
                />
                Remember me
              </label>
              
              <a 
                href="#forgot" 
                className="text-brand-650 hover:text-brand-600 font-semibold dark:text-brand-400 dark:hover:text-brand-350 transition-colors"
                onClick={(e) => { e.preventDefault(); alert('Simulated forgot password trigger.'); }}
              >
                Forgot password?
              </a>
            </div>

            {/* Login CTA */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full py-3 text-base shadow-lg shadow-brand-500/20"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Log in to CampusConnect</span>
              </div>
            </Button>
          </form>

          {/* Social login divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200/60 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
              <span className="bg-[#e8ebf1]/65 dark:bg-slate-900/65 px-3 text-slate-500 dark:text-slate-400 rounded-full backdrop-blur-sm">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google & Apple integration */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-white/80 dark:bg-slate-900/50 flex items-center justify-center gap-2 hover:bg-white text-sm py-2.5"
              onClick={() => alert('Mock OAuth: Connecting to Google')}
            >
              {/* Simple Google SVG icon */}
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.65 4.5 1.8l2.4-2.4C17.3 1.7 14.85 1 12.24 1c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.77 0 9.6-4.06 9.6-9.8 0-.66-.06-1.32-.16-1.915h-9.44z"/>
              </svg>
              <span>Google</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white/80 dark:bg-slate-900/50 flex items-center justify-center gap-2 hover:bg-white text-sm py-2.5"
              onClick={() => alert('Mock OAuth: Connecting to Apple')}
            >
              {/* Simple Apple SVG icon */}
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05 1.88-3.08 1.88-1.05 0-1.37-.62-2.57-.62-1.18 0-1.56.62-2.56.62-1.02 0-2.23-1-3.23-1.95-2.03-1.98-3.58-5.6-3.58-9.03 0-5.43 3.53-8.3 7.02-8.3 1.1 0 2.13.4 2.8.78 1.05.6 1.45.68 2.18.68.73 0 1.25-.13 2.15-.65.92-.53 2.05-.8 3.12-.8 3.03 0 5.48 2.17 6.3 5.04-6.4 2.67-5.38 10.7 1.05 13.06-.68 1.7-1.58 3.4-3.17 4.25zM12.03 3.25c1.47-1.78 2.45-4.25 2.18-6.72-2.12.08-4.7 1.4-6.22 3.18-1.32 1.53-2.48 4.05-2.18 6.5 2.37.18 4.75-1.18 6.22-2.96z" transform="translate(0, -2) scale(0.95)"/>
              </svg>
              <span>Apple</span>
            </Button>
          </div>
        </Card>

        {/* Footnote Link */}
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 select-none">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-brand-650 hover:text-brand-600 font-bold dark:text-brand-400 dark:hover:text-brand-350 transition-colors"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
