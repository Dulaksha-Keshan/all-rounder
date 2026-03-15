"use client";

import { useEffect, useState } from "react";
import { Plus, X, Loader } from "lucide-react";
import { useSkillStore } from "@/context/useSkillStore";

interface ProfileSkillsSectionProps {
  isEditable?: boolean;
}

export default function ProfileSkillsSection({
  isEditable = false,
}: ProfileSkillsSectionProps) {
  const {
    allSkills,
    userSkills,
    fetchAllSkills,
    fetchUserSkills,
    addSkillToUser,
    removeSkillFromUser,
    isLoadingUserSkills,
    isLoadingAllSkills,
    isAddingSkill,
    isRemovingSkill,
    mutationError,
    clearSkillErrors,
  } = useSkillStore((state) => ({
    allSkills: state.allSkills,
    userSkills: state.userSkills,
    fetchAllSkills: state.fetchAllSkills,
    fetchUserSkills: state.fetchUserSkills,
    addSkillToUser: state.addSkillToUser,
    removeSkillFromUser: state.removeSkillFromUser,
    isLoadingUserSkills: state.isLoadingUserSkills,
    isLoadingAllSkills: state.isLoadingAllSkills,
    isAddingSkill: state.isAddingSkill,
    isRemovingSkill: state.isRemovingSkill,
    mutationError: state.mutationError,
    clearSkillErrors: state.clearSkillErrors,
  }));

  const [isAddingMode, setIsAddingMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillsToAdd, setSelectedSkillsToAdd] = useState<number[]>([]);

  // Fetch data on mount
  useEffect(() => {
    if (userSkills.length === 0 && !isLoadingUserSkills) {
      fetchUserSkills();
    }
    if (allSkills.length === 0 && !isLoadingAllSkills && isAddingMode) {
      fetchAllSkills();
    }
  }, [
    userSkills.length,
    isLoadingUserSkills,
    fetchUserSkills,
    allSkills.length,
    isLoadingAllSkills,
    fetchAllSkills,
    isAddingMode,
  ]);

  const userSkillIds = userSkills.map((s) => s.skill_id);
  const availableSkills = allSkills.filter(
    (skill) =>
      !userSkillIds.includes(skill.skill_id) &&
      skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSkill = async (skillId: number) => {
    await addSkillToUser(skillId);
    setSelectedSkillsToAdd((prev) =>
      prev.filter((id) => id !== skillId)
    );
  };

  const handleRemoveSkill = async (skillId: number) => {
    await removeSkillFromUser(skillId);
  };

  const handleSaveAddedSkills = async () => {
    for (const skillId of selectedSkillsToAdd) {
      await addSkillToUser(skillId);
    }
    setSelectedSkillsToAdd([]);
    setIsAddingMode(false);
    setSearchQuery("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#34365C]">Skills</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showcase your expertise and abilities
          </p>
        </div>
        {isEditable && !isAddingMode && (
          <button
            onClick={() => {
              setIsAddingMode(true);
              clearSkillErrors();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg font-medium hover:shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Skill
          </button>
        )}
      </div>

      {/* Error Message */}
      {mutationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-slideDown">
          {mutationError}
        </div>
      )}

      {/* Loading State */}
      {isLoadingUserSkills ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#8387CC]/20 border-t-[#8387CC] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Loading your skills...</p>
          </div>
        </div>
      ) : userSkills.length === 0 && !isAddingMode ? (
        <div className="py-12 flex flex-col items-center justify-center bg-gradient-to-br from-[#8387CC]/5 to-[#4169E1]/5 rounded-xl border-2 border-dashed border-[#8387CC]/20 animate-fadeIn">
          <div className="w-16 h-16 bg-[#8387CC]/10 rounded-full flex items-center justify-center mb-4">
            <Plus className="text-[#8387CC]" size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Skills Yet</h3>
          <p className="text-gray-500 text-center text-sm max-w-xs mb-4">
            Add skills to highlight what you're good at and attract connections
            with similar interests
          </p>
          {isEditable && (
            <button
              onClick={() => {
                setIsAddingMode(true);
                clearSkillErrors();
              }}
              className="px-5 py-2 bg-[#8387CC] text-white rounded-lg font-medium hover:bg-[#6B73C8] transition-colors active:scale-95"
            >
              Add Your First Skill
            </button>
          )}
        </div>
      ) : (
        /* Skills Grid */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {userSkills.map((skill, idx) => (
              <div
                key={skill.skill_id}
                style={{ animationDelay: `${idx * 50}ms` }}
                className="p-4 rounded-xl border-2 border-[#8387CC]/30 bg-gradient-to-br from-[#8387CC]/5 to-[#4169E1]/5 hover:border-[#8387CC] transition-all group relative animate-fadeIn"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#34365C] group-hover:text-[#8387CC] transition-colors">
                      {skill.skill_name}
                    </h3>
                    {skill.category && (
                      <p className="text-xs text-gray-500 mt-1.5">
                        {skill.category}
                      </p>
                    )}
                  </div>
                  {isEditable && (
                    <button
                      onClick={() => handleRemoveSkill(skill.skill_id)}
                      disabled={isRemovingSkill}
                      className="ml-2 p-1.5 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 active:scale-75"
                    >
                      {isRemovingSkill ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Skills Mode */}
      {isAddingMode && isEditable && (
        <div className="mt-6 pt-6 border-t border-gray-200 animate-slideDown">
          <h3 className="font-semibold text-[#34365C] mb-4">
            Add More Skills
          </h3>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#8387CC] text-gray-800"
            />
          </div>

          {/* Available Skills Grid */}
          {isLoadingAllSkills ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-[#8387CC]/20 border-t-[#8387CC] rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading skills...</p>
              </div>
            </div>
          ) : availableSkills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {allSkills.length === 0
                ? "No skills available"
                : "No more skills to add"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {availableSkills.map((skill) => {
                const isSelected = selectedSkillsToAdd.includes(skill.skill_id);
                return (
                  <button
                    key={skill.skill_id}
                    onClick={() =>
                      setSelectedSkillsToAdd((prev) =>
                        prev.includes(skill.skill_id)
                          ? prev.filter((id) => id !== skill.skill_id)
                          : [...prev, skill.skill_id]
                      )
                    }
                    className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                      isSelected
                        ? "border-[#8387CC] bg-[#8387CC]/10"
                        : "border-gray-200 bg-white hover:border-[#8387CC]/50"
                    }`}
                  >
                    <div className="font-medium text-[#34365C]">
                      {skill.skill_name}
                    </div>
                    {skill.category && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {skill.category}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setIsAddingMode(false);
                setSearchQuery("");
                setSelectedSkillsToAdd([]);
                clearSkillErrors();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAddedSkills}
              disabled={selectedSkillsToAdd.length === 0 || isAddingSkill}
              className="px-4 py-2 text-white bg-gradient-to-r from-[#8387CC] to-[#4169E1] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
            >
              {isAddingSkill ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${selectedSkillsToAdd.length > 0 ? `(${selectedSkillsToAdd.length})` : ""}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
