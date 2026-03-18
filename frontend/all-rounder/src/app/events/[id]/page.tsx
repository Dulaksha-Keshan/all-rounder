'use client';
import GoBackButton from '@/components/GoBackButton';
import { gsap } from 'gsap';
import { Award, BookOpen, Calendar, ChevronDown, Clock, ExternalLink, MapPin, Minus, Plus, Share2, Trophy, Users } from 'lucide-react';
import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useEventStore } from '@/context/useEventStore';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const event = useEventStore((state) => {
    const fromList = state.events.find((item) => item._id === eventId);
    if (fromList) return fromList;
    if (state.activeEvent?._id === eventId) return state.activeEvent;
    return undefined;
  });
  const fetchEventById = useEventStore((state) => state.fetchEventById);
  const isLoading = useEventStore((state) => state.isLoading);
  const error = useEventStore((state) => state.error);

  const [expandedSections, setExpandedSections] = useState({
    eligibility: true,
    hosts: true,
    why: false,
    registration: true
  });

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!eventId) return;
    if (!event) {
      void fetchEventById(eventId);
    }
  }, [eventId, event, fetchEventById]);

  useEffect(() => {
    if (event && titleRef.current && descRef.current) {
      // Animate title
      gsap.fromTo(titleRef.current,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        }
      );

      // Animate description
      gsap.fromTo(descRef.current,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2
        }
      );
    }
  }, [event]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  if (isLoading && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#34365C] mb-2">Loading event...</h1>
          <p className="text-gray-600">Please wait while we fetch the details.</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg px-6">
          <h1 className="text-4xl font-bold text-[#34365C] mb-4">Event Not Found</h1>
          {error && <p className="text-gray-600 mb-6">{error}</p>}
          <GoBackButton
            variant="solid"
            className="px-6 py-3"
          />
        </div>
      </div>
    );
  }

  const heroImage = event.attachments?.[0] || '/images/hero-1.jpg';
  const hasRegistrationUrl = Boolean(event.registrationUrl);
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const primaryHost = event.hosts?.find((host) => host.isPrimary);
  const otherHosts = event.hosts?.filter((host) => !host.isPrimary) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full Screen Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <NextImage
            src={heroImage}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#34365C]/95"></div>
        </div>

        <GoBackButton
          className="absolute top-6 left-6 z-20"
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            <span
              className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm rounded-full font-medium border border-white/30"
            >
              {event.category}
            </span>
            <span
              className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm rounded-full font-medium border border-white/30"
            >
              {event.eventType}
            </span>
          </div>

          <h1
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-5xl leading-tight"
            style={{ opacity: 0 }}
          >
            {event.title}
          </h1>

          <p
            ref={descRef}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl"
            style={{ opacity: 0 }}
          >
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
                <h2 className="text-4xl font-extrabold text-[#34365C] tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>About This Event</h2>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-10 shadow-md border-2 border-[#DCD0FF]">
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
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
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="font-semibold text-[#34365C]">{startDate.toLocaleDateString()}</p>
                  </div>
                </div>

                {event.endDate && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#8387CC] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">End Date</p>
                      <p className="font-semibold text-[#34365C]">{endDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#8387CC] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Time</p>
                    <p className="font-semibold text-[#34365C]">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

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
                {hasRegistrationUrl ? (
                  <a
                    href={event.registrationUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-6 py-3 bg-[#4169E1] text-white rounded-lg hover:bg-[#8387CC] transition-colors font-semibold text-base shadow-lg flex items-center justify-center gap-2"
                  >
                    Register Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold text-base cursor-not-allowed"
                  >
                    Registration Link Not Available
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
              {/* Eligibility */}
              {event.eligibility && (
                <div className="bg-purple-50 rounded-xl border-2 border-[#DCD0FF] overflow-hidden transition-all hover:shadow-lg hover:border-[#8387CC]">
                  <button
                    onClick={() => toggleSection('eligibility')}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#8387CC] flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#34365C]">Eligibility</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#8387CC] flex items-center justify-center">
                      {expandedSections.eligibility ?
                        <Minus className="w-5 h-5 text-white" /> :
                        <Plus className="w-5 h-5 text-white" />
                      }
                    </div>
                  </button>

                  {expandedSections.eligibility && (
                    <div className="px-6 pb-6 pt-2 bg-white">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.eligibility}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Hosts */}
              {event.hosts && event.hosts.length > 0 && (
                <div className="bg-purple-50 rounded-xl border-2 border-[#DCD0FF] overflow-hidden transition-all hover:shadow-lg hover:border-[#8387CC]">
                  <button
                    onClick={() => toggleSection('hosts')}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#8387CC] flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#34365C]">Hosts</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#8387CC] flex items-center justify-center">
                      {expandedSections.hosts ?
                        <Minus className="w-5 h-5 text-white" /> :
                        <Plus className="w-5 h-5 text-white" />
                      }
                    </div>
                  </button>

                  {expandedSections.hosts && (
                    <div className="px-6 pb-6 pt-2 bg-white">
                      <div className="space-y-3">
                        {primaryHost && (
                          <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                            <p className="text-xs font-semibold uppercase text-green-700 mb-1">Primary Host</p>
                            <p className="text-gray-800 font-medium">{primaryHost.hostName}</p>
                            <p className="text-xs text-gray-600 capitalize">{primaryHost.hostType}</p>
                          </div>
                        )}

                        {otherHosts.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase text-gray-600">Co-hosts</p>
                            {otherHosts.map((host) => (
                              <div key={host.id || `${host.hostType}-${host.hostId}`} className="p-3 rounded-lg border border-[#DCD0FF] bg-[#F8F5FF]">
                                <p className="text-gray-800 font-medium">{host.hostName}</p>
                                <p className="text-xs text-gray-600 capitalize">{host.hostType}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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

              {/* Registration */}
              <div className="bg-purple-50 rounded-xl border-2 border-[#DCD0FF] overflow-hidden transition-all hover:shadow-lg hover:border-[#8387CC]">
                <button
                  onClick={() => toggleSection('registration')}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#8387CC] flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#34365C]">Registration</h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#8387CC] flex items-center justify-center">
                    {expandedSections.registration ?
                      <Minus className="w-5 h-5 text-white" /> :
                      <Plus className="w-5 h-5 text-white" />
                    }
                  </div>
                </button>

                {expandedSections.registration && (
                  <div className="px-6 pb-6 pt-2 bg-white">
                    {hasRegistrationUrl ? (
                      <a
                        href={event.registrationUrl!}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#8387CC] text-[#8387CC] rounded-lg hover:bg-[#8387CC] hover:text-white transition-colors font-medium"
                      >
                        Open Registration Page
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <p className="text-gray-600">Registration URL has not been provided for this event yet.</p>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
