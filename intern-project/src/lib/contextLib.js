import { useContext, createContext } from "react";

// Zone Viewer Context
export const ZoneContext = createContext(null);

export function useZoneContext() {
  return useContext(ZoneContext);
}

// Zone Compare Context
export const CompareContext = createContext(null);

export function useCompareContext() {
  return useContext(ZoneContext);
}
