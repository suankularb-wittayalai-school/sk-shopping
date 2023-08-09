// Imports
import cn from "@/utils/helpers/cn";
import usePageIsLoading from "@/utils/helpers/usePageIsLoading";
import { useSnackbar } from "@/utils/helpers/useSnackbar";
import {
  MaterialIcon,
  NavBar,
  NavBarItem,
  NavDrawer,
  NavDrawerItem,
  NavDrawerSection,
  Progress,
  RootLayout,
  Snackbar,
  Text,
} from "@suankularb-components/react";
import { Trans, useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, useState } from "react";

/**
 * A Root Layout with persistent components.
 * 
 * @param children The content of the page.
 * 
 * @returns A Root Layout.
 */
const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation("common");

  // Navigation Bar and Drawer
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  // Root Layout
  const pageIsLoading = usePageIsLoading();

  // Snackbar
  const { snackbarOpen, setSnackbarOpen, snackbarProps } = useSnackbar();

  return (
    <RootLayout>
      {/* Navigation Drawer */}
      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)}>
        {/* Top-level pages */}
        <NavDrawerSection
          header={
            <Text type="headline-small" className="!tracking-tighter">
              <Trans
                i18nKey="brand.logoText"
                ns="common"
                components={[
                  <span key={0} />,
                  <span
                    key={1}
                    className={cn(`bg-gradient-to-r from-primary to-secondary
                      bg-clip-text font-bold text-transparent`)}
                  />,
                ]}
              />
            </Text>
          }
          alt="SK Components"
        >
          <NavDrawerItem
            icon={<MaterialIcon icon="home" />}
            label={t("navigation.home")}
            selected={router.pathname === "/"}
            href="/"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="login" />}
            label={t("navigation.login")}
            selected={router.pathname === "/account/login"}
            href="/account/login"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="info" />}
            label={t("navigation.about")}
            selected={router.pathname === "/about"}
            href="/about"
            element={Link}
          />
        </NavDrawerSection>

        {/* Insert more Navigation Drawer Sections as your app expand. */}
      </NavDrawer>

      {/* Navigation Bar/Rail */}
      <NavBar
        brand={
          <Image
            src="/images/logo.svg"
            priority
            width={56}
            height={56}
            alt=""
          />
        }
        onNavToggle={() => setNavOpen(true)}
      >
        <NavBarItem
          icon={<MaterialIcon icon="home" />}
          label={t("navigation.home")}
          selected={/^\/$/.test(router.asPath)}
          href="/"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="login" />}
          label={t("navigation.login")}
          selected={/^\/account\/login/.test(router.asPath)}
          href="/account/login"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="info" />}
          label={t("navigation.about")}
          selected={/^\/about/.test(router.asPath)}
          href="/about"
          element={Link}
        />
      </NavBar>

      {/* Page loading indicator */}
      <Progress
        appearance="linear"
        alt={t("pageIsLoading")}
        visible={pageIsLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        {...snackbarProps!}
      />

      {/* Content */}
      {children}
    </RootLayout>
  );
};

export default Layout;
