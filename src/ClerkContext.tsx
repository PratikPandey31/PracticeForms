import { useAuth } from "@clerk/clerk-react";
import React, { createContext } from "react";
import type { ReactNode } from "react";

interface ClerkContextType {
  sessionClaims: any;
  isLoaded: boolean;
  isSignedIn: boolean;
}

export const ClerkContext = createContext<ClerkContextType | undefined>(undefined);

export const ClerkProvider = ({ children }: { children: ReactNode }) => {
  const { sessionClaims, isLoaded, isSignedIn } = useAuth();
  console.log("sessionClaims", sessionClaims);
  return (
    <ClerkContext.Provider value={{ sessionClaims, isLoaded: !!isLoaded, isSignedIn: !!isSignedIn }}>
      {children}
    </ClerkContext.Provider>
  );
}; 