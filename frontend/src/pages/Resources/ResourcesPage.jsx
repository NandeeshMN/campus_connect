import React, { useState, useEffect } from 'react';
import { Search, Library, Briefcase, Code, GraduationCap, FileText, Award, FileQuestion } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import SectionHeader from './components/SectionHeader';
import ResourceCard from './components/ResourceCard';
import EmptyState from './components/EmptyState';
import CategoryFilter from './components/CategoryFilter';
import { seedResources } from '../../data/resourcesData';
// Assume API exists, we'll fall back to seed data if it fails or is empty
// import * as resourcesService from '../../services/resourcesService';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Featured');
  const [activeDepartment, setActiveDepartment] = useState('MCA');

  useEffect(() => {
    // In a real scenario, we'd fetch from API:
    // resourcesService.getResources().then(res => setResources(res.data)).catch(() => setResources(seedResources));
    
    // Using seed data as per "Fallback Strategy" plan
    setResources(seedResources);
    setLoading(false);
  }, []);

  const handleDownload = (resource) => {
    // API call to increment download count
    // window.open(resource.file_url, '_blank');
    console.log('Downloading:', resource.title);
  };

  const handleView = (resource) => {
    // API call to increment view count
    console.log('Viewing:', resource.title);
  };

  const filterResources = (category, subcategory, extraFilters = {}) => {
    return resources.filter(r => {
      if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (category && r.category !== category) return false;
      if (subcategory && r.subcategory !== subcategory) return false;
      
      for (const [key, value] of Object.entries(extraFilters)) {
        if (r[key] !== value) return false;
      }
      return true;
    });
  };

  const tabs = [
    { id: 'Featured', label: 'Featured', icon: Award },
    { id: 'Academic', label: 'Academic & Depts', icon: Library },
    { id: 'Notes', label: 'Notes Hub', icon: FileText },
    { id: 'Placement', label: 'Placement Prep', icon: Briefcase },
    { id: 'Coding', label: 'Coding Resources', icon: Code },
    { id: 'Career', label: 'Resume & Career', icon: GraduationCap },
    { id: 'PYQ', label: 'PYQ', icon: FileQuestion },
  ];

  const featuredResources = resources.filter(r => r.is_featured);
  const recentUploads = [...resources].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Top Header Section */}
        <div className="bg-brand-600 dark:bg-brand-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Campus Knowledge Hub</h1>
            <p className="text-brand-100 text-sm md:text-base mb-6 leading-relaxed">
              Access premium academic notes, placement materials, certifications, coding roadmaps, and career guides tailored for your success.
            </p>
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for notes, past papers, or guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-500/30 shadow-lg"
              />
            </div>
          </div>
          
          {/* Abstract decorative background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl"></div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Resource Categories</h3>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-900/30 dark:text-brand-400 border border-brand-100 dark:border-brand-800/50'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* FEATURED & RECENT (Home tab) */}
            {activeTab === 'Featured' && (
              <div className="space-y-10 animate-fade-in">
                <section>
                  <SectionHeader title="Featured Essentials" icon={Award} />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {featuredResources.map(res => (
                      <ResourceCard key={res.id} resource={res} onDownload={handleDownload} onView={handleView} />
                    ))}
                  </div>
                </section>
                
                <section>
                  <SectionHeader title="Recently Uploaded" />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {recentUploads.map(res => (
                      <ResourceCard key={res.id} resource={res} onDownload={handleDownload} onView={handleView} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ACADEMIC & DEPARTMENTS */}
            {activeTab === 'Academic' && (
              <div className="space-y-8 animate-fade-in">
                <CategoryFilter 
                  categories={['MCA', 'MBA', 'BCA', 'BBA']} 
                  activeCategory={activeDepartment} 
                  onChange={setActiveDepartment} 
                />
                
                <section>
                  <SectionHeader title={`${activeDepartment} Resources`} />
                  {filterResources('Academic', null, { department: activeDepartment }).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filterResources('Academic', null, { department: activeDepartment }).map(res => (
                        <ResourceCard key={res.id} resource={res} onDownload={handleDownload} onView={handleView} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message={`No resources uploaded yet for ${activeDepartment}.`} />
                  )}
                </section>
              </div>
            )}

            {/* NOTES REPOSITORY */}
            {activeTab === 'Notes' && (
              <div className="space-y-6 animate-fade-in">
                <SectionHeader title="Subject Notes Repository" icon={FileText} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filterResources('Academic', null, { resource_type: 'notes' }).length > 0 ? (
                    filterResources('Academic', null, { resource_type: 'notes' }).map(res => (
                      <ResourceCard key={res.id} resource={res} onDownload={handleDownload} onView={handleView} />
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            )}

            {/* PLACEMENT & CAREER */}
            {(activeTab === 'Placement' || activeTab === 'Career') && (
              <div className="space-y-6 animate-fade-in">
                <SectionHeader title={activeTab === 'Placement' ? "Placement Preparation" : "Resume & Career Hub"} icon={Briefcase} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filterResources(activeTab).length > 0 ? (
                    filterResources(activeTab).map(res => (
                      <ResourceCard key={res.id} resource={res} onDownload={handleDownload} onView={handleView} />
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            )}

            {/* CODING & CERTIFICATION */}
            {activeTab === 'Coding' && (
              <div className="space-y-6 animate-fade-in">
                <SectionHeader title="Coding & Certification Roadmaps" icon={Code} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filterResources('Coding').concat(filterResources('Certification')).length > 0 ? (
                    filterResources('Coding').concat(filterResources('Certification')).map(res => (
                      <ResourceCard key={res.id} resource={res} onDownload={handleDownload} onView={handleView} />
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            )}

            {/* PYQ */}
            {activeTab === 'PYQ' && (
              <div className="space-y-6 animate-fade-in">
                <SectionHeader title="Previous Year Question Papers" icon={FileQuestion} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filterResources('PYQ').length > 0 ? (
                    filterResources('PYQ').map(res => (
                      <ResourceCard key={res.id} resource={res} onDownload={handleDownload} onView={handleView} />
                    ))
                  ) : (
                    <EmptyState message="No previous year papers found." />
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ResourcesPage;
