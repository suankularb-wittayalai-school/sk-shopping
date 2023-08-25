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
  Columns,
  ContentLayout,
  DataTablePagination,
  List,
  MaterialIcon,
  Search,
  SegmentedButton,
} from "@suankularb-components/react";
import ManageShopTabs from "@/components/account/manage/ManageShopTabs";
import { useState } from "react";
import { Order, OrderStatus } from "@/utils/types/order";
import OrderStatusSelector from "@/components/account/manage/OrderStatusSelector";
import OrderListItem from "@/components/account/manage/OrderListItem";
import useLocale from "@/utils/helpers/useLocale";

/**
 * The Manage Orders page allows Shop Managers to manage Orders for their Shop.
 * They can search for Orders and filter Orders by status.
 *
 * @param shop The Shop to manage Orders for.
 */
const ManageOrdersPage: NextPage<{
  shop: ShopCompact;
  orders: Order[];
}> = ({ shop, orders }) => {
  const locale = useLocale();
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
        <Columns columns={3} className="!items-end">
          <OrderStatusSelector
            value={status}
            onChange={setStatus}
            className="md:col-span-2"
          />
          <Search alt="ค้นหาคำสั่ง" locale={locale} />
        </Columns>
        <List divided>
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </List>
        <div className="sticky bottom-2 flex flex-row justify-end rounded-full bg-surface-1 p-4">
          <Button
            appearance="text"
            icon={<MaterialIcon icon="chevron_left" />}
          />
          <Button
            appearance="text"
            icon={<MaterialIcon icon="chevron_right" />}
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
  const { data: shop, error: shopError } = await jimmy.fetch<ShopCompact>(
    `/shops/${shopID}`,
    { query: { fetch_level: "compact" } },
  );
  if (shopError) {
    logError("/account/manage/:id/orders getServerSideProps (shop)", shopError);
    return { notFound: true };
  }

  const { data: orders, error } = await jimmy.fetch<Order[]>(`/orders`, {
    query: {
      filter: { data: { shop_ids: [shop.id] } },
      sorting: { by: ["created_at"], ascending: false },
      descendant_fetch_level: "compact",
    },
  });
  if (error)
    logError("/account/manage/:id/orders getServerSideProps (orders)", error);

  if (!managingShops?.find((managingShop) => shop.id === managingShop.id))
    return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
      shop,
      orders,
    },
  };
};

export default ManageOrdersPage;

