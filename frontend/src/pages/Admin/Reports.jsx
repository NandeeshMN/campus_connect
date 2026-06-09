import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalAction, setModalAction] = useState(''); // 'resolved' or 'rejected'
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await adminApi.get('/admin/reports');
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    setIsActionLoading(true);
    try {
      const { data } = await adminApi.patch(`/admin/reports/${selectedReport.id}/resolve`, { status: modalAction });
      if (data.success) {
        toast.success(`Report marked as ${modalAction}`);
        setReports(reports.map(r => r.id === selectedReport.id ? { ...r, status: modalAction } : r));
        setModalOpen(false);
      }
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const openModal = (report, action) => {
    setSelectedReport(report);
    setModalAction(action);
    setModalOpen(true);
  };

  const filteredReports = reports.filter(r => 
    r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.target_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Target Type', render: (row) => <span className="font-semibold uppercase text-xs">{row.target_type}</span> },
    { header: 'Target ID', accessor: 'target_id' },
    { header: 'Reason', render: (row) => <span className="text-slate-600 truncate max-w-[200px] inline-block">{row.reason}</span> },
    { header: 'Reporter', render: (row) => <span className="text-slate-500">{row.reporter_first} {row.reporter_last}</span> },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
        row.status === 'pending' ? 'bg-amber-100 text-amber-700' :
        row.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-2">
        {row.status === 'pending' && (
          <>
            <button onClick={() => openModal(row, 'resolved')} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg" title="Resolve Report">
              <CheckCircle size={18} />
            </button>
            <button onClick={() => openModal(row, 'rejected')} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Reject Report">
              <XCircle size={18} />
            </button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report Management</h1>
        <p className="text-slate-500 mt-1">Review user-submitted reports for posts, users, or resources.</p>
      </div>

      <AdminTable 
        columns={columns}
        data={filteredReports}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search reason or type..."
      />

      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleResolve}
        isLoading={isActionLoading}
        title={modalAction === 'resolved' ? 'Resolve Report' : 'Reject Report'}
        message={`Are you sure you want to mark this report as ${modalAction}?`}
        confirmText={modalAction === 'resolved' ? 'Resolve' : 'Reject'}
        isDanger={modalAction === 'rejected'}
      />
    </AdminLayout>
  );
};

export default Reports;
