"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

// ==================== TYPES ====================
export interface Skill {
  skill_id: number;
  skill_name: string;
  category: string | null;
}

interface SkillState {
  // Data
  allSkills: Skill[];
  userSkills: Skill[];
  hasFetchedAllSkills: boolean;
  
  // Loading states
  isLoadingAllSkills: boolean;
  isLoadingUserSkills: boolean;
  isAddingSkill: boolean;
  isRemovingSkill: boolean;
  
  // Error states
  errorAllSkills: string | null;
  errorUserSkills: string | null;
  mutationError: string | null;
  
  // UI state
  selectedSkillId: number | null;

  // ==================== SELECTORS ====================
  userSkillIds: () => number[];
  availableSkillsForAdd: () => Skill[];
  hasSkill: (skillId: number) => boolean;

  // ==================== ACTIONS ====================
  fetchAllSkills: () => Promise<void>;
  fetchUserSkills: () => Promise<void>;
  addSkillToUser: (skillId: number) => Promise<void>;
  removeSkillFromUser: (skillId: number) => Promise<void>;
  setSelectedSkill: (skillId: number | null) => void;
  clearSkillErrors: () => void;
}

// ==================== STORE ====================
export const useSkillStore = create<SkillState>()(
  persist(
    (set, get) => ({
      // ==================== INITIAL STATE ====================
      allSkills: [],
      userSkills: [],
      hasFetchedAllSkills: false,
      isLoadingAllSkills: false,
      isLoadingUserSkills: false,
      isAddingSkill: false,
      isRemovingSkill: false,
      errorAllSkills: null,
      errorUserSkills: null,
      mutationError: null,
      selectedSkillId: null,

      // ==================== SELECTORS ====================
      userSkillIds: () => {
        return get().userSkills.map(s => s.skill_id);
      },

      availableSkillsForAdd: () => {
        const userSkillIds = get().userSkillIds();
        return get().allSkills.filter(skill => !userSkillIds.includes(skill.skill_id));
      },

      hasSkill: (skillId: number) => {
        return get().userSkills.some(s => s.skill_id === skillId);
      },

      // ==================== ACTIONS ====================
      fetchAllSkills: async () => {
        const { hasFetchedAllSkills, isLoadingAllSkills } = get();

        // Enforce one-time fetch to avoid repeated request loops from multiple mounted components.
        if (hasFetchedAllSkills || isLoadingAllSkills) {
          return;
        }

        set({ isLoadingAllSkills: true, errorAllSkills: null });
        try {
          const response = await api.get('/skills');
          set({
            allSkills: response.data.skills || [],
            hasFetchedAllSkills: true,
            isLoadingAllSkills: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Failed to fetch skills';
          set({ errorAllSkills: message, isLoadingAllSkills: false, hasFetchedAllSkills: true });
        }
      },

      fetchUserSkills: async () => {
        set({ isLoadingUserSkills: true, errorUserSkills: null });
        try {
          const response = await api.get('/skills/users');
          set({
            userSkills: response.data.skills || [],
            isLoadingUserSkills: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Failed to fetch your skills';
          set({ errorUserSkills: message, isLoadingUserSkills: false });
        }
      },

      addSkillToUser: async (skillId: number) => {
        set({ isAddingSkill: true, mutationError: null });
        
        // Optimistic update
        const skillToAdd = get().allSkills.find(s => s.skill_id === skillId);
        if (skillToAdd) {
          set((state) => ({
            userSkills: [...state.userSkills, skillToAdd],
          }));
        }

        try {
          await api.post('/skills/users', { skillId });
          set({ isAddingSkill: false });
        } catch (error: any) {
          // Revert optimistic update on error
          const message = error.response?.data?.message || error.message || 'Failed to add skill';
          set((state) => ({
            userSkills: state.userSkills.filter(s => s.skill_id !== skillId),
            mutationError: message,
            isAddingSkill: false,
          }));
        }
      },

      removeSkillFromUser: async (skillId: number) => {
        set({ isRemovingSkill: true, mutationError: null });
        
        // Optimistic update
        set((state) => ({
          userSkills: state.userSkills.filter(s => s.skill_id !== skillId),
        }));

        try {
          await api.delete('/skills/users', { data: { skillId } });
          set({ isRemovingSkill: false });
        } catch (error: any) {
          // Revert optimistic update on error
          const skillToReinstate = get().allSkills.find(s => s.skill_id === skillId);
          const message = error.response?.data?.message || error.message || 'Failed to remove skill';
          
          if (skillToReinstate) {
            set((state) => ({
              userSkills: [...state.userSkills, skillToReinstate],
              mutationError: message,
              isRemovingSkill: false,
            }));
          } else {
            set({ mutationError: message, isRemovingSkill: false });
          }
        }
      },

      setSelectedSkill: (skillId) => {
        set({ selectedSkillId: skillId });
      },

      clearSkillErrors: () => {
        set({
          errorAllSkills: null,
          errorUserSkills: null,
          mutationError: null,
        });
      },
    }),
    {
      name: 'skill-storage',
      partialize: (state) => ({
        userSkills: state.userSkills,
        allSkills: state.allSkills,
        hasFetchedAllSkills: state.hasFetchedAllSkills,
      }),
    }
  )
);
