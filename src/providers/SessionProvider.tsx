"use client";

import React, { createContext, useContext } from "react";
import { JWT } from "next-auth/jwt";

const SessionContext = createContext<JWT | null>(null);

export const useSessionContext = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({
  children,
  session
}: {
  children: React.ReactNode;
  session: JWT | null;
}) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
