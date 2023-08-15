// Imports
import PageHeader from "@/components/PageHeader";
import ContactInfoCard from "@/components/cart/checkout/ContactInfoCard";
import CostBreakdownCard from "@/components/cart/checkout/CostBreakdownCard";
import DeliveryTypeCard from "@/components/cart/checkout/DeliveryTypeCard";
import PaymentMethodCard from "@/components/cart/checkout/PaymentMethodCard";
import PromptPayDialog from "@/components/cart/checkout/PromptPayDialog";
import CartsContext from "@/contexts/CartsContext";
import createJimmy from "@/utils/helpers/createJimmy";
import insertLocaleIntoStaticPaths from "@/utils/helpers/insertLocaleIntoStaticPaths";
import { logError } from "@/utils/helpers/logError";
import useForm from "@/utils/helpers/useForm";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { EMAIL_REGEX, THAI_PHONE_NUMBER_REGEX } from "@/utils/regex";
import { IDOnly, LangCode } from "@/utils/types/common";
import { Shop } from "@/utils/types/shop";
import {
  Columns,
  ContentLayout,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { LayoutGroup, motion } from "framer-motion";
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

  const { duration, easing } = useAnimationConfig();

  const { carts } = useContext(CartsContext);
  const cart = carts?.find((cart) => shop.id === cart.shop.id);

  const [deliveryType, setDeliveryType] = useState<
    "school_pickup" | "delivery"
  >(shop.is_school_pickup_allowed ? "school_pickup" : "delivery");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "prompt_pay">(
    shop.accept_promptpay ? "prompt_pay" : "cod",
  );
  const { form: contactInfo, formProps: contactInfoProps } = useForm<
    "email" | "tel"
  >([
    { key: "email", validate: (value: string) => EMAIL_REGEX.test(value) },
    {
      key: "tel",
      validate: (value: string) => THAI_PHONE_NUMBER_REGEX.test(value),
    },
  ]);

  const [promptPayOpen, setPromptPayOpen] = useState(false);

  const total = 0;

  async function handleSubmit() {
    if (paymentMethod === "prompt_pay") setPromptPayOpen(true);
  }

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "สั่งซื้อสินค้า" })}</title>
      </Head>
      <PageHeader parentURL="/cart">สั่งซื้อสินค้า</PageHeader>
      <ContentLayout>
        <Text
          type="title-large"
          className="-mt-6 mb-4 ml-[3.25rem] sm:-mt-8 sm:ml-10"
        >
          ร้านค้า{getLocaleString(shop.name)}
        </Text>
        <LayoutGroup>
          <DeliveryTypeCard
            value={deliveryType}
            onChange={setDeliveryType}
            shop={shop}
            shippingCost={FLAT_SHIPPING_COST_THB}
            className="mx-4 sm:mx-0"
          />
          <motion.div
            layout="position"
            transition={transition(duration.medium4, easing.standard)}
          >
            <Columns
              columns={4}
              className="mx-4 !items-stretch !gap-y-8 sm:mx-0"
            >
              <CostBreakdownCard
                items={cart?.items || []}
                deliveryType={deliveryType}
                shippingCost={FLAT_SHIPPING_COST_THB}
                total={total}
                className="sm:col-span-2"
              />
              <ContactInfoCard formProps={contactInfoProps} />
              <PaymentMethodCard
                value={paymentMethod}
                onChange={setPaymentMethod}
                onSubmit={handleSubmit}
              />
              {shop.promptpay_number && (
                <PromptPayDialog
                  total={total}
                  promptpayNumber={shop.promptpay_number}
                  open={promptPayOpen}
                  onClose={() => setPromptPayOpen(false)}
                  onSubmit={() => setPromptPayOpen(false)}
                />
              )}
            </Columns>
          </motion.div>
        </LayoutGroup>
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
