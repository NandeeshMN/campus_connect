import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAction, setModalAction] = useState(''); // 'suspend' or 'activate'
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await adminApi.get('/admin/users');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async () => {
    setIsActionLoading(true);
    const newStatus = modalAction === 'suspend' ? 'suspended' : 'active';
    try {
      const { data } = await adminApi.patch(`/admin/users/${selectedUser.id}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`User successfully ${newStatus}`);
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
        setModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const openModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setModalOpen(true);
  };

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Name', render: (row) => <div className="font-semibold">{row.first_name} {row.last_name}</div> },
    { header: 'Email', accessor: 'email' },
    { header: 'University', render: (row) => <span className="text-slate-500">{row.university || 'N/A'}</span> },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
        row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}>
        {row.status?.toUpperCase() || 'ACTIVE'}
      </span>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-2">
        {row.status === 'active' ? (
          <button onClick={() => openModal(row, 'suspend')} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Suspend User">
            <ShieldAlert size={18} />
          </button>
        ) : (
          <button onClick={() => openModal(row, 'activate')} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg" title="Activate User">
            <ShieldCheck size={18} />
          </button>
        )}
      </div>
    )}
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-slate-500 mt-1">View and manage all registered students.</p>
      </div>

      <AdminTable 
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name or email..."
      />

      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleStatusChange}
        isLoading={isActionLoading}
        title={modalAction === 'suspend' ? 'Suspend User' : 'Activate User'}
        message={`Are you sure you want to ${modalAction} ${selectedUser?.first_name} ${selectedUser?.last_name}?`}
        confirmText={modalAction === 'suspend' ? 'Suspend' : 'Activate'}
        isDanger={modalAction === 'suspend'}
      />
    </AdminLayout>
  );
};

export default Users;
