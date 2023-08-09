// Imports
import SnackbarContext from "@/contexts/SnackbarContext";
import { SnackbarProps } from "@suankularb-components/react";
import { useContext, useEffect, useState } from "react";

/**
 * This hook interacts with the {@link SnackbarContext Snackbar Context}. The
 * returns can be used to control a Snackbar at Root Layout.
 *
 * @returns
 * `snackbarOpen` — If the Snackbar should be open;
 * `setSnackbarOpen` — Sets the state that should control if the Snackbar is open;
 * `snackbarProps` — The current props for Snackbar.
 */
export function useSnackbar() {
  const { snackbar } = useContext(SnackbarContext);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>();

  const showSnackbarAndWait = () => {
    setSnackbarProps(snackbar!.props);
    setSnackbarOpen(true);
    visibilityTimer = setTimeout(() => setSnackbarOpen(false), 6000);
  };

  let exitWait: NodeJS.Timeout;
  let visibilityTimer: NodeJS.Timeout;
  useEffect(() => {
    if (!snackbar) return;

    clearTimeout(exitWait);
    clearTimeout(visibilityTimer);

    if (snackbarOpen) {
      setSnackbarOpen(false);
      exitWait = setTimeout(showSnackbarAndWait, 200);
    } else showSnackbarAndWait();

    return () => {
      clearTimeout(exitWait);
      clearTimeout(visibilityTimer);
    };
  }, [snackbar]);

  return {
    /**
     * If the Snackbar should be open.
     */
    snackbarOpen,

    /**
     * Sets the state that should control if the Snackbar is open.
     */
    setSnackbarOpen,

    /**
     * The current props for Snackbar.
     */
    snackbarProps,
  };
}
