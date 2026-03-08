import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// 1. Load the config from your environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Initialize Firebase (with a Next.js safety check)
// Next.js hot-reloads during development. If we just call initializeApp(), 
// Next.js will try to initialize Firebase multiple times and throw an error.
// This checks if an app already exists before creating a new one.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// 4. Set up the Google Auth Provider for your login flow
const googleProvider = new GoogleAuthProvider();
// Optional: You can add custom scopes here if you need access to specific Google APIs later
// googleProvider.addScope('profile');
// googleProvider.addScope('email');

// 5. Export them so you can use them across your app
export { app, auth, googleProvider };