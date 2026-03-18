import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

const globalForFirebase = globalThis as unknown as {
  firestore: Firestore | undefined
}

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    throw new Error(
      'Missing Firebase credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env file.'
    );
  }
}

export const db =
  globalForFirebase.firestore ??
  getFirestore();

if (process.env.NODE_ENV !== 'production') globalForFirebase.firestore = db;

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  DESIGNS: 'designs',
  FURNITURE_TEMPLATES: 'furnitureTemplates',
} as const;