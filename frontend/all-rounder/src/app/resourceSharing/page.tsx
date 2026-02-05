"use client";

import { useState } from "react";
import {
  Package,
  Search,
  Plus,
  School,
  MapPin,
  Clock,
  CheckCircle,
  Bell,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#F8F8FF] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#34365C] mb-2 text-3xl font-semibold">
            Resource Sharing Hub
          </h1>
          <p className="text-gray-600">
            Connect schools with donors to fulfill resource needs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3 rounded-lg transition ${
              activeTab === "requests"
                ? "bg-[#8387CC] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Resource Requests
          </button>
          <button
            onClick={() => setActiveTab("myRequests")}
            className={`px-6 py-3 rounded-lg transition ${
              activeTab === "myRequests"
                ? "bg-[#8387CC] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`px-6 py-3 rounded-lg transition ${
              activeTab === "donations"
                ? "bg-[#8387CC] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            My Donations
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resource requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]">
              <option>All Categories</option>
              <option>Sports Equipment</option>
              <option>Art Materials</option>
              <option>Books</option>
              <option>Technology</option>
              <option>Musical Instruments</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]">
              <option>All Urgency Levels</option>
              <option>High Priority</option>
              <option>Medium Priority</option>
              <option>Low Priority</option>
            </select>
            <button className="px-6 py-2 bg-[#4169E1] text-white rounded-lg hover:bg-[#3557c1] transition flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Request
            </button>
          </div>
        </div>

        {/* Resource Requests Tab */}
        {activeTab === "requests" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {resourceRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#DCD0FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-[#8387CC]" />
                    </div>
                    <div>
                      <h3 className="text-[#34365C] mb-1">{request.item}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <School className="w-4 h-4" />
                        {request.school}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs capitalize ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency} Priority
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-4">{request.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {request.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {request.quantity}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-4 h-4" />
                    Deadline: {request.deadline}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#F8F8FF] text-[#34365C] rounded-lg hover:bg-[#DCD0FF] transition text-sm">
                      Details
                    </button>
                    <button className="px-4 py-2 bg-[#4169E1] text-white rounded-lg hover:bg-[#3557c1] transition text-sm">
                      Contribute
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Requests Tab */}
        {activeTab === "myRequests" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-[#34365C] mb-2">No Active Requests</h3>
              <p className="text-gray-600 mb-6">You haven't created any resource requests yet</p>
              <button className="px-6 py-3 bg-[#4169E1] text-white rounded-lg hover:bg-[#3557c1] transition flex items-center gap-2 mx-auto">
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
              <div key={donation.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-[#34365C]">{donation.item}</h4>
                      <p className="text-sm text-gray-600">To: {donation.recipient}</p>
                      <p className="text-xs text-gray-500 mt-1">{donation.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      donation.status === "Delivered" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <Bell className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h4 className="mb-2 text-white">Enable Notifications</h4>
              <p className="text-sm text-[#DCD0FF] mb-4">
                Get automatic notifications when new resource requests match your interests
              </p>
              <button className="px-6 py-2 bg-white text-[#34365C] rounded-lg hover:bg-[#DCD0FF] transition text-sm">
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
