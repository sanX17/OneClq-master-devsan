"use client";

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

let app: any;
let auth: any;
let db: any;
let storage: any;

function initializeFirebase() {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.error(
      "Firebase configuration is missing. Please check your .env.local file.",
    );
    return;
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Use emulators in development
  // if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  //   try {
  //     connectAuthEmulator(auth, "http://localhost:9099", {
  //       disableWarnings: true,
  //     });
  //     connectFirestoreEmulator(db, "localhost", 8080);
  //     connectStorageEmulator(storage, "localhost", 9199);
  //   } catch (error) {
  //     // Emulators already connected
  //   }
  // }
}

// Initialize on first access
export function getFirebaseAuth() {
  if (!auth) initializeFirebase();
  return auth;
}

export function getFirestoreDb() {
  if (!db) initializeFirebase();
  return db;
}

export function getFirebaseStorage() {
  if (!storage) initializeFirebase();
  return storage;
}

export { getAuth, getFirestore, getStorage };
