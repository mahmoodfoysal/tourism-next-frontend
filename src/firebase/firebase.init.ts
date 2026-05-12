"use client"

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebase.config";

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
export default app;
