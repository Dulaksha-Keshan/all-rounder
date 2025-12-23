import * as admin from "firebase-admin";


let fireBaseAdmin: admin.app.App | null = null;

export function initializeFirebaseAdmin(): admin.app.App {

  if (fireBaseAdmin) {
    return fireBaseAdmin;
  }

  try {
    if (process.env.console.log)
  }
}
