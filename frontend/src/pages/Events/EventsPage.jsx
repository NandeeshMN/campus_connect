import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Plus, Tag } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

const featuredEvent = {
  title: 'Annual Winter Gala 2024',
  description: 'An evening of elegance, fusion, and connections! Join us at the historic Grand Ballroom for the most anticipated social event of the year.',
  date: 'Dec 12, 2024',
  time: '7:00 PM',
  location: 'Grand Ballroom',
  image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200&h=400',
  attendees: 312,
};

const filterTabs = ['All', 'Registered', 'Social', 'Career', 'Academic', 'Free'];

const events = [
  {
    id: 1,
    title: 'Autumn Tech Career Fair',
    date: 'Oct 24',
    month: 'OCT',
    day: '24',
    time: 'Thu Oct 1, 2 Hrs',
    location: 'TBF • Companies Attending',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400&h=200',
    attendees: 89,
    tag: 'Career',
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    registered: false,
  },
  {
    id: 2,
    title: 'Homecoming Concert 2024',
    date: 'Oct 26',
    month: 'OCT',
    day: '26',
    time: 'University Stadium',
    location: 'Student Entrance',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=400&h=200',
    attendees: 1200,
    tag: 'Social',
    tagColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    registered: true,
  },
  {
    id: 3,
    title: 'Student Startup Intensive',
    date: 'Nov 02',
    month: 'NOV',
    day: '02',
    time: 'Sat Oct 1 • 10 AM',
    location: 'Innovation & Business Hub',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=400&h=200',
    attendees: 54,
    tag: 'Academic',
    tagColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    registered: false,
  },
  {
    id: 4,
    title: 'Regional Finals: Basketball',
    date: 'Nov 05',
    month: 'NOV',
    day: '05',
    time: 'Centennial Sports Arena',
    location: 'Home Game • St. Louis',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=200',
    attendees: 420,
    tag: 'Sports',
    tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    registered: false,
    isLive: true,
  },
  {
    id: 5,
    title: 'Homecoming Concert 2024',
    date: 'Nov 12',
    month: 'NOV',
    day: '12',
    time: 'City Terrace Ballroom',
    location: 'Connect With Vendors',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=200',
    attendees: 230,
    tag: 'Social',
    tagColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    registered: false,
  },
  {
    id: 6,
    title: 'Alumni Networking Evening',
    date: 'Nov 12',
    month: 'NOV',
    day: '12',
    time: 'City Terrace Ballroom',
    location: 'Connect With Vendors',
    image: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&q=80&w=400&h=200',
    attendees: 175,
    tag: 'Career',
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    registered: false,
  },
];

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [registeredMap, setRegisteredMap] = useState(
    events.reduce((acc, e) => ({ ...acc, [e.id]: e.registered }), {})
  );

  const toggleRegister = (id) => {
    setRegisteredMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Featured Event Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img src={featuredEvent.image} alt={featuredEvent.title} className="w-full h-52 sm:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-400 bg-brand-950/50 border border-brand-800/30 backdrop-blur-sm px-2.5 py-1 rounded-full mb-2">Featured Event</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-1">{featuredEvent.title}</h2>
            <p className="text-sm text-white/70 max-w-xl mb-4 hidden sm:block">{featuredEvent.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md">
                <Calendar size={15} /> Register Now
              </button>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {featuredEvent.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {featuredEvent.time}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {featuredEvent.location}</span>
                <span className="flex items-center gap-1.5"><Users size={14} /> {featuredEvent.attendees}+ attending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter + Search Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  activeFilter === tab
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-400 text-slate-700 dark:text-slate-300 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* "Upcoming Happenings" heading */}
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Happenings</h2>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map(event => (
            <div key={event.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

              {/* Image with date badge */}
              <div className="relative h-36 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex flex-col items-center justify-center bg-brand-600 text-white rounded-xl h-12 w-12 shadow-md">
                  <span className="text-[10px] font-bold uppercase leading-none opacity-80">{event.month}</span>
                  <span className="text-lg font-extrabold leading-tight">{event.day}</span>
                </div>
                {event.isLive && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                )}
                <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${event.tagColor}`}>{event.tag}</span>
              </div>

              {/* Event Info */}
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">{event.title}</h3>
                <div className="space-y-1 mb-3">
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock size={12} /> {event.time}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin size={12} /> {event.location}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Users size={12} /> {event.attendees} attending
                  </p>
                </div>

                <button
                  onClick={() => toggleRegister(event.id)}
                  className={`w-full py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    registeredMap[event.id]
                      ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                  }`}
                >
                  {registeredMap[event.id] ? '✓ Registered' : 'Register'}
                </button>
              </div>
            </div>
          ))}

          {/* Create Event CTA Card */}
          <div className="bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950/20 dark:to-indigo-950/20 rounded-2xl border border-dashed border-brand-200 dark:border-brand-800 shadow-sm p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-brand-400 dark:hover:border-brand-600 transition-colors cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Plus size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Got an idea?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Start your own campus event — a study group, a sport session, or a guest speaker. We've got you covered.</p>
            </div>
            <button className="text-sm font-bold text-brand-600 dark:text-brand-400 border border-brand-300 dark:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/30 px-4 py-2 rounded-xl transition-colors">
              Create New Event
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EventsPage;
