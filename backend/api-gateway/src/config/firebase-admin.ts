import admin from "firebase-admin";

let fireBaseAdmin: admin.app.App | null = (admin.apps?.length ?? 0) > 0 ? admin.app() : null;

export function initializeFirebaseAdmin(): admin.app.App {
  //If there is a instance of the app return it 
  if (fireBaseAdmin) {
    return fireBaseAdmin;
  }

  try {
    // Validate environment variables
    if (!process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Missing Firebase configuration in environment variables');
    }

    // intializing the Firebase Admin
    fireBaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });

    console.log('Firebase Admin  initialized successfully');

    return fireBaseAdmin;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }

}

//Exporting the admin app 
export function getFirebaseAdmin(): admin.app.App {
  if (!fireBaseAdmin) {
    return initializeFirebaseAdmin();
  }
  return fireBaseAdmin;
}

//main firebase fucntions for common usage 
export const firebaseAuth = {

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await getFirebaseAdmin().auth().verifyIdToken(idToken);

      return decodedToken;
    } catch (error) {
      throw new Error("Invalid token or expired token ");
    }

  },


  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {

    try {
      return await getFirebaseAdmin().auth().getUser(uid);
    } catch (error) {
      throw new Error(`User not found: ${uid}`)
    }

  },

  async getUserByemail(email: string): Promise<admin.auth.UserRecord> {

    try {
      return await getFirebaseAdmin().auth().getUserByEmail(email);
    } catch (error) {
      throw new Error(`User not found: ${email}`)
    }

  },

  async createUser(email: string, password: string, displayName?: string): Promise<admin.auth.UserRecord> {

    try {
      return await getFirebaseAdmin().auth().createUser({
        email,
        password,
        displayName: displayName ? displayName : "",
        emailVerified: false
      })
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        throw new Error('Email already exists');
      }
      throw new Error('Failed to create user');
    }
  },

  async updateUser(uid: string, updates: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> {
    try {
      return await getFirebaseAdmin().auth().updateUser(uid, updates);
    } catch (error) {
      throw new Error('Failed to update user');
    }
  },

  async deleteUser(uid: string): Promise<void> {
    try {
      await getFirebaseAdmin().auth().deleteUser(uid);
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  },

  async setCustomClaims(uid: string, claims: object): Promise<void> {

    try {
      await getFirebaseAdmin().auth().setCustomUserClaims(uid, claims);
    } catch (error) {
      throw new Error(`Custom Claims set for user: ${uid}, \n${claims}`)
    }

  },

  async generateEmailVerificationLink(email: string): Promise<string> {
    try {
      const link = await getFirebaseAdmin().auth().generateEmailVerificationLink(email);
      return link;
    } catch (error) {
      throw new Error('Failed to generate email verification link');
    }
  },

  async generatePasswordResetLink(email: string): Promise<string> {
    try {
      const link = await getFirebaseAdmin().auth().generatePasswordResetLink(email);
      return link;
    } catch (error) {
      throw new Error('Failed to generate password reset link');
    }
  },

  async revokeRefreshTokens(uid: string): Promise<void> {
    try {
      await getFirebaseAdmin().auth().revokeRefreshTokens(uid);
      console.log(`Refresh tokens revoked for user: ${uid}`);
    } catch (error) {
      throw new Error('Failed to revoke refresh tokens');
    }
  },

}
