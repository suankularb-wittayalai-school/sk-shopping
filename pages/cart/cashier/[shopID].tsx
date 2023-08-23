// Imports
import PageHeader from "@/components/PageHeader";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { Shop } from "@/utils/types/shop";
import { UserDetailed } from "@/utils/types/user";
import { Columns, ContentLayout, Text } from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import shortUUID from "short-uuid";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import CostBreakdownCard from "@/components/cart/checkout/CostBreakdownCard";
import CartsContext from "@/contexts/CartsContext";
import { useContext, useState } from "react";
import cart from "..";
import PaymentMethodCard from "@/components/cart/checkout/PaymentMethodCard";
import { Order, PaymentMethod } from "@/utils/types/order";

/**
 * The Checkout as Cashier page is a modified version of the Checkout page
 * only used by cashiers at point of sale. It restricts receiver name to the
 * Cashier’s and the Delivery Type to School Pickup, and allows Cash as a
 * Payment Method. `is_paid` is dictated by the Cashier’s input.
 *
 * @param shop The Shop this Checkout page is for. Used to decide with options to show.
 */
const CheckoutAsCashierPage: NextPage<{ shop: Shop }> = ({ shop }) => {
  const { t } = useTranslation("checkout");
  const { t: tx } = useTranslation("common");

  const getLocaleString = useGetLocaleString();

  const { carts, removeCart, addOrder } = useContext(CartsContext);
  const cart = carts?.find((cart) => shop.id === cart.shop.id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pos_cash");

  const [order, setOrder] = useState<Order>();
  const [promptPayOpen, setPromptPayOpen] = useState(false);

  const total =
    cart?.items.reduce(
      (cum, { item, amount }) =>
        cum + (item.discounted_price || item.price) * amount,
      0,
    ) || 0;

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {}

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Checkout as cashier" })}</title>
      </Head>
      <PageHeader parentURL="/cart">Checkout as cashier</PageHeader>
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
            value={paymentMethod}
            shop={{ ...shop, accept_cod: false }}
            loading={loading}
            disabled={order !== undefined || !cart || cart.items.length === 0}
            onChange={setPaymentMethod}
            onSubmit={handleSubmit}
          />
        </Columns>
      </ContentLayout>
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
  if (userError) logError("/account getServerSideProps", userError);

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

