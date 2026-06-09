import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminApi from '../../services/adminApi';
import { Users, FileText, BookOpen, AlertTriangle, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
    </div>
    <div className={`p-4 rounded-2xl ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPosts: 0,
    totalResources: 0,
    reportedPosts: 0,
    reportedUsers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.get('/admin/dashboard-stats');
        if (response.data.success) {
          setStats(response.data.stats);
          setRecentActivities(response.data.recentActivities || []);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time statistics and administrative insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
        />
        <StatCard 
          title="Total Posts" 
          value={stats.totalPosts} 
          icon={FileText} 
          colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" 
        />
        <StatCard 
          title="Total Resources" 
          value={stats.totalResources} 
          icon={BookOpen} 
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" 
        />
        <StatCard 
          title="Reported Posts" 
          value={stats.reportedPosts} 
          icon={AlertTriangle} 
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
        />
        <StatCard 
          title="Reported Users" 
          value={stats.reportedUsers} 
          icon={AlertTriangle} 
          colorClass="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
        />
        <StatCard 
          title="System Health" 
          value="Online" 
          icon={Activity} 
          colorClass="bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" 
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Admin Activity</h2>
        {recentActivities.length === 0 ? (
          <p className="text-slate-500 text-sm">No recent activity found.</p>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg shrink-0">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white font-semibold">
                    {activity.admin_name} <span className="text-slate-500 font-normal">performed</span> <span className="uppercase text-xs font-bold text-brand-600">{activity.action}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Target: {activity.target_type} (#{activity.target_id})
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
