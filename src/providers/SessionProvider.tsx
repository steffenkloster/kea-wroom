"use client";

import React, { createContext, useContext } from "react";
import { Session } from "next-auth";

const SessionContext = createContext<Session | null>(null);

export const useSessionContext = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
