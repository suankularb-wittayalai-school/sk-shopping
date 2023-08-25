// Imports
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { IDOnly, LangCode } from "@/utils/types/common";
import { ShopCompact } from "@/utils/types/shop";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import shortUUID from "short-uuid";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import PageHeader from "@/components/PageHeader";
import {
  Button,
  ContentLayout,
  SegmentedButton,
} from "@suankularb-components/react";
import ManageShopTabs from "@/components/account/manage/ManageShopTabs";
import { useState } from "react";
import { OrderStatus } from "@/utils/types/order";
import OrderStatusSelector from "@/components/account/manage/OrderStatusSelector";

/**
 * The Manage Orders page allows Shop Managers to manage Orders for their Shop.
 * They can search for Orders and filter Orders by status.
 *
 * @param shop The Shop to manage Orders for.
 */
const ManageOrdersPage: NextPage<{ shop: ShopCompact }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("manage");
  const { t: tx } = useTranslation("common");

  const { fromUUID } = shortUUID();

  const [status, setStatus] = useState<OrderStatus>("not_shipped_out");

  return (
    <>
      <Head>
        <title>
          {tx("tabName", {
            tabName: `จัดการร้านค้า${getLocaleString(shop.name)}`,
          })}
        </title>
      </Head>
      <PageHeader parentURL={`/account/manage/${fromUUID(shop.id)}`}>
        จัดการร้านค้า{getLocaleString(shop.name)}
      </PageHeader>
      <ContentLayout>
        <ManageShopTabs shopID={shop.id} />
        <div className="flex flex-row justify-center">
          <OrderStatusSelector
            value={status}
            onChange={setStatus}
            className="!w-full !max-w-[46rem]"
          />
        </div>
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
      "/account/manage/:id/orders getServerSideProps (shops)",
      shopsError,
    );

  const { toUUID } = shortUUID();
  const shopID = toUUID(params!.shopID as string);
  const { data: shop, error } = await jimmy.fetch<ShopCompact>(
    `/shops/${shopID}`,
    { query: { fetch_level: "compact" } },
  );
  if (error) {
    logError("/account/manage/:id/orders getServerSideProps (shop)", error);
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

export default ManageOrdersPage;

