import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Search, ExternalLink, FileText, Tag } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

const CATEGORY_COLORS = {
  Academic: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Career: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Social: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Sports: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Cultural: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Tech: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Workshop: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  General: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

const filterTabs = ['All', 'Academic', 'Career', 'Social', 'Sports', 'Cultural', 'Tech', 'Workshop'];

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

const getMonth = (d) => d ? new Date(d).toLocaleString('en-IN', { month: 'short' }).toUpperCase() : '';
const getDay = (d) => d ? new Date(d).getDate() : '';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        if (data.success) setEvents(data.events);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = events.filter(ev => {
    const matchesFilter = activeFilter === 'All' || ev.category === activeFilter;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.venue || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featured = filtered[0] || null;
  const rest = filtered.slice(1);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center h-60 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mr-3" />
            Loading events...
          </div>
        )}

        {/* No events */}
        {!isLoading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Calendar size={28} className="text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">No Upcoming Events</h3>
            <p className="text-sm text-slate-500">The admin hasn't posted any events yet. Check back later!</p>
          </div>
        )}

        {!isLoading && events.length > 0 && (
          <>
            {/* Featured Event Banner */}
            {featured && (
              <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
                {featured.poster_url ? (
                  <img src={featured.poster_url} alt={featured.title}
                    className="w-full h-52 sm:h-64 object-cover"
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-52 sm:h-64 bg-gradient-to-br from-brand-600 to-indigo-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-400 bg-brand-950/50 border border-brand-800/30 backdrop-blur-sm px-2.5 py-1 rounded-full mb-2">
                    Featured Event
                  </span>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-1">{featured.title}</h2>
                  {featured.description && (
                    <p className="text-sm text-white/70 max-w-xl mb-4 hidden sm:block line-clamp-2">{featured.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    {featured.apply_link && (
                      <a href={featured.apply_link} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md">
                        <ExternalLink size={14} /> Apply Now
                      </a>
                    )}
                    {featured.brochure_url && (
                      <a href={featured.brochure_url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
                        <FileText size={14} /> Brochure
                      </a>
                    )}
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {fmtDate(featured.start_date)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {fmtTime(featured.start_date)}</span>
                      {featured.venue && <span className="flex items-center gap-1.5"><MapPin size={14} /> {featured.venue}</span>}
                      {featured.capacity && <span className="flex items-center gap-1.5"><Users size={14} /> {featured.capacity} seats</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter + Search Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap gap-2">
                {filterTabs.map(tab => (
                  <button key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                      activeFilter === tab
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 sm:w-48 w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-400 text-slate-700 dark:text-slate-300 placeholder-slate-400"
                />
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Happenings</h2>

            {/* Events Grid */}
            {rest.length === 0 && filtered.length <= 1 ? (
              <p className="text-center text-slate-500 py-12">No other events found for this filter.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {rest.map(event => (
                  <div key={event.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

                    {/* Image / Date Banner */}
                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-100 to-indigo-100 dark:from-brand-950/40 dark:to-indigo-950/40">
                      {event.poster_url && (
                        <img src={event.poster_url} alt={event.title}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      {/* Date badge */}
                      <div className="absolute top-3 left-3 flex flex-col items-center justify-center bg-brand-600 text-white rounded-xl h-12 w-12 shadow-md">
                        <span className="text-[10px] font-bold uppercase leading-none opacity-80">{getMonth(event.start_date)}</span>
                        <span className="text-lg font-extrabold leading-tight">{getDay(event.start_date)}</span>
                      </div>
                      {/* Category badge */}
                      <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.General}`}>
                        {event.category}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 line-clamp-1">{event.title}</h3>
                      <div className="space-y-1 mb-3">
                        <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Clock size={12} /> {fmtTime(event.start_date)}{event.end_date ? ` – ${fmtTime(event.end_date)}` : ''} · {fmtDate(event.start_date)}
                        </p>
                        {event.venue && (
                          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin size={12} /> {event.venue}
                          </p>
                        )}
                        {event.capacity && (
                          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Users size={12} /> {event.capacity} seats
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {event.apply_link && (
                          <a href={event.apply_link} target="_blank" rel="noreferrer"
                            className="flex-1 text-center py-2 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white transition-all active:scale-95 shadow-sm">
                            Apply / Register
                          </a>
                        )}
                        {event.brochure_url && (
                          <a href={event.brochure_url} target="_blank" rel="noreferrer"
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
                            title="View Brochure">
                            <FileText size={16} />
                          </a>
                        )}
                        {!event.apply_link && !event.brochure_url && (
                          <span className="w-full text-center text-xs text-slate-400 py-2">No registration link</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default EventsPage;
