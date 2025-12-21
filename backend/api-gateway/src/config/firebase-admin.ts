import * as admin from 'firebase-admin';

// Singleton pattern - only initialize once
let firebaseAdmin: admin.app.App | null = null;

export function initializeFirebaseAdmin(): admin.app.App {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  try {
    // Validate environment variables
    if (!process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Missing Firebase configuration in environment variables');
    }

    firebaseAdmin = admin.initializeApp(
      {
        credential: admin.credential.cert(
          {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),

          }),
      }
    );

    console.info("Firebase Admin SDK is initialized sucessfully");
    return firebaseAdmin;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin", error);
    throw error;
  }
}


export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseAdmin) {
    return initializeFirebaseAdmin();
  }
  return firebaseAdmin;
}

