// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

    const firebaseConfigB = {
        apiKey: import.meta.env.VITE_FIREBASE_STORAGE_API_KEYB,
        authDomain: import.meta.env.VITE_FIREBASE_STORAGE_AUTH_DOMAINB,
        projectId: import.meta.env.VITE_FIREBASE_STORAGE_PROJECT_IDB,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKETB,
        messagingSenderId: import.meta.env.VITE_FIREBASE_STORAGE_MESSAGING_SENDER_IDB,
        appId: import.meta.env.VITE_FIREBASE_STORAGE_APP_IDB,
        measurementId: import.meta.env.VITE_FIREBASE_STORAGE_MEASUREMENT_IDB
      };


const appName = "STORAGE_APP";
const app = getApps().find(app => app.name === appName)
  ? getApp(appName)
  : initializeApp(firebaseConfigB, appName);

export const storage = getStorage(app);