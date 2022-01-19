import { useContext, createContext } from "react";

export const ZoneContext = createContext(null);

export function useZoneContext() {
  return useContext(ZoneContext);
}
