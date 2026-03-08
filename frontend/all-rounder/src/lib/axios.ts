import axios from 'axios';
import { auth } from '@/lib/firebase'; // Ensure this points to your Firebase initialization file

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Automatically attach Firebase ID token to requests
api.interceptors.request.use(
    async (config) => {
        // Grab the current user directly from the Firebase Client SDK
        const user = auth.currentUser;

        // Only attach the token if a user is locally logged into Firebase.
        // This naturally skips attaching a token for public routes like /register
        if (user) {
            // getIdToken() automatically refreshes the token behind the scenes if expired
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;