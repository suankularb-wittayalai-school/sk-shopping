// Imports
import PageHeader from "@/components/PageHeader";
import ManageShopTabs from "@/components/account/manage/ManageShopTabs";
import OptionAllowCard from "@/components/account/manage/OptionAllowCard";
import AppStateContext from "@/contexts/AppStateContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import useForm from "@/utils/helpers/useForm";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import useJimmy from "@/utils/helpers/useJimmy";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { IDOnly, LangCode } from "@/utils/types/common";
import { Shop } from "@/utils/types/shop";
import {
  Card,
  Columns,
  ContentLayout,
  Header,
  Section,
  Snackbar,
  Text,
  TextField,
} from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useContext, useEffect } from "react";
import shortUUID from "short-uuid";

/**
 * The Customize Shop page allows Shop Managers to customize details about
 * their Shop, like name, logo, colors, and delivery and payment options.
 *
 * @param shop The Shop to customize.
 */
const CustomizeShopPage: NextPage<{ shop: Shop }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("manage", { keyPrefix: "customize" });
  const { t: tx } = useTranslation(["common", "manage"]);

  const refreshProps = useRefreshProps();
  const jimmy = useJimmy();

  const { setSnackbar } = useContext(SnackbarContext);

  const { setActiveNav } = useContext(AppStateContext);
  useEffect(() => setActiveNav("account"), []);

  const { form, setForm, formProps } = useForm<
    | "is_school_pickup_allowed"
    | "pickup_location"
    | "is_delivery_allowed"
    | "accept_promptpay"
    | "promptpay_number"
    | "accept_cod"
  >([
    {
      key: "is_school_pickup_allowed",
      defaultValue: shop.is_school_pickup_allowed,
    },
    { key: "pickup_location", defaultValue: shop.pickup_location },
    { key: "is_delivery_allowed", defaultValue: shop.is_delivery_allowed },
    { key: "accept_promptpay", defaultValue: shop.accept_promptpay },
    { key: "promptpay_number", defaultValue: shop.promptpay_number },
    { key: "accept_cod", defaultValue: shop.accept_cod },
  ]);

  // Save the form data when a toggle has changed
  useEffect(() => {
    if (
      form.is_school_pickup_allowed === shop.is_school_pickup_allowed &&
      form.is_delivery_allowed === shop.is_delivery_allowed &&
      form.accept_promptpay === shop.accept_promptpay &&
      form.accept_cod === shop.accept_cod
    )
      return;
    handleSave();
  }, [
    form.is_school_pickup_allowed,
    form.is_delivery_allowed,
    form.accept_promptpay,
    form.accept_cod,
  ]);

  /**
   * Saves the form data to the database.
   */
  async function handleSave() {
    const { error } = await jimmy.fetch(`/shops/${shop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: form }),
    });
    if (error) {
      logError("handleSave", error);
      return;
    }
    setSnackbar(<Snackbar>บันทึกการแก้ไขแล้ว</Snackbar>);
    refreshProps();
  }

  return (
    <>
      <Head>
        <title>
          {tx("tabName", {
            tabName: t("title", {
              ns: "manage",
              shop: getLocaleString(shop.name),
            }),
          })}
        </title>
      </Head>
      <PageHeader parentURL="/account">
        {tx("title", { ns: "manage", shop: getLocaleString(shop.name) })}
      </PageHeader>
      <ContentLayout>
        <ManageShopTabs shopID={shop.id} />

        {/* Name, logo, colors */}
        <Section>
          <Header>เกี่ยวกับร้านค้า</Header>
          <Card
            appearance="outlined"
            className="!grid h-48 place-content-center"
          >
            <Text type="body-medium" className="text-center">
              การแก้ไขข้อมูลเกี่ยวกับร้านค้าจะมาเร็ว ๆ นี้
            </Text>
          </Card>
        </Section>

        {/* Payment and delivery options */}
        <Section>
          <Header>การตั้งค่าการสั่งซื้อ</Header>

          {/* School Pickup */}
          <OptionAllowCard
            label="ให้ลูกค้าสามารถรับสินค้าที่โรงเรียนได้"
            value={form.is_school_pickup_allowed}
            onChange={(is_school_pickup_allowed) =>
              setForm({ ...form, is_school_pickup_allowed })
            }
          >
            <Columns columns={3} className="pb-9">
              <TextField
                appearance="outlined"
                label="ตำแหน่งรับสินค้า"
                helperMsg="หากผู้ใช้เลือกที่จะรับสินค้าที่โรงเรียน ให้ลูกค้าไปรับที่นี่"
                inputAttr={{ onBlurCapture: handleSave }}
                {...formProps.pickup_location}
              />
            </Columns>
          </OptionAllowCard>

          {/* Delivery */}
          <OptionAllowCard
            label="มีบริการส่งถึงที่อยู่ลูกค้า"
            value={form.is_delivery_allowed}
            onChange={(is_delivery_allowed) =>
              setForm({ ...form, is_delivery_allowed })
            }
          />

          {/* PromptPay */}
          <OptionAllowCard
            label="ให้ลูกค้าจ่ายผ่านพร้อมเพย์ได้"
            value={form.accept_promptpay}
            onChange={(accept_promptpay) =>
              setForm({ ...form, accept_promptpay })
            }
          >
            <Columns columns={3} className="mb-9">
              <TextField
                appearance="outlined"
                label="บัญชีพร้อมเพย์"
                helperMsg="เบอร์โทรศัพท์หรือเลขประจำตัวประชาชนที่ผูกไว้กับบัญชีพร้อมเพย์"
                inputAttr={{ onBlurCapture: handleSave }}
                {...formProps.promptpay_number}
              />
            </Columns>
          </OptionAllowCard>

          {/* Cash on Delivery */}
          <OptionAllowCard
            label="ให้ลูกค้าจ่ายเงินปลายทางได้"
            value={form.accept_cod}
            onChange={(accept_cod) => setForm({ ...form, accept_cod })}
          />
        </Section>
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
  if (!jimmy.user) return { notFound: true };

  const { data: managingShops, error: shopsError } = await jimmy.fetch<
    IDOnly[]
  >(`/shops`, {
    query: { filter: { data: { manager_ids: [jimmy.user.id] } } },
  });
  if (shopsError)
    logError(
      "/account/manage/:id/customize getServerSideProps (shops)",
      shopsError,
    );

  const { toUUID } = shortUUID();
  const shopID = toUUID(params!.shopID as string);
  const { data: shop, error } = await jimmy.fetch<Shop>(`/shops/${shopID}`);
  if (error) {
    logError("/account/manage/:id/customize getServerSideProps (shop)", error);
    return { notFound: true };
  }

  if (!managingShops?.find((managingShop) => shop.id === managingShop.id))
    return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
      shop,
    },
  };
};

export default CustomizeShopPage;

