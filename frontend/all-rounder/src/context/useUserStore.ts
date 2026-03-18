"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Teacher, Organization } from '@/app/_type/type';
import api from '@/lib/axios';
import { signInWithPopup, signInWithEmailAndPassword, onIdTokenChanged } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useSchoolStore } from "@/context/useSchoolStore";
import { usePostStore } from "@/context/usePostStore";

// Updated to match the exact roles your backend Express controller expects
type UserRole = 'STUDENT' | 'TEACHER' | 'SCHOOL_ADMIN' | 'ORG_ADMIN' | 'SUPER_ADMIN';

// Interface for the data your backend /register route expects
export interface RegisterPayload {
    email: string;
    password?: string; // Optional if you decide to separate this, but required for email/pass auth
    name: string;
    role: UserRole;
    grade?: string;
    contact_number?: string;
    gender?: string;
    schoolId?: string;
    organizationId?: string;
    verificationOption?: string;
    teacherName?: string,
    teacherEmail?: string,
    teacher_id?: string,
    dateOfBirth?: string;
    idtoken?: string;
}

type RegisterInput = RegisterPayload | FormData;

const isFormDataPayload = (payload: RegisterInput): payload is FormData => {
    return typeof FormData !== 'undefined' && payload instanceof FormData;
};

const getPayloadValue = (payload: RegisterInput, key: string): string | undefined => {
    if (isFormDataPayload(payload)) {
        const value = payload.get(key);
        return typeof value === 'string' ? value : undefined;
    }

    const value = payload[key as keyof RegisterPayload];
    return typeof value === 'string' ? value : undefined;
};

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



    // --- Real Backend Actions ---
    registerWithEmail: (data: RegisterInput) => Promise<void>;
    registerWithGoogle: (payload: RegisterInput) => Promise<void>;
    registerNewOrganization: (payload: FormData) => Promise<void>;
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

const clearAuthState = () => {
    useUserStore.setState({
        currentUser: null,
        userRole: null,
        isAuthenticated: false,
        error: null,
        following: [],
        followers: [],
        followRequests: [],
        sentRequests: [],
        isLoading: false
    });

    useSchoolStore.getState().setActiveSchool(null);
    usePostStore.getState().clearAll();

    if (typeof window !== 'undefined') {
        localStorage.removeItem('user-storage');
    }
};

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


            registerWithEmail: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post('/auth/register', data);

                    const email = getPayloadValue(data, 'email');
                    const password = getPayloadValue(data, 'password');
                    const verificationOption = getPayloadValue(data, 'verificationOption');

                    // Auto-login is skipped for verification-first flows (DOCUMENT / TEACHER_REQUEST / ADMIN_APPROVAL).
                    if (email && password && !verificationOption) {
                        await get().loginWithEmail(email, password);
                    }
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed' });
                } finally {
                    set({ isLoading: false });
                }
            },

            registerWithGoogle: async (payload) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/register', payload);
                    const userData = response.data.user;

                    if (userData) {
                        set({
                            currentUser: userData,
                            userRole: userData.userType || (getPayloadValue(payload, 'role') as UserRole),
                            isAuthenticated: true,
                            error: null
                        });
                    } else {
                        // Registration may return a queued/pending verification response without a session user payload.
                        set({ error: null });
                    }
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Google Registration failed' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },
            registerNewOrganization: async (payload: FormData) => {
                set({ isLoading: true, error: null });
                try {
                    // This hits the specific endpoint for creating an org + admin simultaneously
                    const response = await api.post('/organization/', payload);

                    // Assuming your backend logs them in or returns the user data here.
                    // If your backend JUST creates the org and requires them to log in separately,
                    // we can adjust this to call get().loginWithEmail() automatically.
                    const userData = response.data.admin; // Adjust based on your backend's exact return object

                    if (userData) {
                        set({
                            currentUser: userData,
                            userRole: "ORG_ADMIN",
                            isAuthenticated: true,
                            error: null
                        });
                    }
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Organization registration failed' });
                    throw error;
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
                    const response = await api.post('/auth/google-signin', {
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

            fetchBackendProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/users/');
                    const userData = response.data.user;

                    if (userData.school_id) {
                        const schoolStore = useSchoolStore.getState();

                        let matchingSchool = schoolStore.schools.find(s => s.school_id === userData.school_id);

                        if (!matchingSchool) {
                            try {
                                const schoolRes = await api.get(`/schools/${userData.school_id}`);
                                matchingSchool = schoolRes.data.school; // Matches your getSchoolById controller
                            } catch (err) {
                                console.warn("Could not fetch the specific school for the user:", err);
                            }
                        }

                        // 3. Set it if we successfully found/fetched it
                        if (matchingSchool) {
                            schoolStore.setActiveSchool(matchingSchool);
                        }
                    }

                    set({
                        currentUser: userData,
                        userRole: response.data.userType,
                        isAuthenticated: true,
                        error: null
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch profile' });
                } finally {
                    set({ isLoading: false });
                }
            },

            // --- 5. LOGOUT ---
            logout: async () => {
                set({ isLoading: true, error: null });

                // Safe-call the backend to revoke tokens
                try { await api.post('/auth/logout'); }
                catch (err) { console.warn("Backend logout issue:", err); }

                // Safe-call Firebase to sign out locally
                try { await auth.signOut(); }
                catch (err) { console.warn("Firebase logout issue:", err); }

                // Keep Zustand auth state in sync with Firebase session state.
                clearAuthState();
            },

            updateProfile: async (updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch('/users/', updates);
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
            partialize: (state) => ({
                currentUser: state.currentUser,
                userRole: state.userRole,
                isAuthenticated: state.isAuthenticated,
                following: state.following,
                followers: state.followers,
                followRequests: state.followRequests,
                sentRequests: state.sentRequests,
            })
        }
    )
);

let isFirebaseAuthSyncInitialized = false;

const initializeFirebaseAuthSync = () => {
    if (typeof window === 'undefined' || isFirebaseAuthSyncInitialized) {
        return;
    }

    isFirebaseAuthSyncInitialized = true;

    onIdTokenChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
            clearAuthState();
            return;
        }

        try {
            const token = await firebaseUser.getIdToken();
            if (!token) {
                clearAuthState();
                return;
            }

            const state = useUserStore.getState();
            if (!state.isAuthenticated || !state.currentUser) {
                await state.fetchBackendProfile();
            }
        } catch (error) {
            console.warn("Firebase token sync failed, clearing local auth state:", error);
            clearAuthState();
        }
    });
};

initializeFirebaseAuthSync();