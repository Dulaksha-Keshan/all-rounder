'use client';
import { useState } from 'react';
import { Event } from '../_types/event';
import { EventList } from './EventList';

export default function EventsClient({ events }: { events: Event[] }) {
  const [activeTab, setActiveTab] = useState<'all' | 'registered' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const filteredEvents = events.filter(event => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'registered' && event.status === 'Registered') ||
      (activeTab === 'completed' && false);
    
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const eventCategories = event.categories || [];
    const matchesCategory = selectedCategory === 'All Categories' || 
      eventCategories.includes(selectedCategory);
    
    return matchesTab && matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(new Set(events.flatMap(e => e.categories || [])));
//   bg-gradient-to-br from-[#F8F8FF] via-[#DCD0FF] to-[#d5baed]
  return (
    <div className="min-h-screen bg-[#f4f0ff]">
      {/* Header Section */}
      <div className="relative bg-[#34365C] text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-6xl text-[#DCD0FF] opacity-30">✦</div>
        <div className="absolute top-20 right-20 text-5xl text-[#8387CC] opacity-30">★</div>
        <div className="absolute bottom-10 left-1/4 text-4xl text-[#DCD0FF] opacity-30">✦</div>
        <div className="absolute bottom-20 right-1/4 text-5xl text-[#8387CC] opacity-30">★</div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[#DCD0FF] mb-6 text-sm">
            <span>Home</span>
            <span>›</span>
            <span className="text-white">Competitions & Events</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-4">
            Competitions & <span className="text-[#4169E1]">Events Hub</span>
          </h1>
          <p className="text-xl text-[#DCD0FF] max-w-2xl">
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
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'all' 
                ? 'bg-[#4169E1] text-white shadow-lg scale-105' 
                : 'bg-white text-[#34365C] hover:bg-[#DCD0FF] shadow-md'
            }`}
          >
            All Competitions
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'registered' 
                ? 'bg-[#4169E1] text-white shadow-lg scale-105' 
                : 'bg-white text-[#34365C] hover:bg-[#DCD0FF] shadow-md'
            }`}
          >
            My Registrations
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'completed' 
                ? 'bg-[#4169E1] text-white shadow-lg scale-105' 
                : 'bg-white text-[#34365C] hover:bg-[#DCD0FF] shadow-md'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#8387CC] sticky top-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">🔍</span>
                <h3 className="text-xl font-bold text-[#34365C]">Filters</h3>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-bold text-[#34365C] mb-2">Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#8387CC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCD0FF] bg-[#F8F8FF] text-sm font-medium text-[#34365C]"
                >
                  <option>All Categories</option>
                  {allCategories.map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={() => {
                  setSelectedCategory('All Categories');
                }}
                className="w-full px-4 py-2 bg-[#4169E1] text-white rounded-lg hover:bg-[#34365C] transition-colors font-semibold text-sm shadow-md"
              >
                Reset Filters
              </button>

              {/* Stats Box */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <h4 className="text-sm font-bold text-[#34365C] mb-4 uppercase tracking-wide">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-[#DCD0FF] to-[#CEB0E8] rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#34365C]">{events.length}</div>
                    <div className="text-xs text-[#34365C] font-medium">Total Events</div>
                  </div>
                  <div className="bg-gradient-to-r from-[#8387CC] to-[#4169E1] rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{events.filter(e => e.status === 'Registered').length}</div>
                    <div className="text-xs text-white font-medium">Registered</div>
                  </div>
                  <div className="bg-gradient-to-r from-[#4169E1] to-[#34365C] rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{events.filter(e => e.status === 'Open').length}</div>
                    <div className="text-xs text-white font-medium">Open Now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search competitions by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-[#8387CC] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#DCD0FF] text-base bg-white shadow-lg"
                />
              </div>
            </div>

            <EventList events={filteredEvents} />
          </div>
        </div>
      </main>
    </div>
  );
}