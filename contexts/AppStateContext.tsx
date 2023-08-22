// Imports
import { TopLevelPageName } from "@/utils/types/common";
import { createContext } from "react";

/**
 * A context to read and control the state of the app.
 */
const AppStateContext = createContext<{
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  activeNav: TopLevelPageName;
  setActiveNav: (page: TopLevelPageName) => void;
}>({
  navOpen: false,
  setNavOpen: () => {},
  activeNav: "landing",
  setActiveNav: () => {},
});

export default AppStateContext;
