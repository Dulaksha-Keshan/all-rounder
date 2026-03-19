"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Package,
  School,
  MapPin,
  Clock,
  Bell,
  Sparkles,
  TrendingUp,
  Gift,
  Boxes,
  HandHeart,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ResourceSharing() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const requestsRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);

  const resourceRequests = [
    {
      id: 1,
      school: "Lincoln High School",
      location: "New York, NY",
      item: "Sports Equipment",
      description:
        "Basketball hoops, soccer balls, and athletic gear for new sports program",
      quantity: "15 items",
      urgency: "high",
      postedDate: "2 days ago",
      deadline: "Dec 15, 2024",
    },
    {
      id: 2,
      school: "Washington Middle School",
      location: "Boston, MA",
      item: "Art Materials",
      description: "Paints, canvases, brushes for student art club",
      quantity: "Art supplies for 30 students",
      urgency: "medium",
      postedDate: "5 days ago",
      deadline: "Dec 20, 2024",
    },
    {
      id: 3,
      school: "Jefferson Elementary",
      location: "Chicago, IL",
      item: "Library Books",
      description:
        "Age-appropriate books for grades 1-5 to expand school library",
      quantity: "100+ books",
      urgency: "low",
      postedDate: "1 week ago",
      deadline: "Jan 10, 2025",
    },
    {
      id: 4,
      school: "Roosevelt High School",
      location: "Los Angeles, CA",
      item: "Musical Instruments",
      description: "Violins, guitars, and keyboards for music program",
      quantity: "10 instruments",
      urgency: "high",
      postedDate: "3 days ago",
      deadline: "Dec 12, 2024",
    },
  ];

  const myDonations = [
    {
      id: 1,
      item: "Science Lab Equipment",
      recipient: "Madison High School",
      date: "Nov 20, 2024",
      status: "Delivered",
    },
    {
      id: 2,
      item: "Computers (5 units)",
      recipient: "Lincoln Elementary",
      date: "Nov 15, 2024",
      status: "In Transit",
    },
  ];

  const stats = useMemo(() => {
    const highPriority = resourceRequests.filter((r) => r.urgency === "high").length;
    return {
      activeRequests: resourceRequests.length,
      highPriority,
      partnerSchools: new Set(resourceRequests.map((r) => r.school)).size,
      donationHistory: myDonations.length,
    };
  }, [resourceRequests, myDonations]);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const stars = gsap.utils.toArray<HTMLElement>(".rs-star");
      const statCards = gsap.utils.toArray<HTMLElement>(".rs-stat-card");
      const requestCards = gsap.utils.toArray<HTMLElement>(".rs-request-card");
      const donationRows = gsap.utils.toArray<HTMLElement>(".rs-donation-row");

      gsap.fromTo(
        headerRef.current,
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }
      );

      gsap.to(stars, {
        y: "random(-10,10)",
        x: "random(-8,8)",
        duration: "random(2.5,4)",
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      gsap.fromTo(
        statCards,
        { y: 18, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 86%",
          },
        }
      );

      gsap.fromTo(
        requestCards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: requestsRef.current,
            start: "top 86%",
          },
        }
      );

      gsap.fromTo(
        donationRows,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: supportRef.current,
            start: "top 88%",
          },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".rs-tilt");
      const cleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const relX = (event.clientX - rect.left) / rect.width - 0.5;
          const relY = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotateY: relX * 7,
            rotateX: relY * -7,
            y: -3,
            duration: 0.25,
            ease: "power2.out",
            transformPerspective: 900,
            transformOrigin: "center",
          });
        };

        const onLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            y: 0,
            duration: 0.28,
            ease: "power2.out",
          });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-hidden bg-page-bg transition-colors duration-300 px-4 py-10">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8387CC]/25 to-[#4169E1]/25 blur-3xl rounded-full" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-[#DCD0FF]/35 to-[#8387CC]/20 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#34365C] to-[#8387CC] text-white px-4 py-2 rounded-full shadow-lg text-xs sm:text-sm font-semibold tracking-wide">
          Coming Soon - Concept Preview
        </div>

        <div ref={headerRef} className="text-center mb-10 relative">
          <Sparkles className="rs-star absolute top-0 right-1/4 w-7 h-7 text-[#DCD0FF] opacity-70" />
          <Sparkles className="rs-star absolute bottom-2 left-1/4 w-5 h-5 text-[#8387CC] opacity-60" />

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] mb-4 shadow-xl">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#34365C] text-4xl font-bold mb-2">Resource Sharing Hub</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page is a preview of the resource request and contribution experience, currently powered by sample data.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E9E5FF] text-[#505485] text-xs sm:text-sm font-medium">
            <Clock className="w-4 h-4" />
            Live requests, workflows, and notifications are launching soon
          </div>
        </div>

        <div ref={statsRef} className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rs-stat-card rs-tilt bg-white rounded-xl shadow-md p-6 text-center border border-[#ECE9FF]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
              <Boxes className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{stats.activeRequests}</p>
            <p className="text-sm text-gray-600">Sample Requests</p>
          </div>
          <div className="rs-stat-card rs-tilt bg-white rounded-xl shadow-md p-6 text-center border border-[#ECE9FF]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{stats.highPriority}</p>
            <p className="text-sm text-gray-600">High Priority</p>
          </div>
          <div className="rs-stat-card rs-tilt bg-white rounded-xl shadow-md p-6 text-center border border-[#ECE9FF]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
              <School className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{stats.partnerSchools}</p>
            <p className="text-sm text-gray-600">Partner Schools</p>
          </div>
          <div className="rs-stat-card rs-tilt bg-white rounded-xl shadow-md p-6 text-center border border-[#ECE9FF]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{stats.donationHistory}</p>
            <p className="text-sm text-gray-600">Donation Entries</p>
          </div>
        </div>

        <div ref={requestsRef} className="bg-white rounded-2xl shadow-lg border border-[#ECE9FF] overflow-hidden mb-8">
          <div className="p-5 bg-gradient-to-r from-[#F0EDFF] to-[#FAF9FF] border-b border-[#ECE9FF]">
            <h2 className="text-[#34365C] text-xl font-semibold">Preview Requests</h2>
            <p className="text-sm text-[#5C618F] mt-1">These are sample cards to illustrate final layout and request information architecture.</p>
          </div>

          <div className="p-5 grid lg:grid-cols-2 gap-4" style={{ perspective: "1000px" }}>
            {resourceRequests.map((request) => (
              <article key={request.id} className="rs-request-card rs-tilt rounded-xl border border-[#ECE9FF] bg-gradient-to-br from-white via-[#F8F8FF] to-[#EEF0FF] p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-[#34365C] font-semibold text-lg">{request.item}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8EAFE] text-[#4D5190] uppercase tracking-wide">
                    {request.urgency}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{request.description}</p>
                <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2"><School className="w-4 h-4" /> {request.school}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {request.location}</p>
                  <p className="flex items-center gap-2"><Package className="w-4 h-4" /> {request.quantity}</p>
                </div>
                <div className="pt-3 border-t border-[#ECE9FF] flex items-center justify-between text-xs text-gray-500">
                  <span>Posted {request.postedDate}</span>
                  <span>Deadline {request.deadline}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div ref={supportRef} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-[#ECE9FF] p-6">
            <h3 className="text-[#34365C] text-xl font-semibold mb-4">Sample Donation Timeline</h3>
            <div className="space-y-3">
              {myDonations.map((donation) => (
                <div key={donation.id} className="rs-donation-row rounded-xl border border-[#ECE9FF] p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[#34365C] font-medium">{donation.item}</p>
                    <p className="text-sm text-gray-600">To: {donation.recipient}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{donation.date}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#EEF0FF] text-[#4D5190]">
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-2xl shadow-xl p-6 text-white">
            <Bell className="w-10 h-10 mb-4 opacity-90" />
            <h4 className="text-xl font-semibold mb-2">Smart Notifications</h4>
            <p className="text-sm text-[#E4E7FF] mb-5">
              Matching alerts, request deadlines, and delivery updates will be available when Resource Sharing goes live.
            </p>
            <button
              type="button"
              className="w-full py-3 rounded-lg bg-white/90 text-[#34365C] font-medium cursor-not-allowed"
              aria-disabled="true"
              disabled
            >
              Alerts Coming Soon
            </button>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-[#34365C] to-[#505485] rounded-2xl shadow-lg p-6 text-white text-center">
          <HandHeart className="w-11 h-11 mx-auto mb-3 opacity-90" />
          <h3 className="text-2xl font-semibold mb-2">Resource Sharing Is On The Way</h3>
          <p className="text-[#DCDFFF] mb-4">
            We are finalizing request moderation, contribution workflows, and verification layers. This concept page shows the direction and planned UX.
          </p>
          <button
            type="button"
            className="px-6 py-3 bg-white/90 text-[#34365C] rounded-lg font-medium cursor-not-allowed"
            aria-disabled="true"
            disabled
          >
            Early Access Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
