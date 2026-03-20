"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Package,
  School,
  MapPin,
  Clock,
  Sparkles,
  TrendingUp,
  Boxes,
  HandHeart,
  Mail,
  Phone,
  Search,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { useResourceRequestStore } from "@/context/useResourceRequestStore";
import { useUserStore } from "@/context/useUserStore";
import { ResourceRequestQuery } from "@/app/_type/type";
import { useToastStore } from "@/context/useToastStore";

gsap.registerPlugin(ScrollTrigger);

const RESOURCE_TYPES = [
  "funding",
  "equipment",
  "mentorship",
  "venue",
  "software",
  "other",
] as const;

const URGENCY_LEVELS = ["low", "medium", "high"] as const;

const STATUS_OPTIONS = ["open", "closed", "fulfilled"] as const;

const VISIBILITY_OPTIONS = ["public", "private"] as const;

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
};

const formatOptionLabel = (value: string) =>
  value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function ResourceSharing() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const requestsRef = useRef<HTMLDivElement>(null);

  const {
    resources,
    isFetchingResources,
    isMutatingResource,
    error,
    fetchResources,
    searchResources,
    createResource,
    clearError,
  } = useResourceRequestStore();

  const { isAuthenticated, userRole, currentUser } = useUserStore();
  const showToast = useToastStore((state) => state.showToast);
  const isPublicView = currentUser == null;

  const [keyword, setKeyword] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState<"" | (typeof RESOURCE_TYPES)[number]>("");
  const [urgencyFilter, setUrgencyFilter] = useState<"" | (typeof URGENCY_LEVELS)[number]>("");
  const [statusFilter, setStatusFilter] = useState<"" | (typeof STATUS_OPTIONS)[number]>("");
  const [visibilityFilter, setVisibilityFilter] = useState<"" | (typeof VISIBILITY_OPTIONS)[number]>("public");
  const [districtFilter, setDistrictFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");

  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    resourceType: "equipment" as (typeof RESOURCE_TYPES)[number],
    requestedFor: "",
    quantity: "",
    urgency: "medium" as (typeof URGENCY_LEVELS)[number],
    neededBy: "",
    visibility: "private" as (typeof VISIBILITY_OPTIONS)[number],
    remarks: "",
    contactNumber: "",
    email: "",
  });

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const neededByMs = createForm.neededBy ? new Date(createForm.neededBy).getTime() : NaN;
  const isNeededByValid = !createForm.neededBy || (Number.isFinite(neededByMs) && neededByMs > todayMidnight);
  const canSubmitResourceRequest = Boolean(
    createForm.title.trim() &&
    createForm.description.trim() &&
    createForm.requestedFor.trim() &&
    isNeededByValid
  );

  const schoolId = currentUser?.school_id as string | undefined;
  const canCreate = isAuthenticated && userRole === "SCHOOL_ADMIN" && Boolean(schoolId);

  const loadResources = async (params: ResourceRequestQuery = {}) => {
    if (isPublicView) {
      await fetchResources({ ...params, visibility: "public" });
      return;
    }

    if (!params.visibility && visibilityFilter) {
      await fetchResources({ ...params, visibility: visibilityFilter });
      return;
    }

    await fetchResources(params);
  };

  const stats = useMemo(() => {
    const highPriority = resources.filter((r) => r.request.urgency === "high" && r.request.status === "open").length;
    return {
      activeRequests: resources.filter((r) => r.request.status === "open").length,
      highPriority,
      partnerSchools: new Set(resources.map((r) => r.school?.school_id ?? r.request.schoolId)).size,
      totalRequests: resources.length,
    };
  }, [resources]);

  const districtOptions = useMemo(() => {
    const values = resources
      .map((resource) => resource.school?.district?.trim())
      .filter((value): value is string => Boolean(value));
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  }, [resources]);

  const provinceOptions = useMemo(() => {
    const values = resources
      .map((resource) => resource.school?.province?.trim())
      .filter((value): value is string => Boolean(value));
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  }, [resources]);

  const displayedResources = useMemo(() => {
    return resources.filter((resource) => {
      const district = resource.school?.district?.trim() ?? "";
      const province = resource.school?.province?.trim() ?? "";

      const districtMatch = districtFilter ? district === districtFilter : true;
      const provinceMatch = provinceFilter ? province === provinceFilter : true;

      return districtMatch && provinceMatch;
    });
  }, [resources, districtFilter, provinceFilter]);

  useEffect(() => {
    void loadResources();
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (!error) return;
    showToast(error, "error");
  }, [error, showToast]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: ResourceRequestQuery = {
      keyword: keyword || undefined,
      resourceType: resourceTypeFilter || undefined,
      urgency: urgencyFilter || undefined,
      status: statusFilter || undefined,
      visibility: isPublicView ? "public" : visibilityFilter || undefined,
    };

    if (keyword.trim()) {
      await searchResources(params);
      return;
    }

    await fetchResources(params);
  };

  const handleClearFilters = async () => {
    setKeyword("");
    setResourceTypeFilter("");
    setUrgencyFilter("");
    setStatusFilter("");
    setDistrictFilter("");
    setProvinceFilter("");
    setVisibilityFilter("public");
    clearError();
    await loadResources({ visibility: "public" });
  };

  const handleCreateRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schoolId || !canSubmitResourceRequest) return;

    const created = await createResource(schoolId, {
      title: createForm.title,
      description: createForm.description,
      resourceType: createForm.resourceType,
      requestedFor: createForm.requestedFor,
      quantity: createForm.quantity ? Number(createForm.quantity) : undefined,
      urgency: createForm.urgency,
      neededBy: createForm.neededBy || undefined,
      visibility: createForm.visibility,
      remarks: createForm.remarks || undefined,
      contactNumber: createForm.contactNumber || undefined,
      email: createForm.email || undefined,
    });

    if (created) {
      setCreateForm({
        title: "",
        description: "",
        resourceType: "equipment",
        requestedFor: "",
        quantity: "",
        urgency: "medium",
        neededBy: "",
        visibility: "private",
        remarks: "",
        contactNumber: "",
        email: "",
      });
    }
  };

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const stars = gsap.utils.toArray<HTMLElement>(".rs-star");
      const statCards = gsap.utils.toArray<HTMLElement>(".rs-stat-card");
      const requestCards = gsap.utils.toArray<HTMLElement>(".rs-request-card");

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
        <div ref={headerRef} className="text-center mb-10 relative">
          <Sparkles className="rs-star absolute top-0 right-1/4 w-7 h-7 text-[#DCD0FF] opacity-70" />
          <Sparkles className="rs-star absolute bottom-2 left-1/4 w-5 h-5 text-[#8387CC] opacity-60" />

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] mb-4 shadow-xl">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#34365C] text-4xl font-bold mb-2">Resource Sharing Hub</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover active requests from schools, spread awareness, and connect directly with the requesting school through the listed contact channels.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E9E5FF] text-[#505485] text-xs sm:text-sm font-medium">
            <Clock className="w-4 h-4" />
            Public request board for visibility and collaboration
          </div>
        </div>

        <div ref={statsRef} className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rs-stat-card rs-tilt bg-white rounded-xl shadow-md p-6 text-center border border-[#ECE9FF]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
              <Boxes className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{stats.totalRequests}</p>
            <p className="text-sm text-gray-600">Total Requests</p>
          </div>
          <div className="rs-stat-card rs-tilt bg-white rounded-xl shadow-md p-6 text-center border border-[#ECE9FF]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{stats.highPriority}</p>
            <p className="text-sm text-gray-600">High Priority Open</p>
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
              <HandHeart className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{stats.activeRequests}</p>
            <p className="text-sm text-gray-600">Open Requests</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6 bg-white rounded-2xl border border-[#ECE9FF] shadow-lg p-5 grid lg:grid-cols-8 gap-3">
          <label className="lg:col-span-2">
            <span className="sr-only">Keyword</span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D9D4FF]">
              <Search className="w-4 h-4 text-[#5C618F]" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search title or description"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </label>

          <select
            value={resourceTypeFilter}
            onChange={(event) => setResourceTypeFilter(event.target.value as "" | (typeof RESOURCE_TYPES)[number])}
            className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((option) => (
              <option key={option} value={option}>{formatOptionLabel(option)}</option>
            ))}
          </select>

          <select
            value={urgencyFilter}
            onChange={(event) => setUrgencyFilter(event.target.value as "" | (typeof URGENCY_LEVELS)[number])}
            className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
          >
            <option value="">All Urgency</option>
            {URGENCY_LEVELS.map((option) => (
              <option key={option} value={option}>{formatOptionLabel(option)}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "" | (typeof STATUS_OPTIONS)[number])}
            className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>{formatOptionLabel(option)}</option>
            ))}
          </select>

          <select
            value={districtFilter}
            onChange={(event) => setDistrictFilter(event.target.value)}
            className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
          >
            <option value="">All Districts</option>
            {districtOptions.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <select
            value={provinceFilter}
            onChange={(event) => setProvinceFilter(event.target.value)}
            className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
          >
            <option value="">All Provinces</option>
            {provinceOptions.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>

          <select
            value={visibilityFilter}
            onChange={(event) => setVisibilityFilter(event.target.value as "" | (typeof VISIBILITY_OPTIONS)[number])}
            className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
            disabled={isPublicView}
          >
            <option value="">All Visibility</option>
            {VISIBILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>{formatOptionLabel(option)}</option>
            ))}
          </select>

          <div className="lg:col-span-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white text-sm font-medium"
              disabled={isFetchingResources}
            >
              {isFetchingResources ? "Loading..." : "Apply Filters"}
            </button>
            <button
              type="button"
              onClick={() => void handleClearFilters()}
              className="px-5 py-2 rounded-lg border border-[#D9D4FF] text-[#34365C] text-sm font-medium"
            >
              Clear
            </button>
            {isPublicView && (
              <p className="text-xs text-[#5C618F]">Public view shows only public requests.</p>
            )}
          </div>
        </form>

        {canCreate && (
          <form onSubmit={handleCreateRequest} className="mb-8 bg-white rounded-2xl border border-[#ECE9FF] shadow-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="w-5 h-5 text-[#4169E1]" />
              <h2 className="text-[#34365C] text-lg font-semibold">Create Resource Request</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                required
                value={createForm.title}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Title"
                className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
              />
              <input
                required
                value={createForm.requestedFor}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, requestedFor: event.target.value }))}
                placeholder="Requested for (e.g. Grade 10 science labs)"
                className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
              />
              <select
                value={createForm.resourceType}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, resourceType: event.target.value as (typeof RESOURCE_TYPES)[number] }))}
                className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
              >
                {RESOURCE_TYPES.map((option) => (
                  <option key={option} value={option}>{formatOptionLabel(option)}</option>
                ))}
              </select>
              <select
                value={createForm.urgency}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, urgency: event.target.value as (typeof URGENCY_LEVELS)[number] }))}
                className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
              >
                {URGENCY_LEVELS.map((option) => (
                  <option key={option} value={option}>{formatOptionLabel(option)}</option>
                ))}
              </select>
              <input
                value={createForm.quantity}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, quantity: event.target.value }))}
                placeholder="Quantity (optional)"
                type="number"
                min={1}
                className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
              />
              <label className="flex flex-col gap-1 text-xs font-medium text-[#5C618F]">
                Needed By Date
                <input
                  value={createForm.neededBy}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, neededBy: event.target.value }))}
                  type="date"
                  placeholder="YYYY-MM-DD"
                  title="Needed by date (YYYY-MM-DD)"
                  className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
                />
              </label>
              <input
                value={createForm.contactNumber}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, contactNumber: event.target.value }))}
                placeholder="Contact number"
                className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
              />
              <input
                value={createForm.email}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                type="email"
                placeholder="Contact email"
                className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
              />
              <select
                value={createForm.visibility}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, visibility: event.target.value as (typeof VISIBILITY_OPTIONS)[number] }))}
                className="px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm"
              >
                {VISIBILITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{formatOptionLabel(option)}</option>
                ))}
              </select>
            </div>

            <textarea
              required
              value={createForm.description}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Describe the request and impact"
              className="w-full mt-3 px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm min-h-24"
            />
            <textarea
              value={createForm.remarks}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, remarks: event.target.value }))}
              placeholder="Additional remarks (optional)"
              className="w-full mt-3 px-3 py-2 rounded-lg border border-[#D9D4FF] text-sm min-h-20"
            />

            {!isNeededByValid && (
              <p className="mt-3 text-sm text-red-600">Needed by date must be after today.</p>
            )}

            <button
              type="submit"
              className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-[#34365C] to-[#505485] text-white text-sm font-medium"
              disabled={isMutatingResource || !canSubmitResourceRequest}
            >
              {isMutatingResource ? "Submitting..." : "Publish Request"}
            </button>
          </form>
        )}

        <div ref={requestsRef} className="bg-white rounded-2xl shadow-lg border border-[#ECE9FF] overflow-hidden mb-8">
          <div className="p-5 bg-gradient-to-r from-[#F0EDFF] to-[#FAF9FF] border-b border-[#ECE9FF]">
            <h2 className="text-[#34365C] text-xl font-semibold">Live Resource Requests</h2>
            <p className="text-sm text-[#5C618F] mt-1">Reach out directly to schools and help fulfill urgent needs faster.</p>
          </div>

          <div className="p-5 grid lg:grid-cols-2 gap-4" style={{ perspective: "1000px" }}>
            {displayedResources.length === 0 && !isFetchingResources && (
              <div className="col-span-full rounded-xl border border-dashed border-[#D9D4FF] px-4 py-8 text-center text-[#5C618F]">
                No requests found for the selected filters.
              </div>
            )}

            {displayedResources.map((resource) => {
              const request = resource.request;
              const school = resource.school;

              return (
                <article key={request.id} className="rs-request-card rs-tilt rounded-xl border border-[#ECE9FF] bg-gradient-to-br from-white via-[#F8F8FF] to-[#EEF0FF] p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-[#34365C] font-semibold text-lg">{request.title}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8EAFE] text-[#4D5190] uppercase tracking-wide">
                      {request.urgency}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{request.description}</p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-2"><School className="w-4 h-4" /> {school?.name ?? "School unavailable"}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {school ? `${school.district}${school.province ? `, ${school.province}` : ""}` : "Location unavailable"}</p>
                    <p className="flex items-center gap-2"><Package className="w-4 h-4" /> {request.resourceType} {request.quantity ? `• ${request.quantity}` : ""}</p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-[#EEF0FF] text-[#4D5190]">{request.status}</span>
                    <span className="px-2 py-1 rounded-full bg-[#F3F6FF] text-[#4D5190]">{request.visibility}</span>
                    <span className="px-2 py-1 rounded-full bg-[#F8F4FF] text-[#4D5190]">For: {request.requestedFor}</span>
                  </div>

                  <div className="pt-3 border-t border-[#ECE9FF] flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Posted {formatDate(request.createdAt)}</span>
                    <span>Needed by {formatDate(request.neededBy)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {request.contactNumber && (
                      <a href={`tel:${request.contactNumber}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#ECF1FF] text-[#3452A5] text-xs font-medium">
                        <Phone className="w-3.5 h-3.5" /> Call School
                      </a>
                    )}
                    {request.email && (
                      <a href={`mailto:${request.email}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#EDF8F2] text-[#2A7A51] text-xs font-medium">
                        <Mail className="w-3.5 h-3.5" /> Send Email
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {!canCreate && (
          <div className="mt-8 bg-gradient-to-br from-[#34365C] to-[#505485] rounded-2xl shadow-lg p-6 text-white text-center">
            <HandHeart className="w-11 h-11 mx-auto mb-3 opacity-90" />
            <h3 className="text-2xl font-semibold mb-2">Want To Post A Resource Request?</h3>
            <p className="text-[#DCDFFF] mb-4">
              Resource posting is available to school administrators. Keep this board public so supporters can discover needs and connect directly.
            </p>
            <p className="text-sm text-[#E7E9FF]">
              If you are a school admin, sign in with your school account to publish requests.
            </p>
          </div>
        )}

        {isMutatingResource && (
          <div className="mt-4 text-sm text-[#5C618F] text-center">Saving request changes...</div>
        )}

        {isFetchingResources && (
          <div className="mt-4 text-sm text-[#5C618F] text-center">Loading resource requests...</div>
        )}

        <div className="mt-8 bg-gradient-to-br from-[#34365C] to-[#505485] rounded-2xl shadow-lg p-6 text-white text-center">
          <HandHeart className="w-11 h-11 mx-auto mb-3 opacity-90" />
          <h3 className="text-2xl font-semibold mb-2">Spread The Need, Build The Network</h3>
          <p className="text-[#DCDFFF]">
            This public board exists for awareness. Share these requests with mentors, donors, and partner institutions so schools can connect faster.
          </p>
        </div>
      </div>
    </div>
  );
}
