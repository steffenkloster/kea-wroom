"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export default function ReactQueryProvider({
  children
}: {
  children: ReactNode;
}) {
  console.log("ReactQueryProvider rendering...");
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
