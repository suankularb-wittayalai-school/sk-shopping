// Imports
import LogoImage from "@/public/images/logo.svg";
import usePageIsLoading from "@/utils/helpers/usePageIsLoading";
import { useSnackbar } from "@/utils/helpers/useSnackbar";
import {
  Interactive,
  MaterialIcon,
  NavBar,
  NavBarItem,
  NavDrawer,
  NavDrawerItem,
  NavDrawerSection,
  Progress,
  RootLayout,
  Snackbar,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
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
        <NavDrawerSection header={t("appName")}>
          <NavDrawerItem
            icon={<MaterialIcon icon="storefront" />}
            label={t("navigation.landing")}
            selected={router.asPath === "/"}
            href="/"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="category" />}
            label={t("navigation.categories")}
            selected={router.asPath.startsWith("/categories")}
            href="/categories"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="shopping_cart" />}
            label={t("navigation.cart")}
            selected={router.asPath.startsWith("/cart")}
            href="/cart"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="star" />}
            label={t("navigation.favorites")}
            selected={router.asPath.startsWith("/favorites")}
            href="/favorites"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="account_circle" />}
            label={t("navigation.account")}
            selected={router.asPath.startsWith("/account")}
            href="/account"
            element={Link}
          />
        </NavDrawerSection>
      </NavDrawer>

      {/* Navigation Bar/Rail */}
      <NavBar
        brand={
          <Interactive
            shadowEffect
            href="/"
            element={Link}
            className="dark block rounded-sm"
          >
            <Image
              src={LogoImage}
              priority
              alt=""
              className="rounded-[inherit] transition-[border-radius]"
            />
          </Interactive>
        }
        onNavToggle={() => setNavOpen(true)}
      >
        <NavBarItem
          icon={<MaterialIcon icon="storefront" />}
          label={t("navigation.landing")}
          selected={router.asPath === "/"}
          href="/"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="category" />}
          label={t("navigation.categories")}
          selected={router.asPath.startsWith("/categories")}
          href="/categories"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="shopping_cart" />}
          label={t("navigation.cart")}
          selected={router.asPath.startsWith("/cart")}
          href="/cart"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="star" />}
          label={t("navigation.favorites")}
          selected={router.asPath.startsWith("/favorites")}
          href="/favorites"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="account_circle" />}
          label={t("navigation.account")}
          selected={router.asPath.startsWith("/account")}
          href="/account"
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
