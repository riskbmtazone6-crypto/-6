import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { Case, Evidence, TimelineEvent } from '../types';
import { INITIAL_CASES, INITIAL_EVIDENCE, INITIAL_TIMELINE } from './initialData';

const CASES_PATH = 'cases';

// Seed initial cases if empty
export async function seedInitialDataIfEmpty(): Promise<Case[]> {
  try {
    const snap = await getDocs(collection(db, CASES_PATH));
    if (snap.empty) {
      console.log('Seeding initial BMTA complaint data into Firestore...');
      for (const item of INITIAL_CASES) {
        await setDoc(doc(db, CASES_PATH, item.id), item);
      }
      // Also seed evidence and timeline for default CR-2026-00124
      for (const ev of INITIAL_EVIDENCE) {
        await setDoc(doc(db, `${CASES_PATH}/${ev.caseId}/evidence`, ev.id), ev);
      }
      for (const tm of INITIAL_TIMELINE) {
        await setDoc(doc(db, `${CASES_PATH}/${tm.caseId}/timeline`, tm.id), tm);
      }
      return INITIAL_CASES;
    }
    return snap.docs.map(d => d.data() as Case);
  } catch (error) {
    console.warn('Could not seed Firestore (might be unauthenticated or offline), using local initial data:', error);
    return INITIAL_CASES;
  }
}

// Subscribe to real-time cases
export function subscribeToCases(callback: (cases: Case[]) => void, onError?: (err: Error) => void) {
  try {
    const q = query(collection(db, CASES_PATH));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(INITIAL_CASES);
        } else {
          const list = snapshot.docs.map(d => d.data() as Case);
          callback(list);
        }
      },
      (error) => {
        console.warn('Snapshot error on cases, falling back to local state:', error);
        callback(INITIAL_CASES);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to cases:', err);
    callback(INITIAL_CASES);
    return () => {};
  }
}

// Create new case
export async function createCase(newCase: Case): Promise<void> {
  const path = `${CASES_PATH}/${newCase.id}`;
  try {
    await setDoc(doc(db, CASES_PATH, newCase.id), newCase);
    
    // Automatically create initial timeline entry
    const initialTimeline: TimelineEvent = {
      id: `tm-${Date.now()}`,
      caseId: newCase.id,
      title: `Complaint Logged via ${newCase.channel.toUpperCase()}`,
      description: `New complaint logged with ${newCase.priority.toUpperCase()} priority: ${newCase.subject}`,
      type: 'created',
      timestamp: new Date().toISOString(),
      author: auth.currentUser?.displayName || auth.currentUser?.email || 'Officer'
    };
    await setDoc(doc(db, `${CASES_PATH}/${newCase.id}/timeline`, initialTimeline.id), initialTimeline);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Update case
export async function updateCaseData(caseId: string, updates: Partial<Case>): Promise<void> {
  const path = `${CASES_PATH}/${caseId}`;
  try {
    const ref = doc(db, CASES_PATH, caseId);
    await updateDoc(ref, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Subscribe to Evidence
export function subscribeToEvidence(caseId: string, callback: (ev: Evidence[]) => void) {
  const path = `${CASES_PATH}/${caseId}/evidence`;
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty && caseId === 'CR-2026-00124') {
          callback(INITIAL_EVIDENCE);
        } else {
          callback(snapshot.docs.map(d => d.data() as Evidence));
        }
      },
      (err) => {
        console.warn('Evidence snapshot fallback:', err);
        callback(caseId === 'CR-2026-00124' ? INITIAL_EVIDENCE : []);
      }
    );
  } catch (e) {
    callback(caseId === 'CR-2026-00124' ? INITIAL_EVIDENCE : []);
    return () => {};
  }
}

// Add Evidence
export async function addEvidenceItem(caseId: string, evidence: Evidence): Promise<void> {
  const path = `${CASES_PATH}/${caseId}/evidence/${evidence.id}`;
  try {
    await setDoc(doc(db, `${CASES_PATH}/${caseId}/evidence`, evidence.id), evidence);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Evidence
export async function deleteEvidenceItem(caseId: string, evidenceId: string): Promise<void> {
  const path = `${CASES_PATH}/${caseId}/evidence/${evidenceId}`;
  try {
    await deleteDoc(doc(db, `${CASES_PATH}/${caseId}/evidence`, evidenceId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to Timeline
export function subscribeToTimeline(caseId: string, callback: (events: TimelineEvent[]) => void) {
  const path = `${CASES_PATH}/${caseId}/timeline`;
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty && caseId === 'CR-2026-00124') {
          callback(INITIAL_TIMELINE);
        } else {
          const list = snapshot.docs.map(d => d.data() as TimelineEvent);
          list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          callback(list);
        }
      },
      (err) => {
        console.warn('Timeline snapshot fallback:', err);
        callback(caseId === 'CR-2026-00124' ? INITIAL_TIMELINE : []);
      }
    );
  } catch (e) {
    callback(caseId === 'CR-2026-00124' ? INITIAL_TIMELINE : []);
    return () => {};
  }
}

// Add Timeline Event
export async function addTimelineEvent(caseId: string, event: TimelineEvent): Promise<void> {
  const path = `${CASES_PATH}/${caseId}/timeline/${event.id}`;
  try {
    await setDoc(doc(db, `${CASES_PATH}/${caseId}/timeline`, event.id), event);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
