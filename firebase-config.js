// Firebase Configuration
// Replace these values with your actual Firebase project config
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// For development - connect to Firebase emulators (optional)
// Uncomment the lines below if you want to use Firebase emulators for local development
/*
if (location.hostname === 'localhost') {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
}
*/

// Firebase helper functions
export class FirebaseService {
    constructor() {
        this.db = db;
        this.auth = auth;
        this.storage = storage;
    }

    // Collections
    getCollection(collectionName) {
        return collection(this.db, collectionName);
    }

    // Documents
    getDocument(collectionName, docId) {
        return doc(this.db, collectionName, docId);
    }

    // Create or update document
    async setDocument(collectionName, docId, data) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            await setDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            return { success: true, id: docId };
        } catch (error) {
            console.error('Error setting document:', error);
            return { success: false, error: error.message };
        }
    }

    // Get document
    async getDocument(collectionName, docId) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { success: true, data: docSnap.data() };
            } else {
                return { success: false, error: 'Document not found' };
            }
        } catch (error) {
            console.error('Error getting document:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all documents from a collection
    async getCollection(collectionName) {
        try {
            const querySnapshot = await getDocs(collection(this.db, collectionName));
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: documents };
        } catch (error) {
            console.error('Error getting collection:', error);
            return { success: false, error: error.message };
        }
    }

    // Add document to collection
    async addDocument(collectionName, data) {
        try {
            const docRef = await addDoc(collection(this.db, collectionName), {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error adding document:', error);
            return { success: false, error: error.message };
        }
    }

    // Update document
    async updateDocument(collectionName, docId, data) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
            return { success: true, id: docId };
        } catch (error) {
            console.error('Error updating document:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete document
    async deleteDocument(collectionName, docId) {
        try {
            const docRef = doc(this.db, collectionName, docId);
            await deleteDoc(docRef);
            return { success: true, id: docId };
        } catch (error) {
            console.error('Error deleting document:', error);
            return { success: false, error: error.message };
        }
    }

    // Real-time listener
    subscribeToDocument(collectionName, docId, callback) {
        const docRef = doc(this.db, collectionName, docId);
        return onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                callback({ success: true, data: doc.data() });
            } else {
                callback({ success: false, error: 'Document not found' });
            }
        });
    }

    // Real-time collection listener
    subscribeToCollection(collectionName, callback) {
        const collectionRef = collection(this.db, collectionName);
        return onSnapshot(collectionRef, (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            callback({ success: true, data: documents });
        });
    }

    // Authentication helpers
    async signInWithEmail(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Error signing in:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            await signOut(this.auth);
            return { success: true };
        } catch (error) {
            console.error('Error signing out:', error);
            return { success: false, error: error.message };
        }
    }

    // Get current user
    getCurrentUser() {
        return this.auth.currentUser;
    }

    // Listen to auth state changes
    onAuthStateChanged(callback) {
        return onAuthStateChanged(this.auth, callback);
    }
}

// Import required Firebase functions
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot,
    query,
    where,
    orderBy,
    limit
} from 'firebase/firestore';

import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';

// Create and export Firebase service instance
export const firebaseService = new FirebaseService();