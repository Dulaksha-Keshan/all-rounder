"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSchoolStore } from "@/context/useSchoolStore";
import { School } from "@/app/_type/type";

export default function EditSchoolPage() {
  // ✅ typed params (important)
  const { schoolId } = useParams<{ schoolId: string }>();
  const router = useRouter();


  const { getSchoolById, updateSchool } = useSchoolStore();
  const school = getSchoolById(schoolId as string);


  if (!school) {
    return <p className="p-6 text-gray-500">School not found</p>;
  }

  // ✅ controlled state
  const [name, setName] = useState(school.name);
  const [location, setLocation] = useState(school.location);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();


    // ✅ Save to store
    updateSchool(schoolId as string, {

      name,
      location,
    });

    // ✅ redirect back
    router.push(`/user/school/${schoolId}`);
  }

  return (
    <div className="bg-[#F6F5FF] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Edit School Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-indigo-100 shadow-md p-6 space-y-5"
        >
          {/* School Name */}
          <div>
            <label className="text-sm text-gray-500">School Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-gray-500">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => router.push(`/user/school/${schoolId}`)}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
