// "use client";

// import { useState, useEffect } from "react";
// import {
//   Package,
//   Search,
//   Plus,
//   School,
//   MapPin,
//   Clock,
//   CheckCircle,
//   Bell,
//   Sparkles,
//   TrendingUp,
//   Gift,
// } from "lucide-react";

// export default function ResourceSharing() {
//   const [activeTab, setActiveTab] = useState<
//     "requests" | "myRequests" | "donations"
//   >("requests");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     // Check if dark mode is enabled
//     const checkDarkMode = () => {
//       const isDark = document.documentElement.classList.contains("dark");
//       setIsDarkMode(isDark);
//     };

//     checkDarkMode();

//     // Observe class changes on html element
//     const observer = new MutationObserver(checkDarkMode);
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   const resourceRequests = [
//     {
//       id: 1,
//       school: "Lincoln High School",
//       location: "New York, NY",
//       item: "Sports Equipment",
//       description:
//         "Basketball hoops, soccer balls, and athletic gear for new sports program",
//       quantity: "15 items",
//       urgency: "high",
//       postedDate: "2 days ago",
//       deadline: "Dec 15, 2024",
//       fulfilled: false,
//     },
//     {
//       id: 2,
//       school: "Washington Middle School",
//       location: "Boston, MA",
//       item: "Art Materials",
//       description: "Paints, canvases, brushes for student art club",
//       quantity: "Art supplies for 30 students",
//       urgency: "medium",
//       postedDate: "5 days ago",
//       deadline: "Dec 20, 2024",
//       fulfilled: false,
//     },
//     {
//       id: 3,
//       school: "Jefferson Elementary",
//       location: "Chicago, IL",
//       item: "Library Books",
//       description:
//         "Age-appropriate books for grades 1-5 to expand school library",
//       quantity: "100+ books",
//       urgency: "low",
//       postedDate: "1 week ago",
//       deadline: "Jan 10, 2025",
//       fulfilled: false,
//     },
//     {
//       id: 4,
//       school: "Roosevelt High School",
//       location: "Los Angeles, CA",
//       item: "Musical Instruments",
//       description:
//         "Violins, guitars, and keyboards for music program",
//       quantity: "10 instruments",
//       urgency: "high",
//       postedDate: "3 days ago",
//       deadline: "Dec 12, 2024",
//       fulfilled: false,
//     },
//   ];

//   const myDonations = [
//     {
//       id: 1,
//       item: "Science Lab Equipment",
//       recipient: "Madison High School",
//       date: "Nov 20, 2024",
//       status: "Delivered",
//     },
//     {
//       id: 2,
//       item: "Computers (5 units)",
//       recipient: "Lincoln Elementary",
//       date: "Nov 15, 2024",
//       status: "In Transit",
//     },
//   ];

//   const getUrgencyColor = (urgency: string) => {
//     switch (urgency) {
//       case "high":
//         return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
//       case "medium":
//         return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
//       case "low":
//         return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
//       default:
//         return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-page-bg transition-colors duration-300">
//       {/* Decorative Background */}
//       <div className={`absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8387CC]/30 to-[#4169E1]/30 ${isDarkMode ? 'dark:opacity-20' : ''} blur-3xl rounded-full transition-opacity duration-300`} />
//       <div className={`absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-[#DCD0FF]/40 to-[#8387CC]/30 ${isDarkMode ? 'dark:opacity-20' : ''} blur-3xl rounded-full transition-opacity duration-300`} />

//       <div className="relative max-w-7xl mx-auto px-4 py-12">
//         {/* Header */}
//         <div className="mb-10">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8387CC]/20 to-[#4169E1]/20 dark:from-[#8387CC]/10 dark:to-[#4169E1]/10 text-[#4169E1] dark:text-[#8387CC] mb-4 transition-colors duration-300">
//             <Sparkles className="w-4 h-4" />
//             Community Resource Sharing
//           </div>
//           <h1 className="text-4xl font-bold text-main mb-2 transition-colors duration-300">
//             Resource Sharing Hub
//           </h1>
//           <p className="text-muted max-w-2xl transition-colors duration-300">
//             Connect schools with donors to fulfill resource needs with transparent, impact-driven sharing
//           </p>
//         </div>

//         {/* Tabs with gradient */}
//         <div className="flex gap-3 mb-10 flex-wrap">
//           <button
//             onClick={() => setActiveTab("requests")}
//             className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
//               activeTab === "requests"
//                 ? "bg-gradient-to-r from-[#8387CC] to-[#4169E1] dark:from-[#505485] dark:to-[#34365C] text-white shadow-lg"
//                 : "bg-card dark:bg-card text-main hover:bg-[#F8F8FF] dark:hover:bg-gray-100/10"
//             }`}
//           >
//             Resource Requests
//           </button>
//           <button
//             onClick={() => setActiveTab("myRequests")}
//             className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
//               activeTab === "myRequests"
//                 ? "bg-gradient-to-r from-[#8387CC] to-[#4169E1] dark:from-[#505485] dark:to-[#34365C] text-white shadow-lg"
//                 : "bg-card dark:bg-card text-main hover:bg-[#F8F8FF] dark:hover:bg-gray-100/10"
//             }`}
//           >
//             My Requests
//           </button>
//           <button
//             onClick={() => setActiveTab("donations")}
//             className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
//               activeTab === "donations"
//                 ? "bg-gradient-to-r from-[#8387CC] to-[#4169E1] dark:from-[#505485] dark:to-[#34365C] text-white shadow-lg"
//                 : "bg-card dark:bg-card text-main hover:bg-[#F8F8FF] dark:hover:bg-gray-100/10"
//             }`}
//           >
//             My Donations
//           </button>

//           <button className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#2f4fd4] dark:from-[#505485] dark:to-[#34365C] text-white shadow-lg hover:scale-[1.02] transition-transform duration-300 flex items-center gap-2">
//             <Plus className="w-5 h-5" />
//             New Request
//           </button>
//         </div>

//         {/* Search & Filters */}
//         <div className="bg-card dark:bg-card rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300">
//           <div className="flex gap-4 flex-wrap">
//             <div className="flex-1 min-w-[250px]">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-colors duration-300" />
//                 <input
//                   type="text"
//                   placeholder="Search resource requests..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-page-bg dark:bg-gray-100/5 focus:outline-none focus:ring-2 focus:ring-[#8387CC] dark:focus:ring-[#505485] text-main transition-colors duration-300"
//                 />
//               </div>
//             </div>
//             <select className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-page-bg dark:bg-gray-100/5 focus:outline-none focus:ring-2 focus:ring-[#8387CC] dark:focus:ring-[#505485] text-main transition-colors duration-300">
//               <option>All Categories</option>
//               <option>Sports Equipment</option>
//               <option>Art Materials</option>
//               <option>Books</option>
//               <option>Technology</option>
//               <option>Musical Instruments</option>
//             </select>
//             <select className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-page-bg dark:bg-gray-100/5 focus:outline-none focus:ring-2 focus:ring-[#8387CC] dark:focus:ring-[#505485] text-main transition-colors duration-300">
//               <option>All Urgency Levels</option>
//               <option>High Priority</option>
//               <option>Medium Priority</option>
//               <option>Low Priority</option>
//             </select>
//           </div>
//         </div>

//         {/* Resource Requests Tab */}
//         {activeTab === "requests" && (
//           <div className="grid lg:grid-cols-2 gap-6">
//             {resourceRequests.map((request) => (
//               <div key={request.id} className="group relative bg-gradient-to-br from-white via-[#F8F8FF] to-[#EEF0FF] dark:from-card dark:via-gray-100/5 dark:to-gray-100/10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
//                 {/* Glow effect on hover */}
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#8387CC]/10 to-[#4169E1]/10 dark:from-[#8387CC]/5 dark:to-[#4169E1]/5" />
                
//                 <div className="relative p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-start gap-3">
//                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DCD0FF] to-[#8387CC] dark:from-[#505485] dark:to-[#34365C] flex items-center justify-center flex-shrink-0 shadow-md">
//                         <Package className="w-6 h-6 text-white transition-colors duration-300" />
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-semibold text-main mb-1 transition-colors duration-300">{request.item}</h3>
//                         <div className="flex items-center gap-2 text-sm text-muted transition-colors duration-300">
//                           <School className="w-4 h-4" />
//                           {request.school}
//                         </div>
//                       </div>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getUrgencyColor(request.urgency)} transition-colors duration-300`}>
//                       {request.urgency} Priority
//                     </span>
//                   </div>

//                   <p className="text-sm text-muted mb-4 transition-colors duration-300">{request.description}</p>

//                   <div className="flex items-center gap-4 text-sm mb-4">
//                     <div className="flex items-center gap-1 text-muted transition-colors duration-300">
//                       <MapPin className="w-4 h-4" />
//                       {request.location}
//                     </div>
//                     <div className="flex items-center gap-1 text-muted transition-colors duration-300">
//                       <Package className="w-4 h-4" />
//                       {request.quantity}
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <div className="flex items-center gap-1 text-xs text-muted transition-colors duration-300">
//                       <Clock className="w-4 h-4" />
//                       Deadline: {request.deadline}
//                     </div>
//                     <div className="flex gap-2">
//                       <button className="px-4 py-2 bg-[#F8F8FF] dark:bg-gray-100/10 text-main rounded-lg hover:bg-[#DCD0FF] dark:hover:bg-[#505485]/30 transition-all duration-300 text-sm">
//                         Details
//                       </button>
//                       <button className="px-4 py-2 bg-gradient-to-r from-[#4169E1] to-[#2f4fd4] dark:from-[#505485] dark:to-[#34365C] text-white rounded-lg hover:scale-[1.05] transition-all duration-300 text-sm">
//                         Contribute
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* My Requests Tab */}
//         {activeTab === "myRequests" && (
//           <div className="bg-card dark:bg-card rounded-2xl shadow-lg p-8 transition-colors duration-300">
//             <div className="text-center py-12">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#DCD0FF] to-[#8387CC] dark:from-[#505485] dark:to-[#34365C] flex items-center justify-center mx-auto mb-4 shadow-lg">
//                 <Gift className="w-10 h-10 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-main mb-2 transition-colors duration-300">No Active Requests</h3>
//               <p className="text-muted mb-6 transition-colors duration-300">You haven't created any resource requests yet</p>
//               <button className="px-6 py-3 bg-gradient-to-r from-[#4169E1] to-[#2f4fd4] dark:from-[#505485] dark:to-[#34365C] text-white rounded-lg hover:scale-[1.05] transition-transform duration-300 flex items-center gap-2 mx-auto">
//                 <Plus className="w-5 h-5" />
//                 Create Your First Request
//               </button>
//             </div>
//           </div>
//         )}

