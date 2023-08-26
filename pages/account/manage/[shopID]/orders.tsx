// Imports
import PageHeader from "@/components/PageHeader";
import ManageShopTabs from "@/components/account/manage/ManageShopTabs";
import OrderListItem from "@/components/account/manage/OrderListItem";
import OrderStatusSelector from "@/components/account/manage/OrderStatusSelector";
import SkeletonOrderListItem from "@/components/account/manage/SkeletonOrderListItem";
import cn from "@/utils/helpers/cn";
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
  Text,
} from "@suankularb-components/react";
import { LayoutGroup, AnimatePresence } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { list } from "radash";
import { useEffect, useState } from "react";
import shortUUID from "short-uuid";

const ROWS_PER_PAGE = 100;

/**
 * The Manage Orders page allows Shop Managers to manage Orders for their Shop.
 * They can search for Orders and filter Orders by status.
 *
 * @param shop The Shop to manage Orders for.
 */
const ManageOrdersPage: NextPage<{ shop: ShopCompact }> = ({ shop }) => {
  const locale = useLocale();
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("manage");
  const { t: tx } = useTranslation("common");

  const { fromUUID } = shortUUID();

  const jimmy = useJimmy();
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus>("not_shipped_out");
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState<Order[]>([]);

  async function refreshOrders() {
    setLoading(true);
    setOrders([]);
    const { data, error } = await jimmy.fetch<Order[]>(`/orders`, {
      query: {
        pagination: {
          p: (page - 1) * ROWS_PER_PAGE + 1,
          size: ROWS_PER_PAGE,
        },
        filter: {
          ...(query ? { q: query } : {}),
          data: { shop_ids: [shop.id], shipment_status: status },
        },
        sorting: { by: ["created_at"], ascending: false },
        descendant_fetch_level: "compact",
      },
      cache: "no-cache",
    });
    if (error) logError("useEffect", error);
    else if (data) setOrders(data);
    setLoading(false);
  }

  useEffect(() => setPage(1), [query, status]);
  useEffect(() => {
    refreshOrders();
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
        <Columns columns={3} className="mx-4 !items-end sm:mx-0">
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
        <div aria-busy={loading}>
          <List divided>
            <LayoutGroup id="order">
              {!loading
                ? orders.map((order) => (
                    <OrderListItem
                      key={order.id}
                      order={order}
                      onStatusChange={() =>
                        setOrders(
                          orders.filter((mapOrder) => order.id !== mapOrder.id),
                        )
                      }
                      setStatus={setStatus}
                      jimmy={jimmy}
                    />
                  ))
                : list(8).map((idx) => <SkeletonOrderListItem key={idx} />)}
            </LayoutGroup>
          </List>
        </div>
        <SegmentedButton
          alt="เปลี่ยนหน้า"
          className="sticky bottom-24 mx-auto sm:bottom-4 [&>*]:!bg-surface-1"
        >
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="chevron_left" />}
            onClick={() => setPage(Math.max(page - 1, 1))}
          />
          <Text
            type="title-medium"
            element="div"
            className={cn(`min-w-[2.5rem] select-none border-1 border-l-0
              border-outline p-2 text-center`)}
          >
            {page}
          </Text>
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="chevron_right" />}
            onClick={() => orders.length === ROWS_PER_PAGE && setPage(page + 1)}
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

  if (!managingShops?.find((managingShop) => shop.id === managingShop.id))
    return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
        "receipt",
      ])),
      shop,
    },
  };
};

export default ManageOrdersPage;
