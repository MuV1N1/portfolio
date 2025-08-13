import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  getFirestore,
  collection as fsCollection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyD4YxO3qc5jGYYnmQblgl6PYpnZwU9HfbM",
  authDomain: "portfolio-1b0ec.firebaseapp.com",
  projectId: "portfolio-1b0ec",
  storageBucket: "portfolio-1b0ec.firebasestorage.app",
  messagingSenderId: "262173057284",
  appId: "1:262173057284:web:2975e3300f01c121a03051",
  measurementId: "G-15264DP83F"
};


export class FirebaseClient {
  private app = initializeApp(firebaseConfig);
  private authInstance = getAuth(this.app);
  private db = getFirestore(this.app);
  private _isAuthenticated = false;

  constructor() {
    onAuthStateChanged(this.authInstance, (user) => {
      this._isAuthenticated = !!user;
    });
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  auth() {
    return {
      clear: () => signOut(this.authInstance),
    } as const;
  }

  collection(name: string) {
    if (name === 'users') {
      return {
        authWithPassword: (email: string, password: string) =>
          signInWithEmailAndPassword(this.authInstance, email, password),
      } as const;
    }
    return {} as const;
  }

  async getFullList(collectionName: string, params: { sort?: string } = {}) {
    const colRef = fsCollection(this.db, collectionName);
    let q = colRef as any;

    if (params.sort) {
      const field = params.sort.replace(/^[-+]/, '');
      const direction = params.sort.startsWith('-') ? 'desc' : 'asc';
      q = query(colRef, orderBy(field as any, direction as any));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, any>) }));
  }

  async getOne(collectionName: string, id: string) {
    const ref = doc(this.db, collectionName, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Document not found');
    return { id: snap.id, ...(snap.data() as Record<string, any>) } as any;
  }

  async create(collectionName: string, data: any) {
    const colRef = fsCollection(this.db, collectionName);
    const res = await addDoc(colRef, data);
    const snap = await getDoc(res);
    return { id: res.id, ...(snap.data() as Record<string, any>) } as any;
  }

  async update(collectionName: string, id: string, data: any) {
    const ref = doc(this.db, collectionName, id);
    await updateDoc(ref, data);
    const snap = await getDoc(ref);
    return { id: snap.id, ...(snap.data() as Record<string, any>) } as any;
  }

  async delete(collectionName: string, id: string) {
    const ref = doc(this.db, collectionName, id);
    await deleteDoc(ref);
  }
}
