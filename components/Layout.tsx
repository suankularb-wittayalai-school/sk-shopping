// Imports
import AppStateContext from "@/contexts/AppStateContext";
import CartsContext from "@/contexts/CartsContext";
import LogoImage from "@/public/images/logo.svg";
import useLocale from "@/utils/helpers/useLocale";
import { useOneTapSignin } from "@/utils/helpers/useOneTapSignin";
import usePageIsLoading from "@/utils/helpers/usePageIsLoading";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
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
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion, useAnimationControls } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode, useContext, useEffect } from "react";

/**
 * A Root Layout with persistent components.
 *
 * @param children The content of the page.
 *
 * @returns A Root Layout.
 */
const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const locale = useLocale();
  const refreshProps = useRefreshProps();
  const { t } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  // Google One Tap
  useOneTapSignin();

  // Navigation Bar and Drawer
  const { navOpen, setNavOpen, activeNav, setActiveNav } =
    useContext(AppStateContext);
  const { carts, totalItemCount } = useContext(CartsContext);
  const cartNavItemControls = useAnimationControls();
  useEffect(() => {
    if (activeNav === "cart") return;
    if (!carts || carts.length === 0) return;
    cartNavItemControls.start({
      scaleX: [2, 1],
      scaleY: [0.8, 1],
      opacity: [0, 1],
      transition: transition(duration.medium4, easing.standardDecelerate),
    });
  }, [carts]);

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
        end={
          <NavBarItem
            icon={<MaterialIcon icon="translate" />}
            label={t("navigation.language")}
            onClick={() => {
              const newLocale = locale === "en-US" ? "th" : "en-US";
              refreshProps({ locale: newLocale });
            }}
          />
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
        <motion.div animate={cartNavItemControls}>
          <NavBarItem
            icon={<MaterialIcon icon="shopping_cart" />}
            label={t("navigation.cart")}
            badge={totalItemCount || undefined}
            selected={activeNav === "cart"}
            onClick={() => setActiveNav("cart")}
            href="/cart"
            element={Link}
          />
        </motion.div>
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
