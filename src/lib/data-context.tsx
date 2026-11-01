"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { DocumentInfo } from "@/data/documents";
import type { Scheme } from "./types";

/**
 * Makes scheme and document data available to every client component.
 * The root layout loads the data on the server (from Supabase or local files)
 * and passes it in here.
 */

type Data = { schemes: Scheme[]; documents: Record<string, DocumentInfo> };

const DataContext = createContext<Data | null>(null);

export function DataProvider({ schemes, documents, children }: Data & { children: ReactNode }) {
  return <DataContext.Provider value={{ schemes, documents }}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return {
    ...ctx,
    getScheme: (id: string) => ctx.schemes.find((s) => s.id === id),
  };
}
