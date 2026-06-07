import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, MessageSquare, BookOpen, Users, Compass, Award, ArrowLeft, ArrowRight as ArrowRightIcon, GraduationCap } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const testimonials = [
  {
    id: 1,
    name: 'Maya Rodriguez',
    major: 'Computer Science, Stanford \'24',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    quote: 'CampusConnect completely redefined how I networked in university. I found my co-founders, shared semester guides, and got referred to my tech internship all through student circles here.'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    major: 'Business Administration, NYU \'25',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    quote: 'Accessing peer-reviewed study files before midterms saved my GPA! The events widget keeps me updated with local college hacking seminars and alumni meetups without cluttering my social feeds.'
  }
];

const LandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-24">
        {/* Glow Effects */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-300 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left side hero content */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 rounded-full border border-brand-100 dark:border-brand-900/30">
                  Future Leaders Start Here
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Empowering Your Academic & <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">Professional Journey.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                A sophisticated network designed for the modern scholar. Connect with mentors, access premium campus resources, and build a community that lasts a lifetime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                    Join Your Campus
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Community
                  </Button>
                </a>
              </div>

              {/* Joined users count mock */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-200/50 dark:border-slate-800/80">
                <div className="flex -space-x-2.5">
                  <img className="h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80" alt="Student" />
                  <img className="h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=80&h=80" alt="Student" />
                  <img className="h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80" alt="Student" />
                </div>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white font-semibold">2,500+</strong> students joined this week
                </span>
              </div>
            </div>

            {/* Right side interactive card widget */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <Card variant="default" className="w-full max-w-md bg-white border border-slate-100 shadow-xl dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 rounded-lg">
                      <Calendar size={18} />
                    </div>
                    <span className="font-bold text-slate-850 dark:text-white">Upcoming Events</span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-650 cursor-pointer">•••</span>
                </div>

                <div className="space-y-4">
                  {/* Event item 1 */}
                  <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="h-12 w-12 flex flex-col items-center justify-center bg-brand-600 text-white rounded-xl font-bold text-xs uppercase shadow-sm">
                      <span className="text-[10px] opacity-80 leading-none">Oct</span>
                      <span className="text-lg leading-tight font-extrabold">24</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Global Tech Summit 2024</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Main Hall • 2:00 PM</p>
                    </div>
                  </div>

                  {/* Event item 2 */}
                  <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="h-12 w-12 flex flex-col items-center justify-center bg-blue-500 text-white rounded-xl font-bold text-xs uppercase shadow-sm">
                      <span className="text-[10px] opacity-80 leading-none">Oct</span>
                      <span className="text-lg leading-tight font-extrabold">28</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Alumni Networking Mixer</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Innovation Center • 5:30 PM</p>
                    </div>
                  </div>
                </div>

                {/* Mentor Mock Card bottom bar */}
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-100" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Sarah Jenkins" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">Dr. Sarah Jenkins</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Career Guidance Mentor</p>
                    </div>
                  </div>
                  <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-350 transition-colors">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* "Everything You Need to Excel" Features Grid */}
      <section id="features" className="py-16 md:py-24 bg-white dark:bg-slate-900/50 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need to <span className="text-brand-600 dark:text-brand-400">Excel</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              A unified platform designed specifically for the collegiate ecosystem, balancing social connectivity with academic success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Vibrant Community */}
            <Card hoverEffect variant="default" className="flex flex-col h-full bg-slate-50/50 border border-slate-100 p-6 dark:bg-slate-900 dark:border-slate-800">
              <div className="p-3 bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 rounded-xl w-fit mb-5">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Vibrant Community</h3>
              <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed flex-grow">
                Find your tribe among thousands of students. From hobbyist clubs to professional associations, connect with those who share your drive.
              </p>
            </Card>

            {/* Academic Resources */}
            <Card hoverEffect variant="default" className="flex flex-col h-full bg-brand-600 text-white border-transparent p-6 shadow-md shadow-brand-600/10">
              <div className="p-3 bg-white/10 text-white rounded-xl w-fit mb-5">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Academic Resources</h3>
              <p className="text-sm text-brand-100 leading-relaxed flex-grow">
                Curated study materials, research papers, and collaborative tools at your fingertips. Share your knowledge and score higher.
              </p>
            </Card>

            {/* Exclusive Events */}
            <Card hoverEffect variant="default" className="flex flex-col h-full bg-slate-50/50 border border-slate-100 p-6 dark:bg-slate-900 dark:border-slate-800">
              <div className="p-3 bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-xl w-fit mb-5">
                <Compass size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Exclusive Events</h3>
              <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed flex-grow">
                From guest lectures to career fairs, never miss an opportunity to learn and grow. Stay on top of your local campus events list.
              </p>
            </Card>

            {/* Career Launchpad */}
            <Card hoverEffect variant="default" className="flex flex-col h-full bg-slate-50/50 border border-slate-100 p-6 dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden">
              <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl w-fit mb-5">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Career Launchpad</h3>
              <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed flex-grow mb-12">
                Direct access to internships and entry-level positions from top-tier partners across the globe. Kickstart your work.
              </p>
              
              {/* Building illustration clip overlay */}
              <div className="absolute right-0 bottom-0 h-16 w-32 opacity-10 dark:opacity-5">
                <svg viewBox="0 0 100 100" fill="currentColor" className="h-full w-full">
                  <path d="M10 90h80V10H70v30H50V25H30v65z" />
                </svg>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* Success Stories Slider */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Success Stories</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hear from students who transformed their journey.</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={prevTestimonial}
                className="p-2.5 rounded-full border border-slate-200 hover:bg-white text-slate-600 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-400 transition-colors"
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={18} />
              </button>
              <button 
                onClick={nextTestimonial}
                className="p-2.5 rounded-full bg-brand-650 hover:bg-brand-600 text-white shadow-md shadow-brand-500/10 transition-colors"
                aria-label="Next testimonial"
              >
                <ArrowRightIcon size={18} />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden w-full">
            <div className="transition-all duration-500 ease-in-out">
              <Card className="bg-white dark:bg-slate-900 p-8 flex flex-col md:flex-row items-center gap-8 border border-slate-100 dark:border-slate-800 shadow-md">
                <img 
                  className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover ring-4 ring-brand-100 dark:ring-brand-900/30" 
                  src={testimonials[activeTestimonial].avatar} 
                  alt={testimonials[activeTestimonial].name} 
                />
                <div className="space-y-4 text-center md:text-left flex-1">
                  <blockquote className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-350 leading-relaxed italic">
                    "{testimonials[activeTestimonial].quote}"
                  </blockquote>
                  <div>
                    <h4 className="font-bold text-slate-950 dark:text-white text-base">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">{testimonials[activeTestimonial].major}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action Banner Section */}
      <section className="py-12 md:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-700 px-8 py-16 text-center shadow-xl sm:px-16">
            
            {/* Background design accents */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-2xl" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Ready to elevate your campus experience?
              </h2>
              <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
                Join the premium community of over 50,000 students across 200 campuses worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link to="/register">
                  <Button variant="secondary" size="lg" className="bg-white hover:bg-slate-50 text-brand-700 font-bold px-8 shadow-md">
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8">
                    Request Campus Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
