// Imports
import PageHeader from "@/components/PageHeader";
import ManageShopTabs from "@/components/account/manage/ManageShopTabs";
import OrderListItem from "@/components/account/manage/OrderListItem";
import OrderStatusSelector from "@/components/account/manage/OrderStatusSelector";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import useJimmy from "@/utils/helpers/useJimmy";
import useLocale from "@/utils/helpers/useLocale";
import { IDOnly, LangCode } from "@/utils/types/common";
import { Order, OrderStatus } from "@/utils/types/order";
import { ShopCompact } from "@/utils/types/shop";
import {
  Button,
  Columns,
  ContentLayout,
  List,
  MaterialIcon,
  Search,
  SegmentedButton,
} from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import shortUUID from "short-uuid";

/**
 * The Manage Orders page allows Shop Managers to manage Orders for their Shop.
 * They can search for Orders and filter Orders by status.
 *
 * @param shop The Shop to manage Orders for.
 */
const ManageOrdersPage: NextPage<{
  shop: ShopCompact;
  orders: Order[];
}> = ({ shop, orders: initialOrders }) => {
  const locale = useLocale();
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("manage");
  const { t: tx } = useTranslation("common");

  const { fromUUID } = shortUUID();

  const jimmy = useJimmy();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus>("not_shipped_out");
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState(initialOrders);
  useEffect(() => {
    (async () => {
      console.log(query, status, page);
      const { data, error } = await jimmy.fetch<Order[]>(`/orders`, {
        query: {
          filter: {
            q: query,
            data: { shop_ids: [shop.id], shipment_status: status },
          },
          sorting: { by: ["created_at"], ascending: false },
          descendant_fetch_level: "compact",
        },
      });
      if (error) logError("useEffect", error);
      else if (data) setOrders(data);
    })();
  }, [query, status, page]);

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
          <Search
            alt="ค้นหาคำสั่ง"
            value={query}
            locale={locale}
            onChange={setQuery}
          />
        </Columns>
        <List divided>
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </List>
        <SegmentedButton
          alt="เปลี่ยนหน้า"
          className="sticky bottom-4 mx-auto [&>*]:!bg-surface-1"
        >
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="chevron_left" />}
            onClick={() => setPage(Math.max(page - 1, 1))}
          />
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="chevron_right" />}
            onClick={() => setPage(page + 1)}
          />
        </SegmentedButton>
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
      filter: {
        data: { shop_ids: [shop.id], shipment_status: "not_shipped_out" },
      },
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
