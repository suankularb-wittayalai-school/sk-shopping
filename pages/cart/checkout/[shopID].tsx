// Imports
import PageHeader from "@/components/PageHeader";
import CostCard from "@/components/cart/checkout/CostCard";
import DeliveryTypeCard from "@/components/cart/checkout/DeliveryTypeCard";
import PaymentMethodCard from "@/components/cart/checkout/PaymentMethodCard";
import CartsContext from "@/contexts/CartsContext";
import createJimmy from "@/utils/helpers/createJimmy";
import insertLocaleIntoStaticPaths from "@/utils/helpers/insertLocaleIntoStaticPaths";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { IDOnly, LangCode } from "@/utils/types/common";
import { Shop } from "@/utils/types/shop";
import {
  Card,
  Columns,
  ContentLayout,
  Text,
} from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useContext, useState } from "react";
import shortUUID from "short-uuid";

const FLAT_SHIPPING_COST_THB = 70;

const CheckoutPage: NextPage<{ shop: Shop }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();
  const { t: tx } = useTranslation("common");

  const { carts } = useContext(CartsContext);
  const cart = carts?.find((cart) => shop.id === cart.shop.id);

  const [deliveryType, setDeliveryType] = useState<
    "school_pickup" | "delivery"
  >(shop.is_school_pickup_allowed ? "school_pickup" : "delivery");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "prompt_pay">(
    shop.accept_promptpay ? "prompt_pay" : "cod",
  );

  const total = 0;

  async function handleSubmit() {}

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "สั่งซื้อสินค้า" })}</title>
      </Head>
      <PageHeader parentURL="/cart">สั่งซื้อสินค้า</PageHeader>
      <ContentLayout>
        <Text type="title-large" className="-mt-8 mb-4 ml-10">
          ร้านค้า{getLocaleString(shop.name)}
        </Text>
        <DeliveryTypeCard
          value={deliveryType}
          onChange={setDeliveryType}
          shop={shop}
          shippingCost={FLAT_SHIPPING_COST_THB}
        />
        <Columns columns={3} className="!items-stretch !gap-y-8">
          <CostCard
            items={cart?.items || []}
            deliveryType={"school_pickup"}
            shippingCost={FLAT_SHIPPING_COST_THB}
            total={total}
            className="sm:col-span-2"
          />
          <PaymentMethodCard
            value={paymentMethod}
            onChange={setPaymentMethod}
            onSubmit={handleSubmit}
          />
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const jimmy = await createJimmy();
  const { toUUID } = shortUUID();

  const shopID = toUUID(params!.shopID as string);
  const { data: shop, error } = await jimmy.fetch<Shop>(`/shops/${shopID}`);
  if (error) {
    logError("/checkout/:id getStaticProps", error);
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "checkout",
      ])),
      shop,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const jimmy = await createJimmy();
  const { fromUUID } = shortUUID();

  const { data: shops, error } = await jimmy.fetch<IDOnly[]>("/shops", {
    query: { fetch_level: "id_only" },
  });
  if (error) logError("/shop/:id getStaticPaths", error);

  return {
    paths: insertLocaleIntoStaticPaths(
      shops!.map((shop) => ({ params: { shopID: fromUUID(shop.id) } })),
    ),
    fallback: "blocking",
  };
};

export default CheckoutPage;
