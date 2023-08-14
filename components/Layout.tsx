// Imports
import AppStateContext from "@/contexts/AppStateContext";
import CartsContext from "@/contexts/CartsContext";
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
import { FC, ReactNode, useContext } from "react";

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
  const { totalItemCount } = useContext(CartsContext);
  const { navOpen, setNavOpen, activeNav, setActiveNav } =
    useContext(AppStateContext);

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
            selected={activeNav === "landing"}
            onClick={() => setActiveNav("landing")}
            href="/"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="category" />}
            label={t("navigation.categories")}
            selected={activeNav === "categories"}
            onClick={() => setActiveNav("categories")}
            href="/category/t-shirt"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="shopping_cart" />}
            label={t("navigation.cart")}
            selected={activeNav === "cart"}
            onClick={() => setActiveNav("cart")}
            href="/cart"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="star" />}
            label={t("navigation.favorites")}
            selected={activeNav === "favorites"}
            onClick={() => setActiveNav("favorites")}
            href="/favorites"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="account_circle" />}
            label={t("navigation.account")}
            selected={activeNav === "account"}
            onClick={() => setActiveNav("account")}
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
        className="!backdrop-blur-lg"
      >
        <NavBarItem
          icon={<MaterialIcon icon="storefront" />}
          label={t("navigation.landing")}
          selected={activeNav === "landing"}
          onClick={() => setActiveNav("landing")}
          href="/"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="category" />}
          label={t("navigation.categories")}
          selected={activeNav === "categories"}
          onClick={() => setActiveNav("categories")}
          href="/category/t-shirt"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="shopping_cart" />}
          label={t("navigation.cart")}
          badge={totalItemCount}
          selected={activeNav === "cart"}
          onClick={() => setActiveNav("cart")}
          href="/cart"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="star" />}
          label={t("navigation.favorites")}
          selected={activeNav === "favorites"}
          onClick={() => setActiveNav("favorites")}
          href="/favorites"
          element={Link}
        />
        <NavBarItem
          icon={<MaterialIcon icon="account_circle" />}
          label={t("navigation.account")}
          selected={activeNav === "account"}
          onClick={() => setActiveNav("account")}
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
