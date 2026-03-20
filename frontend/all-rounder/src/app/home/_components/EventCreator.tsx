"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CalendarPlus, ChevronDown, Loader2, Plus, School, Trash2 } from "lucide-react";
import { CreateEventHostInput } from "@/app/_type/type";
import { useEventStore } from "@/context/useEventStore";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useOrganizationStore } from "@/context/useOrganizationStore";
import { useUserStore } from "@/context/useUserStore";
import { useToastStore } from "@/context/useToastStore";

const EVENT_TYPES = ["workshop", "competition", "seminar", "webinar", "conference", "other"] as const;

const formatOptionLabel = (value: string) =>
  value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

type EventType = (typeof EVENT_TYPES)[number];

const emptyHost = (): CreateEventHostInput => ({
  hostType: "school",
  hostId: "",
  hostName: "",
  isPrimary: false,
});

const getDefaultPrimaryHost = (
  userRole: string | null,
  currentUser: any,
  schools: Array<{ school_id: string; name: string }>,
  organizations: Array<{ organization_id: string; organization_name: string }>,
  organizerName?: string
): CreateEventHostInput | null => {
  if (!currentUser) return null;

  if (userRole === "SCHOOL_ADMIN") {
    const hostId = currentUser.school_id || currentUser.school?.school_id || currentUser.schoolId;
    const hostNameFromProfile = currentUser.school?.name || currentUser.school_name || currentUser.schoolName;
    const hostNameFromStore = hostId
      ? schools.find((school) => school.school_id === String(hostId))?.name
      : undefined;
    const hostName = hostNameFromProfile || hostNameFromStore || organizerName;
    if (!hostId || !hostName) return null;

    return {
      hostType: "school",
      hostId: String(hostId),
      hostName: String(hostName),
      isPrimary: true,
    };
  }

  if (userRole === "ORG_ADMIN") {
    const hostId = currentUser.organization_id || currentUser.organization?.organization_id || currentUser.organizationId;
    const hostNameFromProfile =
      currentUser.organization?.organization_name ||
      currentUser.organization_name ||
      currentUser.organizationName ||
      currentUser.organization?.name;
    const hostNameFromStore = hostId
      ? organizations.find((org) => org.organization_id === String(hostId))?.organization_name
      : undefined;
    const hostName = hostNameFromProfile || hostNameFromStore || organizerName;
    if (!hostId || !hostName) return null;

    return {
      hostType: "organization",
      hostId: String(hostId),
      hostName: String(hostName),
      isPrimary: true,
    };
  }

  return null;
};

interface EventCreatorProps {
  onCreated?: () => void;
}

