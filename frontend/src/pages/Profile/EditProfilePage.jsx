import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Camera, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/userService';

const EditProfilePage = () => {
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImgPreview, setProfileImgPreview] = useState(user?.profile_image || '');
  const [coverImgPreview, setCoverImgPreview] = useState(user?.cover_image || '');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      username: user?.username || '',
      bio: user?.bio || '',
      department: user?.department || '',
      academic_year: user?.academic_year || '',
      github_url: user?.github_url || '',
      linkedin_url: user?.linkedin_url || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        profile_image: profileImgPreview,
        cover_image: coverImgPreview
      };
      await userService.updateProfile(payload);
      toast.success('Profile updated successfully');
      
      // Update local context manually or re-fetch me
      if (refreshSession) await refreshSession();
      navigate('/profile');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/profile')} 
            className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Images section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Profile Images</h3>
              
              <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden group">
                {coverImgPreview ? (
                  <img src={coverImgPreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-brand-400 to-indigo-500 opacity-50" />
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm text-white">
                    <Camera size={24} />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setCoverImgPreview)} />
                </label>
              </div>

              <div className="relative -mt-16 ml-6 w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden group z-10">
                {profileImgPreview ? (
                  <img src={profileImgPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xl font-bold">
                    {user?.full_name?.charAt(0)}
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm text-white">
                    <Camera size={20} />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setProfileImgPreview)} />
                </label>
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" error={errors.full_name?.message} {...register('full_name', { required: 'Name is required' })} />
                <Input label="Username" error={errors.username?.message} {...register('username', { required: 'Username is required' })} />
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-750 dark:text-slate-300 block mb-1.5">Bio</label>
                  <textarea 
                    {...register('bio')}
                    rows={4}
                    className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:bg-slate-900/40 dark:text-white dark:border-slate-800"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Department" {...register('department')} />
                <Input label="Academic Year" {...register('academic_year')} />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="GitHub URL" placeholder="https://github.com/..." {...register('github_url')} />
                <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/..." {...register('linkedin_url')} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => navigate('/profile')}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={loading}>Save Changes</Button>
            </div>

          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditProfilePage;
