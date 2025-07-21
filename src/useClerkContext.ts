import { useContext } from "react";
import { ClerkContext } from "./ClerkContext";

export const useClerkContext = () => {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error("useClerkContext must be used within a ClerkProvider");
  }
  return context;
}; 