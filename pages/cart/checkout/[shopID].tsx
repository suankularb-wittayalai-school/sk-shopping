// Imports
import PageHeader from "@/components/PageHeader";
import ContactInfoCard from "@/components/cart/checkout/ContactInfoCard";
import CostBreakdownCard from "@/components/cart/checkout/CostBreakdownCard";
import DeliveryTypeCard from "@/components/cart/checkout/DeliveryTypeCard";
import PaymentMethodCard from "@/components/cart/checkout/PaymentMethodCard";
import PromptPayDialog from "@/components/cart/checkout/PromptPayDialog";
import CartsContext from "@/contexts/CartsContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import createJimmy from "@/utils/helpers/createJimmy";
import insertLocaleIntoStaticPaths from "@/utils/helpers/insertLocaleIntoStaticPaths";
import { logError } from "@/utils/helpers/logError";
import useForm from "@/utils/helpers/useForm";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import useJimmy from "@/utils/helpers/useJimmy";
import {
  EMAIL_REGEX,
  THAI_PHONE_NUMBER_REGEX,
  THAI_ZIPCODE_REGEX,
} from "@/utils/regex";
import { Address } from "@/utils/types/address";
import { IDOnly, LangCode } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import { Shop } from "@/utils/types/shop";
import {
  Columns,
  ContentLayout,
  Snackbar,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { LayoutGroup, motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { omit } from "radash";
import { useContext, useState } from "react";
import shortUUID from "short-uuid";

/**
 * The amount to add to the total if shipping is needed. This is a flat value
 * Kornor has decided for Samarnmitr ‘66 to simplify things.
 */
const FLAT_SHIPPING_COST_THB = 70;

/**
 * The Checkout page lets the user double-check Items and choose delivery and
 * payment options before placing the Order.
 * 
 * @param shop The Shop this Checkout page is for. Used to decide with options to show.
 */
const CheckoutPage: NextPage<{ shop: Shop }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();
  const { t: tx } = useTranslation("common");

  const router = useRouter();
  const { setSnackbar } = useContext(SnackbarContext);
  const { duration, easing } = useAnimationConfig();

  const { carts, removeCart } = useContext(CartsContext);
  const cart = carts?.find((cart) => shop.id === cart.shop.id);

  const [deliveryType, setDeliveryType] = useState<
    "school_pickup" | "delivery"
  >(shop.is_school_pickup_allowed ? "school_pickup" : "delivery");
  const {
    form: address,
    formOK: addressOK,
    formProps: addressProps,
  } = useForm<"street_address" | "province" | "district" | "zip_code">([
    { key: "street_address", required: true },
    { key: "province", required: true },
    { key: "district", required: true },
    {
      key: "zip_code",
      validate: (value: string) => THAI_ZIPCODE_REGEX.test(value),
      required: true,
    },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "promptpay">(
    shop.accept_promptpay ? "promptpay" : "cod",
  );
  const {
    form: contactInfo,
    formOK: contactInfoOK,
    formProps: contactInfoProps,
  } = useForm<"name" | "email" | "tel">([
    { key: "name", required: true },
    {
      key: "email",
      validate: (value: string) => EMAIL_REGEX.test(value),
      required: true,
    },
    {
      key: "tel",
      validate: (value: string) => THAI_PHONE_NUMBER_REGEX.test(value),
    },
  ]);

  const jimmy = useJimmy();

  const [order, setOrder] = useState<Order>();
  const [promptPayOpen, setPromptPayOpen] = useState(false);

  const total =
    (cart?.items.reduce(
      (cum, { item, amount }) =>
        cum + (item.discounted_price || item.price) * amount,
      0,
    ) || 0) + (deliveryType === "delivery" ? FLAT_SHIPPING_COST_THB : 0);

  async function handleSubmit() {
    if (!cart) return;
    if (deliveryType === "delivery" && !addressOK) {
      setSnackbar(<Snackbar>ตรวจสอบข้อมูลที่อยู่ให้ถูกต้องครบถ้วน</Snackbar>);
      return;
    }

    if (!contactInfoOK) {
      setSnackbar(
        <Snackbar>ตรวจสอบว่าใส่ชื่อสกุลและที่อยู่อีเมลแล้ว</Snackbar>,
      );
      return;
    }

    const { data, error } = await jimmy.fetch("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            items: cart.items.map(({ item, amount }) => ({
              item_id: item.id,
              amount,
            })),
            delivery_type: deliveryType,
            address:
              deliveryType === "delivery"
                ? ({
                    ...omit(address, ["street_address"]),
                    street_address_line_1:
                      address.street_address.split("\n")[0],
                    street_address_line_2: address.street_address
                      .split("\n")
                      .slice(1)
                      .join("\n"),
                  } as Omit<Address, "id">)
                : null,
            receiver_name: contactInfo.name,
            payment_method: paymentMethod,
            contact_email: contactInfo.email,
            contact_phone_number: contactInfo.tel,
          },
        ],
      }),
    });
    if (error) {
      logError("handleSubmit", error);
      return;
    }
    if (paymentMethod === "promptpay") {
      setOrder((data as Order[])[0]);
      setPromptPayOpen(true);
    } else router.push("/cart");
  }

  async function handleSendSlip(file: File) {
    if (!order) return;

    // Upload slip file to the `orders` bucket on Supabase
    const filePath = [order.id, file.name.split(".").slice(-1)[0]].join(".");
    const { error: uploadError } = await jimmy.storage
      .from("orders")
      .upload(filePath, file);
    if (uploadError) {
      logError("handleSendSlip (upload)", { detail: uploadError.message });
      return;
    }

    // Update the Order to include a link to the slip file
    const { error: updateError } = await jimmy.fetch(
      `/orders/${order.id}/slip`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            payment_slip_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/orders/${filePath}`,
          },
        }),
      },
    );
    if (updateError) {
      logError("handleSendSlip (update)", updateError);
      return;
    }

    removeCart(shop.id);
    await router.push("/cart");
    setPromptPayOpen(false);
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
            addressProps={addressProps}
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
                disabled={!cart || cart.items.length === 0}
                onChange={setPaymentMethod}
                onSubmit={handleSubmit}
              />
              {order?.promptpay_qr_code_url && (
                <PromptPayDialog
                  src={order.promptpay_qr_code_url}
                  open={promptPayOpen}
                  onClose={() => setPromptPayOpen(false)}
                  onSubmit={handleSendSlip}
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
