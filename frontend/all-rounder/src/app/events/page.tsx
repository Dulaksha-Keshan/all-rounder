'use client';
import { useState } from 'react';
import { Events } from "./_data/events";
import { EventList} from './_components/EventList';


export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'registered' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = Events.filter(event => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'registered' && event.status === 'Registered') ||
      (activeTab === 'completed' && false);
    
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-[#34365C] mb-2">Competitions & Events Hub</h1>
        <p className="text-gray-600 mb-8">
          Discover and register for extracurricular competitions
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all' 
                ? 'bg-[#8387CC] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Competitions
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'registered' 
                ? 'bg-[#8387CC] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            My Registrations
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'completed' 
                ? 'bg-[#8387CC] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <h3 className="text-lg font-semibold text-[#34365C] mb-4">🔍 Filters</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]">
                  <option>All Categories</option>
                  <option>Quiz</option>
                  <option>Arts</option>
                  <option>Science</option>
                  <option>Tech</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]">
                  <option>All Difficulties</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <button className="w-full px-4 py-2 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors font-medium">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Search competitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
              />
            </div>

            <EventList events={filteredEvents} />
          </div>
        </div>
      </main>
    </div>
  );
}