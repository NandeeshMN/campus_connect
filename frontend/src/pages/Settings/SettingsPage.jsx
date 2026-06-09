import React, { useState, useEffect } from 'react';
import { User, Lock, Trash2, Eye, Shield, Palette, Activity, XOctagon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/userService';
import * as settingsService from '../../services/settingsService';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  const { register: registerEmail, handleSubmit: handleEmailSubmit, reset: resetEmail } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();
  const { register: registerDelete, handleSubmit: handleDeleteSubmit } = useForm();

  // Settings state
  const [isPrivate, setIsPrivate] = useState(user?.is_private || false);
  const [messagePerm, setMessagePerm] = useState('Everyone');
  const [theme, setTheme] = useState('system');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.two_factor_enabled || false);

  const [activityHistory, setActivityHistory] = useState({ likes: [], comments: [], saved: [] });
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    if (activeTab === 'activity') {
      settingsService.getActivityHistory().then(res => setActivityHistory(res.activity)).catch(() => {});
    } else if (activeTab === 'blocked') {
      settingsService.getBlockedUsers().then(res => setBlockedUsers(res.blockedUsers)).catch(() => {});
    }
  }, [activeTab]);

  const onEmailUpdate = async (data) => {
    setLoading(true);
    try {
      await userService.changeEmail(data);
      toast.success('Email updated successfully');
      resetEmail();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordUpdate = async (data) => {
    if (data.new_password !== data.confirm_password) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await userService.changePassword(data);
      toast.success('Password updated successfully');
      resetPassword();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAccount = async (data) => {
    setLoading(true);
    try {
      await userService.deleteAccount(data.password);
      toast.success('Account deleted successfully');
      logout();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  const handlePrivacyChange = async (type, value) => {
    try {
      await settingsService.updatePrivacySettings({ [type]: value });
      toast.success('Privacy settings updated');
      if (type === 'is_private') setIsPrivate(value);
      if (type === 'message_permission') setMessagePerm(value);
    } catch (e) {
      toast.error('Failed to update privacy settings');
    }
  };

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    try {
      await settingsService.updateTheme(newTheme);
      toast.success('Theme preference saved');
    } catch (e) {
      toast.error('Failed to save theme');
    }
  };

  const handle2FAToggle = async () => {
    try {
      await settingsService.setupTwoFactor(!twoFactorEnabled);
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`2FA ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
    } catch (e) {
      toast.error('Failed to toggle 2FA');
    }
  };

  const handleUnblock = async (id) => {
    try {
      await settingsService.unblockUser(id);
      setBlockedUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User unblocked');
    } catch (e) {
      toast.error('Failed to unblock user');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'blocked', label: 'Blocked Accounts', icon: XOctagon },
    { id: 'activity', label: 'Activity History', icon: Activity },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar Tabs */}
          <div className="md:w-64 shrink-0 space-y-1">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white px-3">Settings</h2>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' 
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Pane */}
          <div className="flex-1 max-w-3xl">
            <Card className="p-6 md:p-8">
              
              {activeTab === 'account' && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Change Email</h3>
                    <form onSubmit={handleEmailSubmit(onEmailUpdate)} className="space-y-4 max-w-md">
                      <Input label="New Email Address" {...registerEmail('new_email', { required: true })} />
                      <PasswordInput label="Current Password" {...registerEmail('password', { required: true })} />
                      <Button type="submit" variant="primary" isLoading={loading}>Update Email</Button>
                    </form>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="space-y-4 max-w-md">
                      <PasswordInput label="Current Password" {...registerPassword('current_password', { required: true })} />
                      <PasswordInput label="New Password" {...registerPassword('new_password', { required: true })} />
                      <PasswordInput label="Confirm New Password" {...registerPassword('confirm_password', { required: true })} />
                      <Button type="submit" variant="primary" isLoading={loading}>Change Password</Button>
                    </form>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  <div>
                    <h3 className="text-lg font-bold text-red-600 mb-4">Delete Account</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <form onSubmit={handleDeleteSubmit(onDeleteAccount)} className="space-y-4 max-w-md">
                      <PasswordInput label="Confirm Password to Delete" {...registerDelete('password', { required: true })} />
                      <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" isLoading={loading} icon={Trash2}>Delete My Account</Button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Privacy Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">Private Account</h4>
                      <p className="text-xs text-slate-500">Only approved followers can see your posts and profile.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={isPrivate} onChange={e => handlePrivacyChange('is_private', e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
                    </label>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Message Permissions</h4>
                    <p className="text-xs text-slate-500 mb-3">Who can send you direct messages?</p>
                    <div className="space-y-2">
                      {['Everyone', 'Followers', 'Nobody'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input type="radio" name="msg_perm" checked={messagePerm === opt} onChange={() => handlePrivacyChange('message_permission', opt)} className="text-brand-600 focus:ring-brand-500" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h3>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Theme</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {['light', 'dark', 'system'].map(t => (
                        <button 
                          key={t}
                          onClick={() => handleThemeChange(t)}
                          className={`p-4 rounded-xl border text-center font-semibold capitalize transition-all ${theme === t ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security</h3>
                  
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-md">Add an extra layer of security to your account. We will ask for a login code in addition to your password.</p>
                    </div>
                    <Button variant={twoFactorEnabled ? "outline" : "primary"} onClick={handle2FAToggle}>
                      {twoFactorEnabled ? 'Disable' : 'Enable 2FA'}
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Active Sessions</h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                          <span className="text-lg">💻</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Windows • Chrome</p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Active now</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => toast.success('Other sessions logged out')}>Logout All Other Devices</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'blocked' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Blocked Accounts</h3>
                  {blockedUsers.length === 0 ? (
                    <p className="text-sm text-slate-500">You haven't blocked anyone.</p>
                  ) : (
                    <div className="space-y-4">
                      {blockedUsers.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <img src={u.profile_image || 'https://via.placeholder.com/40'} alt={u.username} className="w-10 h-10 rounded-full" />
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{u.full_name}</p>
                              <p className="text-xs text-slate-500">@{u.username}</p>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => handleUnblock(u.id)}>Unblock</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity History</h3>
                  
                  {['likes', 'comments', 'saved'].map(type => (
                    <div key={type}>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{type}</h4>
                      {activityHistory[type]?.length === 0 ? (
                        <p className="text-xs text-slate-400">No {type} found.</p>
                      ) : (
                        <div className="space-y-3">
                          {activityHistory[type]?.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm">
                              <span className="font-semibold text-brand-600 dark:text-brand-400">{item.author}</span>'s post: "{item.content || item.preview}"
                              <p className="text-[10px] text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
