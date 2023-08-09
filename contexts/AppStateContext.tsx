// Imports
import { createContext } from "react";

/**
 * A context to read and control the state of the app.
 */
const AppStateContext = createContext<{
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}>({ navOpen: false, setNavOpen: () => {} });

export default AppStateContext;
