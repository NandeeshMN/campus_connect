import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Calendar, ExternalLink, FileText } from 'lucide-react';

const CATEGORIES = ['General', 'Academic', 'Career', 'Social', 'Sports', 'Cultural', 'Tech', 'Workshop'];

const emptyForm = {
  title: '', description: '', category: 'General', venue: '',
  start_date: '', end_date: '', poster_url: '', brochure_url: '',
  apply_link: '', capacity: ''
};

// Input helper
const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{label}</label>
    {children}
  </div>
);
const inputCls = "w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Create / Edit modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = create mode
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.get('/admin/events');
      if (data.success) setEvents(data.events);
    } catch { toast.error('Failed to load events'); }
    finally { setIsLoading(false); }
  };

  const openCreate = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (ev) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title || '',
      description: ev.description || '',
      category: ev.category || 'General',
      venue: ev.venue || '',
      start_date: ev.start_date ? ev.start_date.slice(0, 16) : '',
      end_date: ev.end_date ? ev.end_date.slice(0, 16) : '',
      poster_url: ev.poster_url || '',
      brochure_url: ev.brochure_url || '',
      apply_link: ev.apply_link || '',
      capacity: ev.capacity || ''
    });
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_date) {
      toast.error('Title and Start Date are required');
      return;
    }
    setIsSaving(true);
    try {
      if (editingEvent) {
        const { data } = await adminApi.put(`/admin/events/${editingEvent.id}`, form);
        if (data.success) {
          toast.success('Event updated');
          setEvents(events.map(ev => ev.id === editingEvent.id ? data.event : ev));
          setFormOpen(false);
        }
      } else {
        const { data } = await adminApi.post('/admin/events', form);
        if (data.success) {
          toast.success('Event created');
          setEvents([data.event, ...events]);
          setFormOpen(false);
        }
      }
    } catch { toast.error('Failed to save event'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { data } = await adminApi.delete(`/admin/events/${selectedEvent.id}`);
      if (data.success) {
        toast.success('Event deleted');
        setEvents(events.filter(ev => ev.id !== selectedEvent.id));
        setDeleteOpen(false);
      }
    } catch { toast.error('Failed to delete event'); }
    finally { setIsDeleting(false); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ev.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ev.venue || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Event', render: (ev) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{ev.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{ev.venue || 'No venue set'}</p>
        </div>
      )
    },
    {
      header: 'Category', render: (ev) => (
        <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
          {ev.category}
        </span>
      )
    },
    {
      header: 'Start Date', render: (ev) => (
        <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <Calendar size={13} /> {fmtDate(ev.start_date)}
        </span>
      )
    },
    {
      header: 'End Date', render: (ev) => (
        <span className="text-sm text-slate-500">{fmtDate(ev.end_date)}</span>
      )
    },
    {
      header: 'Links', render: (ev) => (
        <div className="flex items-center gap-2">
          {ev.brochure_url && (
            <a href={ev.brochure_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100">
              <FileText size={11} /> Brochure
            </a>
          )}
          {ev.apply_link && (
            <a href={ev.apply_link} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg hover:bg-green-100">
              <ExternalLink size={11} /> Apply
            </a>
          )}
        </div>
      )
    },
    {
      header: 'Actions', render: (ev) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(ev)}
            className="p-1.5 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors" title="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={() => { setSelectedEvent(ev); setDeleteOpen(true); }}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Event Management</h1>
          <p className="text-slate-500 mt-1">Create and manage all campus events.</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-md shadow-brand-500/20">
          <Plus size={18} /> Create Event
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search events..."
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Event"
        message={`Permanently delete "${selectedEvent?.title}"?`}
        confirmText="Delete Event"
        isDanger={true}
      />

      {/* Create / Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 my-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Event Title *">
                  <input type="text" value={form.title} required
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className={inputCls} placeholder="e.g. Annual Tech Fest 2025" />
                </Field>

                <Field label="Category">
                  <select value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className={inputCls}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Start Date & Time *">
                  <input type="datetime-local" value={form.start_date} required
                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                    className={inputCls} />
                </Field>

                <Field label="End Date & Time">
                  <input type="datetime-local" value={form.end_date}
                    onChange={e => setForm({ ...form, end_date: e.target.value })}
                    className={inputCls} />
                </Field>

                <Field label="Venue">
                  <input type="text" value={form.venue}
                    onChange={e => setForm({ ...form, venue: e.target.value })}
                    className={inputCls} placeholder="e.g. Seminar Hall, Block A" />
                </Field>

                <Field label="Capacity (seats)">
                  <input type="number" value={form.capacity} min="1"
                    onChange={e => setForm({ ...form, capacity: e.target.value })}
                    className={inputCls} placeholder="e.g. 200" />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea value={form.description} rows={3}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className={inputCls + ' resize-none'} placeholder="Event details and agenda..." />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Poster / Banner Image URL">
                    <input type="url" value={form.poster_url}
                      onChange={e => setForm({ ...form, poster_url: e.target.value })}
                      className={inputCls} placeholder="https://..." />
                  </Field>
                </div>

                <Field label="Brochure URL (PDF / Link)">
                  <input type="url" value={form.brochure_url}
                    onChange={e => setForm({ ...form, brochure_url: e.target.value })}
                    className={inputCls} placeholder="https://..." />
                </Field>

                <Field label="Application / Registration Link">
                  <input type="url" value={form.apply_link}
                    onChange={e => setForm({ ...form, apply_link: e.target.value })}
                    className={inputCls} placeholder="https://..." />
                </Field>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                <button type="button" onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md disabled:opacity-70">
                  {isSaving ? 'Saving...' : (editingEvent ? 'Save Changes' : 'Create Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEvents;
