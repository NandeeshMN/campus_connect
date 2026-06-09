import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';
import { Trash2, Plus } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const initialResourceState = { 
    title: '', description: '', file_url: '', category: 'Academic Resources', file_type: 'PDF',
    department: '', semester: '', resource_type: '', subject: '', year: '', 
    subcategory: '', company: '', provider: '', technology: ''
  };
  const [newResource, setNewResource] = useState(initialResourceState);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data } = await adminApi.get('/admin/resources');
      if (data.success) {
        setResources(data.resources);
      }
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.file_url) {
      toast.error('Title and URL are required');
      return;
    }
    
    setIsUploading(true);
    try {
      const { data } = await adminApi.post('/admin/resources', newResource);
      if (data.success) {
        toast.success('Resource uploaded');
        setResources([{...data.resource, first_name: 'Admin', last_name: 'User', downloads: 0}, ...resources]);
        setUploadModalOpen(false);
        setNewResource(initialResourceState);
      }
    } catch (error) {
      toast.error('Failed to upload resource');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsActionLoading(true);
    try {
      const { data } = await adminApi.delete(`/admin/resources/${selectedResource.id}`);
      if (data.success) {
        toast.success('Resource deleted successfully');
        setResources(resources.filter(r => r.id !== selectedResource.id));
        setModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to delete resource');
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Title', render: (row) => <div className="font-semibold">{row.title}</div> },
    { header: 'Category', render: (row) => <span className="uppercase text-xs font-bold text-slate-500">{row.category}</span> },
    { header: 'Uploader', render: (row) => <span className="text-slate-500">{row.first_name} {row.last_name}</span> },
    { header: 'Downloads', render: (row) => <span className="font-mono bg-slate-100 px-2 py-1 rounded-md">{row.downloads || 0}</span> },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => { setSelectedResource(row); setModalOpen(true); }} 
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Resource"
        >
          <Trash2 size={18} />
        </button>
      </div>
    )}
  ];

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resource Management</h1>
          <p className="text-slate-500 mt-1">Manage academic and career resources across the platform.</p>
        </div>
        <button 
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-md shadow-brand-500/20"
        >
          <Plus size={18} />
          Upload Resource
        </button>
      </div>

      <AdminTable 
        columns={columns}
        data={filteredResources}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search title or category..."
      />

      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isActionLoading}
        title="Delete Resource"
        message={`Are you sure you want to permanently delete the resource "${selectedResource?.title}"?`}
        confirmText="Delete Resource"
        isDanger={true}
      />

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 my-8 relative">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Upload Admin Resource</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Category</label>
                <select 
                  value={newResource.category}
                  onChange={(e) => setNewResource({...initialResourceState, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-500"
                >
                  <option>Academic Resources</option>
                  <option>Notes Repository</option>
                  <option>Placement Resources</option>
                  <option>Previous Year Papers</option>
                  <option>Certification Hub</option>
                  <option>Coding Resources</option>
                  <option>Resume & Career Hub</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-500" 
                    required
                  />
                </div>

                {/* DYNAMIC FIELDS BASED ON CATEGORY */}

                {/* Academic Resources */}
                {newResource.category === 'Academic Resources' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                      <input type="text" value={newResource.department} onChange={(e) => setNewResource({...newResource, department: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Computer Science" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                      <select value={newResource.semester} onChange={(e) => setNewResource({...newResource, semester: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <option value="">Select Semester...</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Type</label>
                      <input type="text" value={newResource.resource_type} onChange={(e) => setNewResource({...newResource, resource_type: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Textbook, Lecture Slides" required />
                    </div>
                  </>
                )}

                {/* Notes Repository */}
                {newResource.category === 'Notes Repository' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                      <input type="text" value={newResource.department} onChange={(e) => setNewResource({...newResource, department: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                      <input type="text" value={newResource.subject} onChange={(e) => setNewResource({...newResource, subject: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Data Structures" required />
                    </div>
                  </>
                )}

                {/* Placement Resources */}
                {newResource.category === 'Placement Resources' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Placement Category</label>
                      <input type="text" value={newResource.subcategory} onChange={(e) => setNewResource({...newResource, subcategory: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Interview Prep, Aptitude" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Company (Optional)</label>
                      <input type="text" value={newResource.company} onChange={(e) => setNewResource({...newResource, company: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Google, Amazon" />
                    </div>
                  </>
                )}

                {/* Previous Year Papers */}
                {newResource.category === 'Previous Year Papers' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                      <input type="text" value={newResource.department} onChange={(e) => setNewResource({...newResource, department: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                      <select value={newResource.semester} onChange={(e) => setNewResource({...newResource, semester: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <option value="">Select Semester...</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                      <input type="text" value={newResource.subject} onChange={(e) => setNewResource({...newResource, subject: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Year</label>
                      <input type="text" value={newResource.year} onChange={(e) => setNewResource({...newResource, year: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. 2023" required />
                    </div>
                  </>
                )}

                {/* Certification Hub */}
                {newResource.category === 'Certification Hub' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Certification Provider</label>
                    <input type="text" value={newResource.provider} onChange={(e) => setNewResource({...newResource, provider: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Coursera, AWS, Cisco" required />
                  </div>
                )}

                {/* Coding Resources */}
                {newResource.category === 'Coding Resources' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Technology Category</label>
                    <input type="text" value={newResource.technology} onChange={(e) => setNewResource({...newResource, technology: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Web Dev, Machine Learning, DSA" required />
                  </div>
                )}

                {/* Resume & Career Hub */}
                {newResource.category === 'Resume & Career Hub' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Type</label>
                    <input type="text" value={newResource.resource_type} onChange={(e) => setNewResource({...newResource, resource_type: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" placeholder="e.g. Resume Template, Cover Letter Guide" required />
                  </div>
                )}

                {/* Common fields below dynamic */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">File Type</label>
                  <select 
                    value={newResource.file_type}
                    onChange={(e) => setNewResource({...newResource, file_type: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  >
                    <option>PDF</option>
                    <option>Link</option>
                    <option>DOCX</option>
                    <option>Video</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL / Link</label>
                  <input 
                    type="url" 
                    value={newResource.file_url}
                    onChange={(e) => setNewResource({...newResource, file_url: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-500" 
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button 
                  type="button" 
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md disabled:opacity-70"
                >
                  {isUploading ? 'Uploading...' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Resources;