//         {/* My Donations Tab */}
//         {activeTab === "donations" && (
//           <div className="space-y-4">
//             {myDonations.map((donation) => (
//               <div key={donation.id} className="group bg-gradient-to-br from-white via-[#F8F8FF] to-[#EEF0FF] dark:from-card dark:via-gray-100/5 dark:to-gray-100/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
//                       donation.status === "Delivered" 
//                         ? "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" 
//                         : "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
//                     }`}>
//                       <CheckCircle className={`w-6 h-6 ${
//                         donation.status === "Delivered" 
//                           ? "text-green-600 dark:text-green-400" 
//                           : "text-blue-600 dark:text-blue-400"
//                       }`} />
//                     </div>
//                     <div>
//                       <h4 className="text-main font-medium transition-colors duration-300">{donation.item}</h4>
//                       <p className="text-sm text-muted transition-colors duration-300">To: {donation.recipient}</p>
//                       <p className="text-xs text-muted mt-1 transition-colors duration-300">{donation.date}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       donation.status === "Delivered" 
//                         ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
//                         : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
//                     } transition-colors duration-300`}>
//                       {donation.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Notification Banner with gradient */}
//         <div className="mt-8 bg-gradient-to-r from-[#8387CC] to-[#4169E1] dark:from-[#505485] dark:to-[#34365C] rounded-2xl shadow-xl p-8 transition-all duration-300">
//           <div className="flex items-start gap-4">
//             <div className="w-12 h-12 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center flex-shrink-0">
//               <Bell className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h4 className="mb-2 text-white font-semibold">Enable Notifications</h4>
//               <p className="text-sm text-[#DCD0FF] dark:text-[#8387CC]/90 mb-6 transition-colors duration-300">
//                 Get automatic notifications when new resource requests match your interests
//               </p>
//               <button className="px-6 py-3 bg-white dark:bg-gray-100 text-[#34365C] dark:text-[#34365C] rounded-lg hover:bg-[#DCD0FF] dark:hover:bg-[#8387CC]/20 transition-all duration-300 text-sm font-medium shadow-md">
//                 Enable Notifications
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Banner */}
//         <div className="mt-8 bg-gradient-to-br from-[#F8F8FF] to-[#EEF0FF] dark:from-gray-100/5 dark:to-gray-100/10 rounded-2xl shadow-lg p-6 transition-colors duration-300">
//           <div className="flex items-center gap-3">
//             <TrendingUp className="w-6 h-6 text-[#4169E1] dark:text-[#8387CC] transition-colors duration-300" />
//             <div>
//               <h4 className="text-main font-medium transition-colors duration-300">Recent Impact</h4>
//               <p className="text-sm text-muted transition-colors duration-300">
//                 127 resources shared this month • 45 schools supported
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Search, Plus, School, MapPin, Clock, Bell, Filter } from "lucide-react";
import {
  RESOURCE_REQUESTS,
  RESOURCE_CATEGORIES,
  type ResourceRequest,
  type UrgencyLevel,
} from "./resourceData";

