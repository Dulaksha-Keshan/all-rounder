"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useOrganizationStore } from "@/context/useOrganizationStore";
import { Organization } from "@/app/_type/type";
import { Organizations } from "@/app/_data/data";

export default function EditOrganizationPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const router = useRouter();

  const { getOrganizationById, updateOrganization } = useOrganizationStore();
  const organization = getOrganizationById(organizationId as string);

  if (!organization) {
    return <p className="p-6 text-gray-500">Organization not found</p>;
  }

  const [name, setName] = useState(organization.name);
  const [location, setLocation] = useState(organization.location);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
<<<<<<< HEAD

    // TEMP: just log / later sync to store or API
    console.log("Updated:", { name, location });

=======
    // ✅ Save to store
    updateOrganization(organizationId as string, {
      name,
      location,
    });
>>>>>>> 895d0ee084ebd3576f49d616aec295f7ed1415e8
    router.push(`/user/organization/${organizationId}`);
  }

  return (
    <div className="bg-[#F6F5FF] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Edit Organization</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-indigo-100 shadow-md p-6 space-y-5"
        >
          <div>
            <label className="text-sm text-gray-500">Organization Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-2 text-sm"
            />
          </div>
           <div>
            <label className="text-sm text-gray-500">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-2 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-500 text-white rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
