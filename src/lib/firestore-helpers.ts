import { db, COLLECTIONS } from './db';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Helper utilities for Firebase Firestore operations
 */

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export function timestampToDate(timestamp: Timestamp | Date | undefined): Date | undefined {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
}

/**
 * Serialize Firestore data for JSON response
 * Converts Timestamps to ISO strings
 */
export function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) return data;
  
  if (data instanceof Timestamp) {
    return data.toDate().toISOString();
  }
  
  if (Array.isArray(data)) {
    return data.map(serializeFirestoreData);
  }
  
  if (typeof data === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeFirestoreData(value);
    }
    return serialized;
  }
  
  return data;
}

/**
 * Check if a user exists by email
 */
export async function userExistsByEmail(email: string): Promise<boolean> {
  const usersRef = db.collection(COLLECTIONS.USERS);
  const snapshot = await usersRef.where('email', '==', email).limit(1).get();
  return !snapshot.empty;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
  if (!userDoc.exists) return null;
  return { id: userDoc.id, ...userDoc.data() };
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const usersRef = db.collection(COLLECTIONS.USERS);
  const snapshot = await usersRef.where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;
  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() };
}

/**
 * Get all designs for a user
 */
export async function getDesignsByUserId(userId: string) {
  const designsRef = db.collection(COLLECTIONS.DESIGNS);
  const snapshot = await designsRef
    .where('userId', '==', userId)
    .orderBy('updatedAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Get a specific design by ID and verify ownership
 */
export async function getDesignByIdAndUserId(designId: string, userId: string) {
  const designDoc = await db.collection(COLLECTIONS.DESIGNS).doc(designId).get();
  
  if (!designDoc.exists) return null;
  
  const designData = designDoc.data();
  if (designData?.userId !== userId) return null;
  
  return { id: designDoc.id, ...designData };
}

/**
 * Delete a design by ID (with ownership check)
 */
export async function deleteDesignByIdAndUserId(designId: string, userId: string): Promise<boolean> {
  const design = await getDesignByIdAndUserId(designId, userId);
  if (!design) return false;
  
  await db.collection(COLLECTIONS.DESIGNS).doc(designId).delete();
  return true;
}
