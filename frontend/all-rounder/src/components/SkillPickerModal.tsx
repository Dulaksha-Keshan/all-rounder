"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useSkillStore } from "@/context/useSkillStore";
import { useShallow } from "zustand/react/shallow";

interface SkillPickerModalProps {
  isOpen: boolean;
  onClose: (skipped?: boolean) => void;
  onComplete?: () => void;
}

export default function SkillPickerModal({
  isOpen,
  onClose,
  onComplete,
}: SkillPickerModalProps) {
  const {
    allSkills,
    userSkills,
    fetchAllSkills,
    fetchUserSkills,
    addSkillToUser,
    isLoadingAllSkills,
    mutationError,
    clearSkillErrors,
  } = useSkillStore(
    useShallow((state) => ({
      allSkills: state.allSkills,
      userSkills: state.userSkills,
      fetchAllSkills: state.fetchAllSkills,
      fetchUserSkills: state.fetchUserSkills,
      addSkillToUser: state.addSkillToUser,
      isLoadingAllSkills: state.isLoadingAllSkills,
      mutationError: state.mutationError,
      clearSkillErrors: state.clearSkillErrors,
    }))
  );

  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch skills on mount
  useEffect(() => {
    if (isOpen && allSkills.length === 0) {
      fetchAllSkills();
      fetchUserSkills();
    }
  }, [isOpen, allSkills.length, fetchAllSkills, fetchUserSkills]);

  // Initialize with already selected skills
  useEffect(() => {
    const userSkillIds = userSkills.map((s) => s.skill_id);
    setSelectedSkillIds(userSkillIds);
  }, [userSkills]);

  const filteredSkills = allSkills.filter((skill) =>
    skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userSkillIds = userSkills.map((s) => s.skill_id);
  const availableSkills = filteredSkills.filter(
    (skill) => !userSkillIds.includes(skill.skill_id)
  );

  const handleToggleSkill = (skillId: number) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
    clearSkillErrors();
  };

  const handleSaveSkills = async () => {
    setIsSaving(true);
    const newSkillIds = selectedSkillIds.filter(
      (id) => !userSkillIds.includes(id)
    );

    try {
      for (const skillId of newSkillIds) {
        await addSkillToUser(skillId);
      }
      setIsSaving(false);
      onComplete?.();
      onClose();
    } catch (error) {
      setIsSaving(false);
      console.error("Failed to save skills:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => onClose(true)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8387CC] to-[#4169E1] p-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add Your Skills</h2>
              <p className="text-sm text-white/80 mt-1">
                Choose skills that represent your expertise
              </p>
            </div>
            <button
              onClick={() => onClose(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#8387CC] text-gray-800"
              />
            </div>

            {/* Skills Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingAllSkills ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#8387CC]/20 border-t-[#8387CC] rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">Loading skills...</p>
                  </div>
                </div>
              ) : availableSkills.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500">
                      {allSkills.length === 0
                        ? "No skills available yet"
                        : "No skills match your search"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSkills.map((skill) => {
                    const isSelected = selectedSkillIds.includes(skill.skill_id);
                    return (
                      <button
                        key={skill.skill_id}
                        onClick={() => handleToggleSkill(skill.skill_id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-[#8387CC] bg-gradient-to-br from-[#8387CC]/10 to-[#4169E1]/10"
                            : "border-gray-200 bg-white hover:border-[#8387CC]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#34365C]">
                              {skill.skill_name}
                            </h3>
                            {skill.category && (
                              <p className="text-xs text-gray-500 mt-1">
                                {skill.category}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle2
                              size={20}
                              className="text-[#8387CC] flex-shrink-0 ml-2"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {mutationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {mutationError}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => onClose(true)}
                disabled={isSaving}
                className="px-6 py-2.5 text-gray-700 bg-white border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                Skip for Now
              </button>
              <button
                onClick={handleSaveSkills}
                disabled={selectedSkillIds.length === 0 || isSaving}
                className="px-6 py-2.5 text-white bg-gradient-to-r from-[#8387CC] to-[#4169E1] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  `Save ${selectedSkillIds.length > 0 ? `(${selectedSkillIds.length})` : ""}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
