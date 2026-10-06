// Browser-only Firebase Auth (Google). Config is public and served by the backend.
import type { Auth } from "firebase/auth";

let authPromise: Promise<Auth> | null = null;

export function getFirebaseAuth(config: { apiKey: string; authDomain: string; projectId: string }) {
  if (!authPromise) {
    authPromise = (async () => {
      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth } = await import("firebase/auth");
      const app = getApps()[0] ?? initializeApp(config);
      return getAuth(app);
    })();
  }
  return authPromise;
}
