// Imports
import PageHeader from "@/components/PageHeader";
import OrderCard from "@/components/cart/OrderCard";
import ShopCartCard from "@/components/cart/ShopCartCard";
import AppStateContext from "@/contexts/AppStateContext";
import CartsContext from "@/contexts/CartsContext";
import cn from "@/utils/helpers/cn";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import {
  Card,
  Columns,
  ContentLayout,
  Header,
  Section,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { unique } from "radash";
import { useContext, useEffect } from "react";

/**
 * The Cart page displays the user’s Cart from `localStorage`.
 */
const CartPage: NextPage<{ userOrders: Order[] }> = ({ userOrders }) => {
  const { t } = useTranslation("cart");
  const { t: tx } = useTranslation("common");

  const { carts, orders } = useContext(CartsContext);

  const { setActiveNav } = useContext(AppStateContext);
  useEffect(() => setActiveNav("cart"), []);

  const { duration, easing } = useAnimationConfig();

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout>
        <Card
          appearance="filled"
          className={cn(`mx-4 !bg-primary-container px-4 py-3
            !text-on-primary-container sm:mx-0`)}
        >
          <Text type="body-medium" element="p" className="!font-medium">
            {t("pastOrdersNote")}
          </Text>
        </Card>
        <Section element="ul">
          <LayoutGroup id="shop">
            <AnimatePresence mode="popLayout" initial={false}>
              {carts?.length ? (
                carts.map((cart) => (
                  <ShopCartCard key={cart.shop.id} cart={cart} />
                ))
              ) : (
                <motion.div
                  layoutId="empty"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={transition(duration.medium2, easing.standard)}
                  className={cn(`relative isolate mx-4 box-content grid
                    h-[13rem] place-content-center overflow-hidden rounded-md
                    border-1 border-outline-variant px-4 py-3 sm:mx-0`)}
                >
                  <Text
                    type="body-medium"
                    element="p"
                    className="text-center text-on-surface-variant"
                  >
                    {t("cart.empty")}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </Section>
        <Section>
          <Header>{t("order.title")}</Header>
          {(orders || userOrders) && (orders?.length || userOrders?.length) ? (
            <Columns columns={2}>
              {unique(
                (orders || []).concat(userOrders || []),
                (order) => order.id,
              ).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </Columns>
          ) : (
            <Card appearance="outlined" className="px-4 py-3">
              {t("order.empty")}
            </Card>
          )}
        </Section>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const jimmy = await createJimmy(req);

  let userOrders: Order[] | null = null;

  if (jimmy.user) {
    const { data, error } = await jimmy.fetch<Order[]>("/orders", {
      query: {
        descendant_fetch_level: "compact",
        filter: { data: { buyer_ids: [jimmy.user.id] } },
      },
    });
    if (error) logError("/cart getServerSideProps", error);
    userOrders = data;
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "cart",
        "receipt",
      ])),
      userOrders,
    },
  };
};

export default CartPage;
