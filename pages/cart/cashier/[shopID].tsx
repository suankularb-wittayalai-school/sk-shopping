// Imports
import PageHeader from "@/components/PageHeader";
import CostBreakdownCard from "@/components/cart/checkout/CostBreakdownCard";
import POSCashDialog from "@/components/cart/checkout/POSCashDialog";
import PaymentMethodCard from "@/components/cart/checkout/PaymentMethodCard";
import PromptPayDialog from "@/components/cart/checkout/PromptPayDialog";
import CartsContext from "@/contexts/CartsContext";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import useJimmy from "@/utils/helpers/useJimmy";
import { LangCode } from "@/utils/types/common";
import { Order, PaymentMethod } from "@/utils/types/order";
import { Shop } from "@/utils/types/shop";
import { User, UserDetailed } from "@/utils/types/user";
import { Columns, ContentLayout, Text } from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import shortUUID from "short-uuid";

/**
 * The Checkout as Cashier page is a modified version of the Checkout page
 * only used by cashiers at point of sale. It restricts receiver name to the
 * Cashier’s and the Delivery Type to School Pickup, and allows Cash as a
 * Payment Method. `is_paid` is dictated by the Cashier’s input.
 *
 * @param shop The Shop this Checkout page is for. Used to decide with options to show.
 */
const CheckoutAsCashierPage: NextPage<{
  shop: Shop;
  user: User;
}> = ({ shop, user }) => {
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("checkout");
  const { t: tx } = useTranslation("common");

  const { fromUUID } = shortUUID();

  const jimmy = useJimmy();
  const plausible = usePlausible();
  const router = useRouter();

  const { carts, removeCart, addOrder } = useContext(CartsContext);
  const cart = carts?.find((cart) => shop.id === cart.shop.id);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pos_cash");

  const [order, setOrder] = useState<Order>();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const total =
    cart?.items.reduce(
      (cum, { item, amount }) =>
        cum + (item.discounted_price || item.price) * amount,
      0,
    ) || 0;

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!cart) return;
    setLoading(true);

    const { data, error } = await jimmy.fetch<Order[]>("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            items: cart.items.map(({ item, amount }) => ({
              item_id: item.id,
              amount,
            })),
            delivery_type: "pos",
            receiver_name: [user.first_name, user.last_name].join(" "),
            payment_method: paymentMethod,
            contact_email: user.email,
          },
        ],
      }),
    });
    if (error) {
      logError("handleSubmit", error);
      setLoading(false);
      return;
    }

    setOrder(data[0]);
    setPaymentOpen(true);
    setLoading(false);
  }

  async function handlePaymentComplete() {
    if (!order) return;
    removeCart(shop.id);
    addOrder(order);
    plausible("Sales", {
      props: {
        role: "Cashier",
        method: paymentMethod === "pos_cash" ? "Cash on location" : "PromptPay",
        shop: getLocaleString(shop.name, "en-US"),
      },
      revenue: { currency: "THB", amount: total },
    });
    router.push(`/order/${fromUUID(order.id)}/print/receipt`);
  }

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title.cashier") })}</title>
      </Head>
      <PageHeader parentURL="/cart">{t("title.cashier")}</PageHeader>
      <ContentLayout>
        <Text
          type="title-large"
          className="-mt-6 mb-4 ml-[3.25rem] sm:-mt-8 sm:ml-10"
        >
          {t("subtitle", { shop: getLocaleString(shop.name) })}
        </Text>
        <Columns columns={3} className="mx-4 !items-stretch !gap-y-8 sm:mx-0">
          <CostBreakdownCard
            items={cart?.items || []}
            deliveryType="school_pickup"
            total={total}
            className="md:col-span-2"
          />
          <PaymentMethodCard
            role="cashier"
            value={paymentMethod}
            shop={{ ...shop, accept_cod: false }}
            loading={loading}
            disabled={order !== undefined || !cart || cart.items.length === 0}
            onChange={setPaymentMethod}
            onSubmit={handleSubmit}
          />
        </Columns>
      </ContentLayout>
      {order &&
        (paymentMethod === "pos_cash" ? (
          <POSCashDialog
            order={order}
            open={paymentOpen}
            onClose={() => {
              setPaymentOpen(false);
              setOrder(undefined);
            }}
            onSubmit={handlePaymentComplete}
          />
        ) : (
          <PromptPayDialog
            order={order}
            open={paymentOpen}
            onClose={() => setPaymentOpen(false)}
            onSubmit={handlePaymentComplete}
          />
        ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
}) => {
  const jimmy = await createJimmy(req);
  const { toUUID } = shortUUID();

  const shopID = toUUID(params!.shopID as string);
  const { data: shop, error } = await jimmy.fetch<Shop>(`/shops/${shopID}`);
  if (error) {
    logError("/checkout/:id getServerSideProps", error);
    return { notFound: true };
  }

  const { data: user, error: userError } = await jimmy.fetch<UserDetailed>(
    "/auth/user",
    { query: { fetch_level: "detailed" } },
  );
  if (userError) {
    logError("/account getServerSideProps", userError);
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "address",
        "checkout",
        "receipt",
      ])),
      shop,
      user,
    },
  };
};

export default CheckoutAsCashierPage;