export default function EventCreator({ onCreated }: EventCreatorProps) {
  const createEvent = useEventStore((state) => state.createEvent);
  const isLoading = useEventStore((state) => state.isLoading);
  const error = useEventStore((state) => state.error);
  const schools = useSchoolStore((state) => state.schools);
  const fetchSchools = useSchoolStore((state) => state.fetchSchools);
  const organizations = useOrganizationStore((state) => state.organizations);
  const fetchOrganizations = useOrganizationStore((state) => state.fetchOrganizations);
  const userRole = useUserStore((state) => state.userRole);
  const currentUser = useUserStore((state) => state.currentUser);
  const showToast = useToastStore((state) => state.showToast);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState<EventType>("workshop");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState(currentUser?.name || "");
  const [eligibility, setEligibility] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [hosts, setHosts] = useState<CreateEventHostInput[]>([]);
  const [hostSearchTerms, setHostSearchTerms] = useState<string[]>([]);
  const [openHostDropdownIndex, setOpenHostDropdownIndex] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const defaultPrimaryHost = useMemo(
    () => getDefaultPrimaryHost(userRole, currentUser, schools, organizations, organizer.trim() || undefined),
    [userRole, currentUser, schools, organizations, organizer]
  );

  const isAuthorized = userRole === "SCHOOL_ADMIN" || userRole === "ORG_ADMIN";

  const startMs = startDate ? new Date(startDate).getTime() : NaN;
  const endMs = endDate ? new Date(endDate).getTime() : NaN;
  const hasRequiredEventFields = Boolean(
    title.trim() &&
    description.trim() &&
    category.trim() &&
    organizer.trim() &&
    location.trim() &&
    eligibility.trim() &&
    startDate &&
    endDate
  );
  const isEventDateChronological =
    Number.isFinite(startMs) &&
    Number.isFinite(endMs) &&
    endMs >= startMs;
  const canSubmitEvent = hasRequiredEventFields && isEventDateChronological;

  useEffect(() => {
    if (schools.length === 0) {
      void fetchSchools();
    }
    if (organizations.length === 0) {
      void fetchOrganizations();
    }
  }, [fetchSchools, fetchOrganizations, organizations.length, schools.length]);

  useEffect(() => {
    if (!error) return;
    showToast(error, "error");
  }, [error, showToast]);

  if (!isAuthorized) {
    return null;
  }

  const updateHost = <K extends keyof CreateEventHostInput>(index: number, key: K, value: CreateEventHostInput[K]) => {
    setHosts((prev) => prev.map((h, i) => (i === index ? { ...h, [key]: value } : h)));
  };

  const addHost = () => {
    setHosts((prev) => [...prev, emptyHost()]);
    setHostSearchTerms((prev) => [...prev, ""]);
  };

  const removeHost = (index: number) => {
    setHosts((prev) => prev.filter((_, i) => i !== index));
    setHostSearchTerms((prev) => prev.filter((_, i) => i !== index));
    setOpenHostDropdownIndex((prev) => (prev === index ? null : prev));
  };

  const updateHostSearchTerm = (index: number, value: string) => {
    setHostSearchTerms((prev) => prev.map((term, i) => (i === index ? value : term)));
    updateHost(index, "hostId", "");
    updateHost(index, "hostName", "");
  };

  const selectHostFromSearch = (
    index: number,
    option: { id: string; name: string; hostType: "school" | "organization" }
  ) => {
    updateHost(index, "hostType", option.hostType);
    updateHost(index, "hostId", option.id);
    updateHost(index, "hostName", option.name);
    setHostSearchTerms((prev) => prev.map((term, i) => (i === index ? option.name : term)));
    setOpenHostDropdownIndex(null);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setEventType("workshop");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setOrganizer(currentUser?.name || "");
    setEligibility("");
    setRegistrationUrl("");
    setIsOnline(false);
    setVisibility("public");
    setAttachments([]);
    setHosts([]);
    setHostSearchTerms([]);
    setOpenHostDropdownIndex(null);
    setValidationError(null);
    setFieldErrors({});
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!title.trim()) nextErrors.title = "Title is required";
    if (!description.trim()) nextErrors.description = "Description is required";
    if (!category.trim()) nextErrors.category = "Category is required";
    if (!startDate) nextErrors.startDate = "Start date is required";
    if (!endDate) nextErrors.endDate = "End date is required";
    if (!location.trim()) nextErrors.location = "Location is required";
    if (!organizer.trim()) nextErrors.organizer = "Organizer is required";
    if (!eligibility.trim()) nextErrors.eligibility = "Eligibility is required";

    if (startDate && endDate) {
      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime();

      if (Number.isNaN(startMs)) nextErrors.startDate = "Start date is invalid";
      if (Number.isNaN(endMs)) nextErrors.endDate = "End date is invalid";
      if (!Number.isNaN(startMs) && !Number.isNaN(endMs) && endMs < startMs) {
        nextErrors.endDate = "End date cannot be earlier than start date";
      }
    }

    const trimmedRegistrationUrl = registrationUrl.trim();
    if (trimmedRegistrationUrl) {
      try {
        const parsed = new URL(trimmedRegistrationUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          nextErrors.registrationUrl = "Registration URL must start with http:// or https://";
        }
      } catch {
        nextErrors.registrationUrl = "Registration URL is invalid";
      }
    }

    hosts.forEach((host, index) => {
      const hasId = host.hostId.trim().length > 0;
      const hasName = host.hostName.trim().length > 0;
      if (hasId !== hasName) {
        nextErrors[`host-${index}`] = "Host ID and Host Name must both be provided";
      }
    });

    if (!defaultPrimaryHost) {
      nextErrors.primaryHost = "Unable to resolve your school/organization host details. Please refresh profile data.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    setValidationError(null);

    if (!validateForm()) {
      setValidationError("Please fix the highlighted fields.");
      return;
    }

    const filteredHosts = hosts
      .filter((host) => host.hostId.trim() && host.hostName.trim())
      .map((host) => ({
        ...host,
        hostId: host.hostId.trim(),
        hostName: host.hostName.trim(),
        isPrimary: false,
      }));

    if (!defaultPrimaryHost) {
      setValidationError("Unable to resolve your school/organization host details.");
      return;
    }

    const eventHosts: CreateEventHostInput[] = [
      defaultPrimaryHost,
      ...filteredHosts.filter((host) => host.hostId !== defaultPrimaryHost.hostId),
    ];

    const created = await createEvent({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      eventType,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      location: location.trim(),
      organizer: organizer.trim(),
      eligibility: eligibility.trim(),
      registrationUrl: registrationUrl.trim() || undefined,
      isOnline,
      visibility,
      hosts: eventHosts,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (created) {
      resetForm();
      onCreated?.();
    }
  };

  const getHostOptions = (host: CreateEventHostInput, index: number) => {
    const searchTerm = (hostSearchTerms[index] || "").toLowerCase();
    const selectedHostIds = new Set(
      hosts
        .map((h, i) => (i === index ? "" : h.hostId))
        .filter(Boolean)
    );
    if (defaultPrimaryHost?.hostId) {
      selectedHostIds.add(defaultPrimaryHost.hostId);
    }

    if (host.hostType === "school") {
      return schools
        .filter((school) => school.school_id && school.name)
        .filter((school) => !selectedHostIds.has(school.school_id))
        .filter((school) => school.name.toLowerCase().includes(searchTerm))
        .slice(0, 8)
        .map((school) => ({ id: school.school_id, name: school.name, hostType: "school" as const }));
    }

    return organizations
      .filter((org) => org.organization_id && org.organization_name)
      .filter((org) => !selectedHostIds.has(org.organization_id))
      .filter((org) => org.organization_name.toLowerCase().includes(searchTerm))
      .slice(0, 8)
      .map((org) => ({ id: org.organization_id, name: org.organization_name, hostType: "organization" as const }));
  };

  return (
    <div className="bg-gradient-to-br from-white via-white to-indigo-50/30 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
            <CalendarPlus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Create Event</h2>
            <p className="text-xs text-gray-500">Available for school and organization admins</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 ${fieldErrors.title ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.title && <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>}
        </div>
        <div>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. Quiz, Workshop)"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 ${fieldErrors.category ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.category && <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
        </div>

        <select value={eventType} onChange={(e) => setEventType(e.target.value as EventType)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>{formatOptionLabel(type)}</option>
          ))}
        </select>

        <div>
          <input
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            placeholder="Organizer"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 ${fieldErrors.organizer ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.organizer && <p className="mt-1 text-xs text-red-600">{fieldErrors.organizer}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Start Date & Time</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            title="Start date and time"
            placeholder="YYYY-MM-DDTHH:mm"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 ${fieldErrors.startDate ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.startDate && <p className="mt-1 text-xs text-red-600">{fieldErrors.startDate}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">End Date & Time</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            title="End date and time"
            placeholder="YYYY-MM-DDTHH:mm"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 ${fieldErrors.endDate ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.endDate && <p className="mt-1 text-xs text-red-600">{fieldErrors.endDate}</p>}
        </div>

        <div>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 ${fieldErrors.location ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.location && <p className="mt-1 text-xs text-red-600">{fieldErrors.location}</p>}
        </div>
        <div>
          <input
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            placeholder="Eligibility"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 ${fieldErrors.eligibility ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.eligibility && <p className="mt-1 text-xs text-red-600">{fieldErrors.eligibility}</p>}
        </div>

        <div className="md:col-span-2">
          <input
            value={registrationUrl}
            onChange={(e) => setRegistrationUrl(e.target.value)}
            placeholder="Registration URL (optional)"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 ${fieldErrors.registrationUrl ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.registrationUrl && <p className="mt-1 text-xs text-red-600">{fieldErrors.registrationUrl}</p>}
        </div>

        <div className="md:col-span-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 min-h-[110px] ${fieldErrors.description ? "border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} />
          Online Event
        </label>

        <select value={visibility} onChange={(e) => setVisibility(e.target.value as "public" | "private")} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <input
          type="file"
          multiple
          className="md:col-span-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
          onChange={(e) => setAttachments(e.target.files ? Array.from(e.target.files) : [])}
        />
      </div>

      <div className="mt-4 border border-indigo-100 rounded-xl p-3 bg-gradient-to-br from-indigo-50/70 to-white">
        <div className="mb-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs text-indigo-800">
          Primary host is auto-set to your {userRole === "SCHOOL_ADMIN" ? "school" : "organization"}.
        </div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Co-hosts (optional)</h3>
          <button onClick={addHost} className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 inline-flex items-center gap-1 hover:bg-indigo-200 transition-colors">
            <Plus className="w-3 h-3" /> Add host
          </button>
        </div>

        {hosts.length === 0 ? (
          <p className="text-xs text-gray-500">No co-hosts added.</p>
        ) : (
          <div className="space-y-2">
            {hosts.map((host, index) => (
              <div key={`${index}-${host.hostType}`} className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-white p-2.5 border border-indigo-100 rounded-lg shadow-sm">
                <select
                  value={host.hostType}
                  onChange={(e) => {
                    const nextType = e.target.value as "school" | "organization";
                    updateHost(index, "hostType", nextType);
                    updateHost(index, "hostId", "");
                    updateHost(index, "hostName", "");
                    setHostSearchTerms((prev) => prev.map((term, i) => (i === index ? "" : term)));
                  }}
                  className="px-2 py-1 border border-gray-200 rounded-md text-xs text-gray-800 bg-white"
                >
                  <option value="school">School</option>
                  <option value="organization">Organization</option>
                </select>

                <div className="md:col-span-2 relative">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    {host.hostType === "school" ? (
                      <School className="w-3.5 h-3.5 text-indigo-500" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                  </div>
                  <input
                    value={hostSearchTerms[index] || ""}
                    onChange={(e) => {
                      updateHostSearchTerm(index, e.target.value);
                      setOpenHostDropdownIndex(index);
                    }}
                    onFocus={() => setOpenHostDropdownIndex(index)}
                    onBlur={() => setTimeout(() => setOpenHostDropdownIndex((prev) => (prev === index ? null : prev)), 150)}
                    placeholder={host.hostType === "school" ? "Search school..." : "Search organization..."}
                    className="w-full pl-8 pr-7 py-1.5 border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                  />
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                  {openHostDropdownIndex === index && (
                    <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-52 overflow-y-auto">
                      {getHostOptions(host, index).length > 0 ? (
                        getHostOptions(host, index).map((option) => (
                          <button
                            key={`${option.hostType}-${option.id}`}
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-indigo-50 transition-colors"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectHostFromSearch(index, option);
                            }}
                          >
                            <div className="font-medium">{option.name}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-gray-500">No matching {host.hostType}s found.</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-2 py-1.5 border border-gray-200 rounded-md text-xs text-gray-600 bg-gray-50 truncate">
                  {host.hostName ? `Selected: ${host.hostName}` : "No selection"}
                </div>

                <div className="flex items-center text-xs text-indigo-600 font-medium">Secondary host</div>

                <button
                  onClick={() => removeHost(index)}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-red-50 text-red-600 text-xs hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
                {fieldErrors[`host-${index}`] && (
                  <p className="md:col-span-5 text-xs text-red-600">{fieldErrors[`host-${index}`]}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {validationError && <p className="mt-3 text-xs text-red-600">{validationError}</p>}
      {fieldErrors.primaryHost && <p className="mt-3 text-xs text-red-600">{fieldErrors.primaryHost}</p>}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button onClick={resetForm} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !canSubmitEvent}
          className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 inline-flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </div>
    </div>
  );
}
