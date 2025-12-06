// app/events/[id]/page.tsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, ArrowLeft, Users, Trophy, Share2, ChevronDown } from 'lucide-react';
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

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full Screen Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#34365C]/95"></div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/events')}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all rounded-lg border border-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Events</span>
        </button>

        {/* Status Badge */}
        {event.status === "Registered" && (
          <div className="absolute top-6 right-6 z-20 px-5 py-3 bg-green-500 text-white rounded-full text-base font-semibold shadow-lg backdrop-blur-sm">
            ✓ Registered
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          {/* Categories */}
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

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-5xl leading-tight">
            {event.title}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl">
            {event.description}
          </p>


          {/* Scroll Down Indicator */}
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
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-[#34365C] mb-6">About This Event</h2>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {event.fullDescription || event.description}
                </div>
              </div>

              {/* Requirements Section */}
              {event.requirements && event.requirements.length > 0 && (
                <div className="bg-gradient-to-br from-[#DCD0FF]/30 to-[#F8F8FF] rounded-2xl p-8 border-2 border-[#DCD0FF]">
                  <h3 className="text-2xl font-bold text-[#34365C] mb-6">Requirements</h3>
                  <ul className="space-y-3">
                    {event.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-[#8387CC] font-bold text-lg mt-1">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prizes Section */}
              {event.prizes && event.prizes.length > 0 && (
                <div className="bg-gradient-to-br from-[#4169E1]/10 to-[#8387CC]/10 rounded-2xl p-8 border-2 border-[#8387CC]/30">
                  <h3 className="text-2xl font-bold text-[#34365C] mb-6 flex items-center gap-3">
                    <Trophy className="w-7 h-7 text-[#8387CC]" />
                    Prizes & Recognition
                  </h3>
                  <ul className="space-y-3">
                    {event.prizes.map((prize, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-[#4169E1] font-bold text-lg mt-1">🏆</span>
                        <span>{prize}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Event Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#8387CC]/20">
                  <h3 className="text-xl font-semibold text-[#34365C] mb-6">Event Information</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Event Date</p>
                        <p className="font-semibold text-[#34365C]">{event.date}</p>
                      </div>
                    </div>

                    {event.deadline && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Registration Deadline</p>
                          <p className="font-semibold text-[#34365C]">{event.deadline}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center flex-shrink-0">
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
                      <button className="w-full px-6 py-3 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors font-semibold text-base shadow-lg">
                        Register Now
                      </button>
                    )}
                    
                    <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Event
                    </button>
                  </div>
                </div>

                {/* Why Participate */}
                <div className="bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] rounded-2xl p-6 border-2 border-[#8387CC]/20 shadow-lg">
                  <h3 className="text-lg font-semibold text-[#34365C] mb-5">Why Participate?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                        <Trophy className="w-5 h-5 text-[#8387CC]" />
                      </div>
                      <span className="text-sm text-[#34365C] font-medium">Build Your Portfolio</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                        <Users className="w-5 h-5 text-[#8387CC]" />
                      </div>
                      <span className="text-sm text-[#34365C] font-medium">Network with Peers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                        <Trophy className="w-5 h-5 text-[#8387CC]" />
                      </div>
                      <span className="text-sm text-[#34365C] font-medium">Win Recognition</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                {event.contactEmail && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-[#34365C] mb-4">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Have questions about this event? Contact the organizers.
                    </p>
                    <a 
                      href={`mailto:${event.contactEmail}`}
                      className="w-full block text-center px-4 py-3 border-2 border-[#8387CC] text-[#8387CC] rounded-lg hover:bg-[#8387CC] hover:text-white transition-colors font-medium"
                    >
                      Contact Organizers
                    </a>
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