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
          {["requests", "myRequests", "donations"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg transition ${
                activeTab === tab
                  ? "bg-[#8387CC] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab === "requests"
                ? "Resource Requests"
                : tab === "myRequests"
                ? "My Requests"
                : "My Donations"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resource requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8387CC]"
              />
            </div>
            <button className="px-6 py-2 bg-[#4169E1] text-white rounded-lg hover:bg-[#3557c1] flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Request
            </button>
          </div>
        </div>

        {/* Requests */}
        {activeTab === "requests" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {resourceRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-[#DCD0FF] rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#8387CC]" />
                    </div>
                    <div>
                      <h3 className="text-[#34365C] font-medium">
                        {request.item}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <School className="w-4 h-4" />
                        {request.school}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize ${getUrgencyColor(
                      request.urgency
                    )}`}
                  >
                    {request.urgency} Priority
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  {request.description}
                </p>

                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {request.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {request.quantity}
                  </div>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-4 h-4" />
                    Deadline: {request.deadline}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#F8F8FF] rounded-lg text-sm">
                      Details
                    </button>
                    <button className="px-4 py-2 bg-[#4169E1] text-white rounded-lg text-sm">
                      Contribute
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Donations */}
        {activeTab === "donations" && (
          <div className="space-y-4">
            {myDonations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-lg shadow-md p-6 flex justify-between"
              >
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="text-[#34365C]">{donation.item}</h4>
                    <p className="text-sm text-gray-600">
                      To: {donation.recipient}
                    </p>
                  </div>
                </div>
                <span className="text-sm">{donation.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Notification */}
        <div className="mt-8 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg p-6">
          <div className="flex gap-4">
            <Bell className="w-6 h-6" />
            <div>
              <h4 className="font-semibold">Enable Notifications</h4>
              <p className="text-sm text-[#DCD0FF] mb-4">
                Get notified when new requests match your interests
              </p>
              <button className="px-6 py-2 bg-white text-[#34365C] rounded-lg">
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
