"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Teacher, Organization } from '@/app/_type/type';
import api from '@/lib/axios';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Updated to match the exact roles your backend Express controller expects
type UserRole = 'STUDENT' | 'TEACHER' | 'SCHOOL_ADMIN' | 'ORG_ADMIN' | 'SUPER_ADMIN';

// Interface for the data your backend /register route expects
export interface RegisterPayload {
    email: string;
    password?: string; // Optional if you decide to separate this, but required for email/pass auth
    name: string;
    role: UserRole;
    grade?: string;
    schoolId?: string;
    organizationId?: string;
    verificationOption?: string;
    dateOfBirth: string; 
}

interface UserState {
    currentUser: Student | Teacher | Organization | any | null; 
    userRole: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Social State
    following: string[];
    followers: string[];
    followRequests: string[];
    sentRequests: string[];

    // --- Legacy / Dummy Action ---
    // Kept so your existing UI components don't break during the transition
    login: (user: Student | Teacher | Organization | any, role: UserRole) => Promise<void>;
    
    // --- Real Backend Actions ---
    registerWithEmail: (data: RegisterPayload) => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (role: UserRole, schoolId?: string, organizationId?: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchBackendProfile: () => Promise<void>;
    updateProfile: (updates: Partial<Student | Teacher | Organization | any>) => Promise<void>;
    setError: (error: string | null) => void;

    // Social Actions
    followUser: (userId: string) => Promise<void>;
    unfollowUser: (userId: string) => Promise<void>;
    sendFollowRequest: (userId: string) => Promise<void>;
    cancelFollowRequest: (userId: string) => Promise<void>;
    acceptFollowRequest: (userId: string) => Promise<void>;
    declineFollowRequest: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            currentUser: null,
            userRole: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Initial Social State
            following: [],
            followers: [],
            followRequests: [], 
            sentRequests: [],

            // --- LEGACY DUMMY LOGIN ---
            login: async (user, role) => {
                set({ isLoading: true, error: null });
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    set({
                        currentUser: user,
                        userRole: role,
                        isAuthenticated: true,
                        error: null
                    });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            // --- 1. REGISTRATION (Aligned with router.post('/register')) ---
            registerWithEmail: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    // 1. Send data to your API Gateway to create the user in Firebase Admin and PostgreSQL
                    await api.post('/register', data);
                    
                    // 2. If successful, automatically log them into the local Firebase Client SDK
                    if (data.password) {
                        await get().loginWithEmail(data.email, data.password);
                    }
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed' });
                } finally {
                    set({ isLoading: false });
                }
            },

            // --- 2. EMAIL/PASSWORD LOGIN ---
            loginWithEmail: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    // 1. Log into Firebase Client SDK. This sets the local session.
                    await signInWithEmailAndPassword(auth, email, password);
                    
                    // 2. Now that Firebase is logged in, fetch the full profile from PostgreSQL.
                    // The Axios interceptor will automatically attach the new token.
                    await get().fetchBackendProfile();
                } catch (error: any) {
                    set({ error: error.message || 'Login failed' });
                    throw error; // Rethrow if you want to handle it in the UI
                } finally {
                    set({ isLoading: false });
                }
            },

            // --- 3. GOOGLE SIGN IN (Aligned with router.post('/google-signin')) ---
            loginWithGoogle: async (role, schoolId, organizationId) => {
                set({ isLoading: true, error: null });
                try {
                    // 1. Trigger Google Popup via Firebase
                    const result = await signInWithPopup(auth, googleProvider);
                    
                    // 2. Grab the raw ID token directly from the Firebase result
                    const idtoken = await result.user.getIdToken();

                    // 3. Send token and role data to API Gateway
                    const response = await api.post('/google-signin', {
                        idtoken,
                        role,
                        schoolId,
                        organizationId
                    });

                    const userData = response.data.user;

                    // 4. Update Zustand state with the data from PostgreSQL
                    set({
                        currentUser: userData,
                        userRole: userData.userType || role, 
                        isAuthenticated: true,
                        error: null
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.response?.data?.error || error.message || 'Google Sign-In failed' });
                    throw error; // Rethrow if you want to handle it in the UI
                } finally {
                    set({ isLoading: false });
                }
            },

            // --- 4. GET CURRENT USER (Aligned with router.get('/me')) ---
            fetchBackendProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    // The Axios interceptor automatically attaches the Firebase token
                    const response = await api.get('/me'); 
                    
                    const userData = response.data.user;

                    set({
                        currentUser: userData,
                        userRole: userData.userType, 
                        isAuthenticated: true,
                        error: null
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch profile' });
                } finally {
                    set({ isLoading: false });
                }
            },

            // --- 5. LOGOUT (Aligned with router.post('/logout')) ---
            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    // 1. Tell API Gateway to revoke refresh tokens via Firebase Admin
                    // We do this first so the interceptor can still attach the token
                    await api.post('/logout'); 
                    
                    // 2. Clear the local Firebase session
                    await auth.signOut();
                    
                    // 3. Clear Zustand store
                    set({
                        currentUser: null,
                        userRole: null,
                        isAuthenticated: false,
                        error: null,
                        following: [],
                        followers: [],
                        followRequests: [],
                        sentRequests: []
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Logout failed' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateProfile: async (updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put('/user/profile', updates);
                    const updatedUser = response.data;

                    set((state) => ({
                        currentUser: state.currentUser ? { ...state.currentUser, ...updatedUser } : null
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update profile' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setError: (error) => set({ error }),

            // --- SOCIAL ACTIONS (Kept identical to your original logic) ---
            followUser: async (userId) => {
                set((state) => ({ following: [...state.following, userId] }));
                try {
                    await api.post(`/user/follow/${userId}`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to follow user' });
                    set((state) => ({ following: state.following.filter(id => id !== userId) }));
                }
            },

            unfollowUser: async (userId) => {
                set((state) => ({ following: state.following.filter(id => id !== userId) }));
                try {
                    await api.delete(`/user/follow/${userId}`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to unfollow user' });
                    set((state) => ({ following: [...state.following, userId] }));
                }
            },

            sendFollowRequest: async (userId) => {
                set((state) => ({ sentRequests: [...state.sentRequests, userId] }));
                try {
                    await api.post(`/user/follow-request/${userId}`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to send follow request' });
                    set((state) => ({ sentRequests: state.sentRequests.filter(id => id !== userId) }));
                }
            },

            cancelFollowRequest: async (userId) => {
                set((state) => ({ sentRequests: state.sentRequests.filter(id => id !== userId) }));
                try {
                    await api.delete(`/user/follow-request/${userId}`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to cancel follow request' });
                    set((state) => ({ sentRequests: [...state.sentRequests, userId] }));
                }
            },

            acceptFollowRequest: async (userId) => {
                set((state) => ({
                    followers: [...state.followers, userId],
                    followRequests: state.followRequests.filter(id => id !== userId)
                }));
                try {
                    await api.post(`/user/follow-request/${userId}/accept`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to accept follow request' });
                }
            },

            declineFollowRequest: async (userId) => {
                set((state) => ({ followRequests: state.followRequests.filter(id => id !== userId) }));
                try {
                    await api.post(`/user/follow-request/${userId}/decline`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to decline follow request' });
                }
            },
        }),
        {
            name: 'user-storage',
        }
    )
);