"use client";

import React, { createContext, useContext, useState } from "react";
import { JWT } from "next-auth/jwt";

interface SessionContextType {
  session: JWT | null; // Adjust this to your session type
  setSession: (session: JWT | null) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider = ({
  children,
  token
}: {
  children: React.ReactNode;
  token: JWT | null;
}) => {
  const [session, setSession] = useState<JWT | null>(token);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};
