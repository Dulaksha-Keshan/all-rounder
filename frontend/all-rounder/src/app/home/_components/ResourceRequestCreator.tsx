"use client";

import { FormEvent, useEffect, useState } from "react";
import { useResourceRequestStore } from "@/context/useResourceRequestStore";
import { useToastStore } from "@/context/useToastStore";

const RESOURCE_TYPES = [
  "funding",
  "equipment",
  "mentorship",
  "venue",
  "software",
  "other",
] as const;

const URGENCY_LEVELS = ["low", "medium", "high"] as const;
const VISIBILITY_OPTIONS = ["public", "private"] as const;

const formatOptionLabel = (value: string) =>
  value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

interface ResourceRequestCreatorProps {
  schoolId: string;
  onCreated: () => void;
}

export default function ResourceRequestCreator({ schoolId, onCreated }: ResourceRequestCreatorProps) {
  const createResource = useResourceRequestStore((state) => state.createResource);
  const isMutatingResource = useResourceRequestStore((state) => state.isMutatingResource);
  const error = useResourceRequestStore((state) => state.error);
  const clearError = useResourceRequestStore((state) => state.clearError);
  const showToast = useToastStore((state) => state.showToast);

  const [form, setForm] = useState({
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
  const neededByMs = form.neededBy ? new Date(form.neededBy).getTime() : NaN;
  const isNeededByValid = !form.neededBy || (Number.isFinite(neededByMs) && neededByMs > todayMidnight);

  const canSubmit = Boolean(
    form.title.trim() &&
    form.description.trim() &&
    form.requestedFor.trim() &&
    isNeededByValid
  );

  useEffect(() => {
    if (!error) return;
    showToast(error, "error");
  }, [error, showToast]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    const created = await createResource(schoolId, {
      title: form.title,
      description: form.description,
      resourceType: form.resourceType,
      requestedFor: form.requestedFor,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      urgency: form.urgency,
      neededBy: form.neededBy || undefined,
      visibility: form.visibility,
      remarks: form.remarks || undefined,
      contactNumber: form.contactNumber || undefined,
      email: form.email || undefined,
    });

    if (created) {
      onCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input
          required
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Title"
          className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
        />

        <input
          required
          value={form.requestedFor}
          onChange={(event) => setForm((prev) => ({ ...prev, requestedFor: event.target.value }))}
          placeholder="Requested for"
          className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
        />

        <select
          value={form.resourceType}
          onChange={(event) => setForm((prev) => ({ ...prev, resourceType: event.target.value as (typeof RESOURCE_TYPES)[number] }))}
          className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
        >
          {RESOURCE_TYPES.map((type) => (
            <option key={type} value={type}>{formatOptionLabel(type)}</option>
          ))}
        </select>

        <select
          value={form.urgency}
          onChange={(event) => setForm((prev) => ({ ...prev, urgency: event.target.value as (typeof URGENCY_LEVELS)[number] }))}
          className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
        >
          {URGENCY_LEVELS.map((level) => (
            <option key={level} value={level}>{formatOptionLabel(level)}</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={form.quantity}
          onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
          placeholder="Quantity (optional)"
          className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
        />

        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-main)]">
          Needed By Date
          <input
            type="date"
            placeholder="YYYY-MM-DD"
            title="Needed by date (YYYY-MM-DD)"
            value={form.neededBy}
            onChange={(event) => setForm((prev) => ({ ...prev, neededBy: event.target.value }))}
            className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
          />
        </label>

        <input
          value={form.contactNumber}
          onChange={(event) => setForm((prev) => ({ ...prev, contactNumber: event.target.value }))}
          placeholder="Contact number"
          className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
        />

        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Contact email"
          className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
        />

        <select
          value={form.visibility}
          onChange={(event) => setForm((prev) => ({ ...prev, visibility: event.target.value as (typeof VISIBILITY_OPTIONS)[number] }))}
          className="px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
        >
          {VISIBILITY_OPTIONS.map((option) => (
            <option key={option} value={option}>{formatOptionLabel(option)}</option>
          ))}
        </select>
      </div>

      <textarea
        required
        value={form.description}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        placeholder="Describe the resource need"
        className="w-full min-h-24 px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
      />

      <textarea
        value={form.remarks}
        onChange={(event) => setForm((prev) => ({ ...prev, remarks: event.target.value }))}
        placeholder="Additional remarks (optional)"
        className="w-full min-h-20 px-3 py-2 rounded-lg border border-[var(--gray-200)] text-sm"
      />

      {!isNeededByValid && (
        <p className="text-sm text-red-600">Needed by date must be after today.</p>
      )}

      <button
        type="submit"
        disabled={isMutatingResource || !canSubmit}
        className="px-4 py-2 rounded-lg bg-[var(--primary-purple)] text-white text-sm font-semibold disabled:opacity-70"
      >
        {isMutatingResource ? "Creating..." : "Create Resource Request"}
      </button>
    </form>
  );
}
