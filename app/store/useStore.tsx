import { useSelector } from "react-redux";
import type { RootState } from "./store";

export const useStore = <K extends keyof RootState>(section: K) => {
  return useSelector((state: RootState) => state[section]);
};
