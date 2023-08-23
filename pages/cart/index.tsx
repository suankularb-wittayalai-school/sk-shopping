// Imports
import PageHeader from "@/components/PageHeader";
import OrderCard from "@/components/cart/OrderCard";
import ShopCartCard from "@/components/cart/ShopCartCard";
import AppStateContext from "@/contexts/AppStateContext";
import CartsContext from "@/contexts/CartsContext";
import cn from "@/utils/helpers/cn";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import { useOneTapSignin } from "@/utils/helpers/useOneTapSignin";
import { IDOnly, LangCode } from "@/utils/types/common";
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
import Balancer from "react-wrap-balancer";

/**
 * The Cart page displays the user’s Cart from `localStorage`.
 */
const CartPage: NextPage<{
  userOrders: Order[];
  managingShops: IDOnly[];
}> = ({ userOrders, managingShops }) => {
  const { t } = useTranslation("cart");
  const { t: tx } = useTranslation("common");

  const jimmy = useJimmy();
  useOneTapSignin({ parentButtonID: "button-google-sign-in" });

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
                  <ShopCartCard
                    key={cart.shop.id}
                    cart={cart}
                    userIsManager={Boolean(
                      managingShops?.find((shop) => cart.shop.id === shop.id),
                    )}
                  />
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
            <Card
              appearance="outlined"
              className="flex min-h-[12.5rem] flex-col items-center justify-center gap-3 px-4 py-3"
            >
              <motion.p
                layout="position"
                transition={transition(duration.medium4, easing.standard)}
                className="text-center text-on-surface-variant"
              >
                <Text type="body-medium">
                  <Balancer>{t("order.empty")}</Balancer>
                </Text>
              </motion.p>
              {jimmy.user.status !== "authenticated" && (
                <div
                  id="button-google-sign-in"
                  className={cn(`h-[38px] rounded-full [color-scheme:light]
                    [&:not(:has(iframe))]:w-56
                    [&:not(:has(iframe))]:animate-pulse
                    [&:not(:has(iframe))]:bg-surface-variant`)}
                />
              )}
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
  let managingShops: IDOnly[] | null = null;

  if (jimmy.user) {
    const { data: orders, error: ordersError } = await jimmy.fetch<Order[]>(
      "/orders",
      {
        query: {
          descendant_fetch_level: "compact",
          filter: { data: { buyer_ids: [jimmy.user.id] } },
          sorting: { by: ["created_at"], ascending: false },
        },
      },
    );
    if (ordersError) logError("/cart getServerSideProps (orders)", ordersError);
    userOrders =
      orders?.filter(
        (order) =>
          !(
            order.shipment_status === "canceled" ||
            (order.payment_method === "promptpay" && !order.is_paid)
          ),
      ) || null;

    const { data: shops, error: shopsError } = await jimmy.fetch<IDOnly[]>(
      `/shops`,
      { query: { filter: { data: { manager_ids: [jimmy.user.id] } } } },
    );
    if (shopsError) logError("/cart getServerSideProps (shops)", shopsError);
    if (shops) managingShops = shops;
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "cart",
        "receipt",
      ])),
      userOrders,
      managingShops,
    },
  };
};

export default CartPage;
