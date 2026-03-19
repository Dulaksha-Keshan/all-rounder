'use client';
import { useEffect, useState } from 'react';
import { Search, Filter, BarChart2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEventStore } from '@/context/useEventStore';
import { useSchoolStore } from '@/context/useSchoolStore';
import { EventList } from './EventList';

const LIMIT = 10;

export default function EventsClient() {
  const searchParams = useSearchParams();
  const { events, pagination, isLoading, fetchEvents } = useEventStore();
  const { schools, fetchSchools } = useSchoolStore();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

  useEffect(() => {
    void fetchEvents(1, LIMIT);
    void fetchSchools();
  }, [fetchEvents, fetchSchools]);

  useEffect(() => {
    const schoolIdFromQuery = searchParams.get('schoolId') || '';
    if (schoolIdFromQuery) {
      setSelectedSchoolId(schoolIdFromQuery);
      const matchedSchool = schools.find((school) => school.school_id === schoolIdFromQuery);
      if (matchedSchool) {
        setSchoolSearchTerm(matchedSchool.name);
      }
    }
  }, [searchParams, schools]);

  const handlePageChange = (newPage: number) => {
    fetchEvents(newPage, LIMIT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const now = new Date();

  const filteredEvents = events.filter(event => {
    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    const isCompleted = eventEnd < now;
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'upcoming' && !isCompleted) ||
      (activeTab === 'completed' && isCompleted);

    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All Categories' ||
      event.category === selectedCategory;

    const matchesSchool = !selectedSchoolId ||
      (event.hosts || []).some(
        (host) => host.hostType === 'school' && host.hostId === selectedSchoolId
      );

    return matchesTab && matchesSearch && matchesCategory && matchesSchool;
  });

  const allCategories = Array.from(new Set(events.map(e => e.category).filter(Boolean)));
  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(schoolSearchTerm.toLowerCase())
  );
  const selectedSchool = selectedSchoolId
    ? schools.find((school) => school.school_id === selectedSchoolId)
    : null;

  return (
    <div className="min-h-screen py-0 bg-[var(--page-bg)] transition-colors duration-300">
      {/* Header Section */}
      <div className="relative py-15 bg-[var(--primary-dark-purple)] text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-6xl text-[var(--secondary-light-lavender)] opacity-10 animate-pulse">★</div>
        <div className="absolute top-20 right-20 text-5xl text-[var(--primary-purple)] opacity-10 animate-pulse delay-75">★</div>
        <div className="absolute bottom-10 left-1/4 text-4xl text-[var(--secondary-light-lavender)] opacity-10 animate-pulse delay-150">★</div>
        <div className="absolute bottom-20 right-1/4 text-5xl text-[var(--primary-purple)] opacity-10 animate-pulse delay-300">★</div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/70 mb-6 text-sm font-medium">
            <span>Home</span>
            <span>›</span>
            <span className="text-white font-bold">Competitions & Events</span>
          </div>

          <h1 className="text-6xl font-bold mb-4">
            Competitions & <span className="text-[var(--primary-blue)]">Events Hub</span>
          </h1>
          <p className="text-xl text-[var(--accent-purple-text)] max-w-2xl font-medium">
            Discover opportunities to showcase your talents, learn new skills, and compete with peers across various disciplines
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${activeTab === 'all'
              ? 'bg-[var(--primary-blue)] text-white shadow-lg scale-105'
              : 'bg-[var(--white)] text-[var(--text-main)] hover:bg-[var(--secondary-light-lavender)]/20 shadow-md border border-[var(--gray-200)]'
              }`}
          >
            All Competitions
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${activeTab === 'upcoming'
              ? 'bg-[var(--primary-blue)] text-white shadow-lg scale-105'
              : 'bg-[var(--white)] text-[var(--text-main)] hover:bg-[var(--secondary-light-lavender)]/20 shadow-md border border-[var(--gray-200)]'
              }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${activeTab === 'completed'
              ? 'bg-[var(--primary-blue)] text-white shadow-lg scale-105'
              : 'bg-[var(--white)] text-[var(--text-main)] hover:bg-[var(--secondary-light-lavender)]/20 shadow-md border border-[var(--gray-200)]'
              }`}
          >
            Completed
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-[var(--white)] rounded-2xl p-6 shadow-lg border-2 border-[var(--primary-purple)] sticky top-6">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="w-5 h-5 text-[var(--primary-purple)]" />
                <h3 className="text-xl font-bold text-[var(--text-main)]">Filters</h3>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[var(--primary-purple)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-[var(--white)] text-sm font-medium text-[var(--text-main)]"
                >
                  <option>All Categories</option>
                  {allCategories.map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-5 relative">
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">School</label>
                <input
                  type="text"
                  value={schoolSearchTerm}
                  onChange={(e) => {
                    setSchoolSearchTerm(e.target.value);
                    setIsSchoolDropdownOpen(true);
                    if (!e.target.value) {
                      setSelectedSchoolId('');
                    }
                  }}
                  onFocus={() => setIsSchoolDropdownOpen(true)}
                  placeholder="Search school"
                  className="w-full px-3 py-2 border-2 border-[var(--primary-purple)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-[var(--white)] text-sm font-medium text-[var(--text-main)]"
                />

                {isSchoolDropdownOpen && schoolSearchTerm.trim() && (
                  <div className="absolute z-20 mt-2 w-full max-h-56 overflow-y-auto rounded-xl border border-[var(--gray-200)] bg-[var(--white)] shadow-lg">
                    {filteredSchools.length > 0 ? (
                      filteredSchools.map((school) => (
                        <button
                          key={school.school_id}
                          type="button"
                          onClick={() => {
                            setSelectedSchoolId(school.school_id);
                            setSchoolSearchTerm(school.name);
                            setIsSchoolDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-[var(--secondary-light-lavender)]/20 text-sm text-[var(--text-main)]"
                        >
                          {school.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-[var(--text-muted)]">No schools found</div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setSelectedSchoolId('');
                  setSchoolSearchTerm('');
                  setIsSchoolDropdownOpen(false);
                }}
                className="w-full px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm shadow-md"
              >
                Reset Filters
              </button>

              <div className="mt-8 pt-6 border-t border-[var(--gray-200)]">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 className="w-4 h-4 text-[var(--primary-blue)]" />
                  <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Quick Stats</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-[var(--gray-50)] rounded-xl p-4 border border-[var(--gray-200)] transition-all hover:shadow-md">
                    <div className="text-2xl font-bold text-[var(--text-main)]">{pagination.total || events.length}</div>
                    <div className="text-xs text-[var(--text-muted)] font-medium">Total Events Available</div>
                  </div>
                  <div className="bg-[var(--primary-blue)]/10 rounded-xl p-4 border border-[var(--primary-blue)]/20 transition-all hover:shadow-md">
                    <div className="text-2xl font-bold text-[var(--primary-blue)]">{events.filter(e => new Date(e.endDate || e.startDate) >= now).length}</div>
                    <div className="text-xs text-[var(--primary-blue)] font-medium">Upcoming Events</div>
                  </div>
                  <div className="bg-[var(--primary-purple)]/10 rounded-xl p-4 border border-[var(--primary-purple)]/20 transition-all hover:shadow-md">
                    <div className="text-2xl font-bold text-[var(--primary-purple)]">{events.filter(e => new Date(e.endDate || e.startDate) < now).length}</div>
                    <div className="text-xs text-[var(--primary-purple)] font-medium">Completed Events</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-8">
              {selectedSchoolId && (
                <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--primary-blue)]/30 bg-[var(--primary-blue)]/10 px-4 py-3">
                  <p className="text-sm font-medium text-[var(--primary-blue)]">
                    Active School Filter: <span className="font-bold">{selectedSchool?.name || selectedSchoolId}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSchoolId('');
                      setSchoolSearchTerm('');
                      setIsSchoolDropdownOpen(false);
                    }}
                    className="rounded-lg border border-[var(--primary-blue)]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--primary-blue)] hover:bg-[var(--secondary-light-lavender)]/20"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-[#8387CC] group-focus-within:text-[var(--primary-blue)] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search competitions by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-[var(--white)] border border-[var(--gray-200)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--primary-blue)]/50 text-lg shadow-xl shadow-[var(--gray-200)]/10 transition-all placeholder:text-[var(--text-muted)] text-[var(--text-main)]"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-[var(--primary-purple)] animate-spin" />
              </div>
            ) : (
              <EventList events={filteredEvents} />
            )}

            {/* Pagination */}
            {pagination.pages > 1 && !isLoading && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[var(--gray-200)] bg-[var(--white)] text-[var(--text-main)] font-medium text-sm hover:bg-[var(--secondary-light-lavender)]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                      p === pagination.page
                        ? 'bg-[var(--primary-blue)] text-white shadow-lg scale-105'
                        : 'bg-[var(--white)] text-[var(--text-main)] border border-[var(--gray-200)] hover:bg-[var(--secondary-light-lavender)]/20'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[var(--gray-200)] bg-[var(--white)] text-[var(--text-main)] font-medium text-sm hover:bg-[var(--secondary-light-lavender)]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}