export default function ResourceSharing() {
  const [activeTab, setActiveTab] = useState<
    "requests" | "myRequests" | "donations"
  >("requests");
  const [searchQuery, setSearchQuery] = useState("");

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
      fulfilled: false,
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
      fulfilled: false,
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
      fulfilled: false,
    },
    {
      id: 4,
      school: "Roosevelt High School",
      location: "Los Angeles, CA",
      item: "Musical Instruments",
      description:
        "Violins, guitars, and keyboards for music program",
      quantity: "10 instruments",
      urgency: "high",
      postedDate: "3 days ago",
      deadline: "Dec 12, 2024",
      fulfilled: false,
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[urgency]}`}
    >
      {urgency} Priority
    </span>
  );
}

// ─── Resource Card ────────────────────────────────────────────────────────────
function ResourceCard({ request }: { request: ResourceRequest }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-[#DCD0FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-[#8387CC]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#34365C] text-base mb-1">{request.item}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <School className="w-3.5 h-3.5" />
              <span>{request.school}</span>
            </div>
          </div>
        </div>
        <UrgencyBadge urgency={request.urgency} />
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
        {request.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{request.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          <span>{request.quantity}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Deadline: {request.deadline}</span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/resources/request/${request.id}`}
            className="px-4 py-1.5 bg-[#F8F8FF] text-[#34365C] rounded-lg hover:bg-[#DCD0FF] transition-colors text-sm font-medium"
          >
            Details
          </Link>
          <Link
            href={`/resources/contribute/${request.id}`}
            className="px-4 py-1.5 bg-[#4169E1] text-white rounded-lg hover:bg-[#3557c1] transition-colors text-sm font-medium"
          >
            Contribute
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResourceSharingPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "myRequests">("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const filteredRequests = RESOURCE_REQUESTS.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.item.toLowerCase().includes(q) ||
      r.school.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
    const matchesUrgency = urgencyFilter === "all" || r.urgency === urgencyFilter;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-page-bg transition-colors duration-300">
      {/* Decorative Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8387CC]/30 to-[#4169E1]/30 blur-3xl rounded-full transition-opacity duration-300" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-[#DCD0FF]/40 to-[#8387CC]/30 blur-3xl rounded-full transition-opacity duration-300" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8387CC]/20 to-[#4169E1]/20 text-[#4169E1] mb-4 transition-colors duration-300">
            <Sparkles className="w-4 h-4" />
            Community Resource Sharing
          </div>
          <h1 className="text-4xl font-bold text-main mb-2 transition-colors duration-300">
            Resource Sharing Hub
          </h1>
          <p className="text-gray-400 text-base max-w-xl leading-relaxed">
            Connect schools with donors to fulfill resource needs. Browse active requests,
            contribute supplies, and make a lasting impact in education.
          </p>
        </div>
      </section>

        {/* Tabs with gradient */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "requests"
              ? "bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white shadow-lg"
              : "bg-card text-main hover:bg-[#F8F8FF]"
              }`}
          >
            Resource Requests
          </button>
          <button
            onClick={() => setActiveTab("myRequests")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "myRequests"
              ? "bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white shadow-lg"
              : "bg-card text-main hover:bg-[#F8F8FF]"
              }`}
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "donations"
              ? "bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white shadow-lg"
              : "bg-card text-main hover:bg-[#F8F8FF]"
              }`}
          >
            My Donations
          </button>

          <button className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#2f4fd4] text-white shadow-lg hover:scale-[1.02] transition-transform duration-300 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search resource requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-page-bg focus:outline-none focus:ring-2 focus:ring-[#8387CC] text-main transition-colors duration-300"
                />
              </div>
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-xl bg-page-bg focus:outline-none focus:ring-2 focus:ring-[#8387CC] text-main transition-colors duration-300">
              <option>All Categories</option>
              <option>Sports Equipment</option>
              <option>Art Materials</option>
              <option>Books</option>
              <option>Technology</option>
              <option>Musical Instruments</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-xl bg-page-bg focus:outline-none focus:ring-2 focus:ring-[#8387CC] text-main transition-colors duration-300">
              <option>All Urgency Levels</option>
              <option>High Priority</option>
              <option>Medium Priority</option>
              <option>Low Priority</option>
            </select>

            {/* New Request */}
            <Link
              href="./addResourceRequest"
              className="ml-auto px-5 py-2.5 bg-[#4169E1] text-white rounded-lg hover:bg-[#3557c1] transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Request
            </Link>
          </div>
        </div>

        {/* ── Tab: All Requests ── */}
        {activeTab === "requests" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {resourceRequests.map((request) => (
              <div key={request.id} className="group relative bg-gradient-to-br from-white via-[#F8F8FF] to-[#EEF0FF] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#8387CC]/10 to-[#4169E1]/10" />

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DCD0FF] to-[#8387CC] flex items-center justify-center flex-shrink-0 shadow-md">
                        <Package className="w-6 h-6 text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-main mb-1 transition-colors duration-300">{request.item}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted transition-colors duration-300">
                          <School className="w-4 h-4" />
                          {request.school}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getUrgencyColor(request.urgency)} transition-colors duration-300`}>
                      {request.urgency} Priority
                    </span>
                  </div>

                  <p className="text-sm text-muted mb-4 transition-colors duration-300">{request.description}</p>

                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1 text-muted transition-colors duration-300">
                      <MapPin className="w-4 h-4" />
                      {request.location}
                    </div>
                    <div className="flex items-center gap-1 text-muted transition-colors duration-300">
                      <Package className="w-4 h-4" />
                      {request.quantity}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-xs text-muted transition-colors duration-300">
                      <Clock className="w-4 h-4" />
                      Deadline: {request.deadline}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-[#F8F8FF] text-main rounded-lg hover:bg-[#DCD0FF] transition-all duration-300 text-sm">
                        Details
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-[#4169E1] to-[#2f4fd4] text-white rounded-lg hover:scale-[1.05] transition-all duration-300 text-sm">
                        Contribute
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-5">
                {filteredRequests.map((request) => (
                  <ResourceCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Tab: My Requests ── */}
        {activeTab === "myRequests" && (
          <div className="bg-card rounded-2xl shadow-lg p-8 transition-colors duration-300">
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#DCD0FF] to-[#8387CC] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-main mb-2 transition-colors duration-300">No Active Requests</h3>
              <p className="text-muted mb-6 transition-colors duration-300">You haven't created any resource requests yet</p>
              <button className="px-6 py-3 bg-gradient-to-r from-[#4169E1] to-[#2f4fd4] text-white rounded-lg hover:scale-[1.05] transition-transform duration-300 flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                Create Your First Request
              </button>
            </div>
          </div>
        )}

        {/* My Donations Tab */}
        {activeTab === "donations" && (
          <div className="space-y-4">
            {myDonations.map((donation) => (
              <div key={donation.id} className="group bg-gradient-to-br from-white via-[#F8F8FF] to-[#EEF0FF] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${donation.status === "Delivered"
                      ? "bg-gradient-to-br from-green-100 to-green-200"
                      : "bg-gradient-to-br from-blue-100 to-blue-200"
                      }`}>
                      <CheckCircle className={`w-6 h-6 ${donation.status === "Delivered"
                        ? "text-green-600"
                        : "text-blue-600"
                        }`} />
                    </div>
                    <div>
                      <h4 className="text-main font-medium transition-colors duration-300">{donation.item}</h4>
                      <p className="text-sm text-muted transition-colors duration-300">To: {donation.recipient}</p>
                      <p className="text-xs text-muted mt-1 transition-colors duration-300">{donation.date}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${donation.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                      } transition-colors duration-300`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Banner with gradient */}
        <div className="mt-8 bg-gradient-to-r from-[#8387CC] to-[#4169E1] rounded-2xl shadow-xl p-8 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="mb-2 text-white font-semibold">Enable Notifications</h4>
              <p className="text-sm text-[#DCD0FF] mb-6 transition-colors duration-300">
                Get automatic notifications when new resource requests match your interests
              </p>
              <button className="px-6 py-3 bg-white text-[#34365C] rounded-lg hover:bg-[#DCD0FF] transition-all duration-300 text-sm font-medium shadow-md">
                Enable Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mt-8 bg-gradient-to-br from-[#F8F8FF] to-[#EEF0FF] rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#4169E1] transition-colors duration-300" />
            <div>
              <h4 className="text-main font-medium transition-colors duration-300">Recent Impact</h4>
              <p className="text-sm text-muted transition-colors duration-300">
                127 resources shared this month • 45 schools supported
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
