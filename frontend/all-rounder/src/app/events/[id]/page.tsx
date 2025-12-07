'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, ArrowLeft, Users, Trophy, Share2, ChevronDown, Mail, Plus, Minus, BookOpen, Award, ClipboardList, HelpCircle } from 'lucide-react';
import { Events } from '../_data/events';


export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);
  
  const event = Events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#34365C] mb-4">Event Not Found</h1>
          <button 
            onClick={() => router.push('/events')}
            className="px-6 py-3 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const [expandedSections, setExpandedSections] = useState({
    requirements: false,
    prizes: false,
    why: false,
    contact: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full Screen Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#34365C]/95"></div>
        </div>

        <button
          onClick={() => router.push('/events')}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all rounded-lg border border-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Events</span>
        </button>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {event.categories?.slice(0, 4).map((cat, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm rounded-full font-medium border border-white/30"
              >
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-5xl leading-tight">
            {event.title}
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl">
            {event.description}
          </p>

          <button 
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium">Scroll for details</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* About This Event Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#8387CC] flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl font-extrabold text-[#34365C] tracking-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>About This Event</h2>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-10 shadow-md border-2 border-[#DCD0FF]">
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {event.fullDescription || event.description}
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Event Information Card - Narrow */}
            <div className="lg:col-span-1 bg-purple-50 rounded-2xl p-6 shadow-md border-2 border-[#DCD0FF] h-fit">
              <div className="bg-[#8387CC] rounded-xl p-2 mb-6">
                <h3 className="text-lg font-semibold text-white text-center">Event Information</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#8387CC] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Event Date</p>
                    <p className="font-semibold text-[#34365C]">{event.date}</p>
                  </div>
                </div>

                {event.deadline && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#8387CC] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Registration Deadline</p>
                      <p className="font-semibold text-[#34365C]">{event.deadline}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#8387CC] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-[#34365C]">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                {event.status === "Registered" ? (
                  <button 
                    disabled
                    className="w-full px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold text-base cursor-not-allowed"
                  >
                    ✓ Already Registered
                  </button>
                ) : (
                  <button className="w-full px-6 py-3 bg-[#4169E1] text-white rounded-lg hover:bg-[#8387CC] transition-colors font-semibold text-base shadow-lg">
                    Register Now
                  </button>
                )}
                
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Event
                </button>
              </div>
            </div>

            {/* Right Column - 3 sections stacked */}
            <div className="lg:col-span-3 space-y-6">
              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div className="bg-purple-50 rounded-xl border-2 border-[#DCD0FF] overflow-hidden transition-all hover:shadow-lg hover:border-[#8387CC]">
                  <button
                    onClick={() => toggleSection('requirements')}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#8387CC] flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#34365C]">Requirements</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#8387CC] flex items-center justify-center">
                      {expandedSections.requirements ? 
                        <Minus className="w-5 h-5 text-white" /> : 
                        <Plus className="w-5 h-5 text-white" />
                      }
                    </div>
                  </button>
                  
                  {expandedSections.requirements && (
                    <div className="px-6 pb-6 pt-2 bg-white">
                      <ul className="space-y-3">
                        {event.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-700">
                            <Award className="w-5 h-5 text-[#8387CC] mt-1 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Prizes */}
              {event.prizes && event.prizes.length > 0 && (
                <div className="bg-purple-50 rounded-xl border-2 border-[#DCD0FF] overflow-hidden transition-all hover:shadow-lg hover:border-[#8387CC]">
                  <button
                    onClick={() => toggleSection('prizes')}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#8387CC] flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#34365C]">Prizes & Recognition</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#8387CC] flex items-center justify-center">
                      {expandedSections.prizes ? 
                        <Minus className="w-5 h-5 text-white" /> : 
                        <Plus className="w-5 h-5 text-white" />
                      }
                    </div>
                  </button>
                  
                  {expandedSections.prizes && (
                    <div className="px-6 pb-6 pt-2 bg-white">
                      <ul className="space-y-3">
                        {event.prizes.map((prize, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-700">
                            <Trophy className="w-5 h-5 text-[#4169E1] mt-1 flex-shrink-0" />
                            <span>{prize}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Why Participate */}
              <div className="bg-purple-50 rounded-xl border-2 border-[#DCD0FF] overflow-hidden transition-all hover:shadow-lg hover:border-[#8387CC]">
                <button
                  onClick={() => toggleSection('why')}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#8387CC] flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#34365C]">Why Participate?</h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#8387CC] flex items-center justify-center">
                    {expandedSections.why ? 
                      <Minus className="w-5 h-5 text-white" /> : 
                      <Plus className="w-5 h-5 text-white" />
                    }
                  </div>
                </button>
                
                {expandedSections.why && (
                  <div className="px-6 pb-6 pt-2 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#DCD0FF] flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-[#8387CC]" />
                        </div>
                        <span className="text-gray-700 font-medium">Build Your Portfolio</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#DCD0FF] flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#8387CC]" />
                        </div>
                        <span className="text-gray-700 font-medium">Network with Peers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#DCD0FF] flex items-center justify-center">
                          <Award className="w-5 h-5 text-[#8387CC]" />
                        </div>
                        <span className="text-gray-700 font-medium">Win Recognition</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Need Help */}
              {event.contactEmail && (
                <div className="bg-purple-50 rounded-xl border-2 border-[#DCD0FF] overflow-hidden transition-all hover:shadow-lg hover:border-[#8387CC]">
                  <button
                    onClick={() => toggleSection('contact')}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#8387CC] flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#34365C]">Need Help?</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#8387CC] flex items-center justify-center">
                      {expandedSections.contact ? 
                        <Minus className="w-5 h-5 text-white" /> : 
                        <Plus className="w-5 h-5 text-white" />
                      }
                    </div>
                  </button>
                  
                  {expandedSections.contact && (
                    <div className="px-6 pb-6 pt-2 bg-white">
                      <p className="text-gray-600 mb-4">
                        Have questions about this event? Contact the organizers.
                      </p>
                      <a 
                        href={`mailto:${event.contactEmail}`}
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#8387CC] text-[#8387CC] rounded-lg hover:bg-[#8387CC] hover:text-white transition-colors font-medium"
                      >
                        <Mail className="w-4 h-4" />
                        Contact Organizers
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}