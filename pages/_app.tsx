// Imports
import BlobDefinitions from "@/components/BlobDefinitions";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PageFallback from "@/components/error/PageFallback";
import IconDefinitions from "@/components/icon/IconDefintions";
import Layout from "@/components/Layout";
import AppStateContext from "@/contexts/AppStateContext";
import CartsContext from "@/contexts/CartsContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import "@/styles/globals.css";
import useCarts from "@/utils/helpers/useCarts";
import { TopLevelPageName } from "@/utils/types/common";
import { ThemeProvider } from "@suankularb-components/react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { MotionConfig } from "framer-motion";
import { appWithTranslation } from "next-i18next";
import PlausibleProvider from "next-plausible";
import { AppProps } from "next/app";
import {
  Fira_Code,
  IBM_Plex_Sans_Thai,
  Inter,
  Sarabun,
  Space_Grotesk,
} from "next/font/google";
import localFont from "next/font/local";
import { FC, ReactNode, useState } from "react";
import { Provider as BalancerProvider } from "react-wrap-balancer";

// English fonts
const bodyFontEN = Inter({ subsets: ["latin"] });
const displayFontEN = Space_Grotesk({ subsets: ["latin"] });

// Thai fonts
const bodyFontTH = Sarabun({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai"],
});
const displayFontTH = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai"],
});

// Mono font
const monoFont = Fira_Code({ subsets: ["latin"] });

// Icon font
const iconFont = localFont({
  src: "../public/fonts/material-symbols.woff2",
  weight: "100 700",
  style: "normal",
});

/**
 * To prevent the App component from being more of a triangle than it already
 * is, all the context providers are extracted into this component.
 *
 * @param children The app that uses contexts.
 *
 * @returns The app wrapped with context providers.
 */
const Contexts: FC<{ children: ReactNode }> = ({ children }) => {
  const [supabase] = useState(() => createPagesBrowserClient());
  const [snackbar, setSnackbar] = useState<JSX.Element | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<TopLevelPageName>("landing");
  const cartsContextValue = useCarts();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
        <AppStateContext.Provider
          value={{ navOpen, setNavOpen, activeNav, setActiveNav }}
        >
          <CartsContext.Provider value={cartsContextValue}>
            <BalancerProvider>{children}</BalancerProvider>
          </CartsContext.Provider>
        </AppStateContext.Provider>
      </SnackbarContext.Provider>
    </SessionContextProvider>
  );
};

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-body: -apple-system, BlinkMacSystemFont,
            ${bodyFontEN.style.fontFamily}, ${bodyFontTH.style.fontFamily};
          --font-display: ${displayFontEN.style.fontFamily},
            ${displayFontTH.style.fontFamily};
          --font-mono: ui-monospace, SFMono-Regular, SF Mono,
            ${monoFont.style.fontFamily}, ${bodyFontTH.style.fontFamily};
          --font-icon: ${iconFont.style.fontFamily};
        }
      `}</style>

      {/* Context providers */}
      <Contexts>
        {/* Framer Motion a11y */}
        <MotionConfig reducedMotion="user">
          {/* Plausible */}
          <PlausibleProvider
            domain="shopping.skkornor.org"
            taggedEvents
            revenue
          >
            {/* SKCom variables */}
            <ThemeProvider>
              {/* Rendered app */}
              <Layout>
                {/* Client-side error handling */}
                <ErrorBoundary fallback={PageFallback}>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Layout>
              {/* Symbol definitions */}
              <BlobDefinitions />
              <IconDefinitions />
            </ThemeProvider>
          </PlausibleProvider>
        </MotionConfig>
      </Contexts>
    </>
  );
}

export default appWithTranslation(App);
