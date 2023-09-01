// Imports
import PageHeader from "@/components/PageHeader";
import BulkPrintOrdersDialog from "@/components/account/manage/BulkPrintOrdersDialog";
import DeliveryTypeSelect from "@/components/account/manage/DeliveryTypeSelect";
import ManageShopTabs from "@/components/account/manage/ManageShopTabs";
import OrderListItem from "@/components/account/manage/OrderListItem";
import OrderStatusSelect from "@/components/account/manage/OrderStatusSelect";
import SkeletonOrderListItem from "@/components/account/manage/SkeletonOrderListItem";
import cn from "@/utils/helpers/cn";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import useJimmy from "@/utils/helpers/useJimmy";
import useLocale from "@/utils/helpers/useLocale";
import { IDOnly, LangCode } from "@/utils/types/common";
import { DeliveryType, Order, OrderStatus } from "@/utils/types/order";
import { ShopCompact } from "@/utils/types/shop";
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  List,
  MaterialIcon,
  Search,
  SegmentedButton,
  Text,
} from "@suankularb-components/react";
import { LayoutGroup } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import Head from "next/head";
import { list, omit } from "radash";
import { useEffect, useState } from "react";
import shortUUID from "short-uuid";

const ROWS_PER_PAGE = 25;

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
  const { t } = useTranslation("manage", { keyPrefix: "orders" });
  const { t: tx } = useTranslation(["common", "manage"]);

  const { fromUUID } = shortUUID();

  const jimmy = useJimmy();
  const plausible = usePlausible();

  const [loading, setLoading] = useState(false);

  // Filters and pagination
  const [query, setQuery] = useState("");
  const [orderStatus, setOrderStatus] =
    useState<OrderStatus>("not_shipped_out");
  const [deliveryType, setDeliveryType] = useState<DeliveryType | "all">(
    "school_pickup",
  );
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState<Order[]>(initialOrders);

  /**
   * Refreshes the list of Orders.
   */
  async function refreshOrders() {
    setIsInitial(false);
    setLoading(true);
    setOrders([]);
    const { data, error } = await jimmy.fetch<Order[]>(`/orders`, {
      query: {
        pagination: { p: (page - 1) * ROWS_PER_PAGE, size: ROWS_PER_PAGE },
        filter: {
          ...(query ? { q: query } : {}),
          data: {
            shop_ids: [shop.id],
            shipment_status: orderStatus,
            ...(deliveryType !== "all" ? { delivery_type: deliveryType } : {}),
          },
        },
        sorting: { by: ["created_at"], ascending: false },
        descendant_fetch_level: "compact",
      },
    });
    if (error) logError("useEffect", error);
    else if (data) setOrders(data);
    setLoading(false);
  }

  const [isInitial, setIsInitial] = useState(true);
  useEffect(() => {
    if (!isInitial) refreshOrders();
  }, [page, orderStatus, deliveryType, isInitial]);

  // Dialog control
  const [printOpen, setPrintOpen] = useState(false);

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
      <PageHeader parentURL={`/account/manage/${fromUUID(shop.id)}`}>
        {tx("title", { ns: "manage", shop: getLocaleString(shop.name) })}
      </PageHeader>
      <ContentLayout>
        <ManageShopTabs shopID={shop.id} />

        {/* Filters */}
        <Columns columns={3} className="mx-4 !items-end sm:mx-0">
          <div className="space-y-2 md:col-span-2">
            <OrderStatusSelect
              value={orderStatus}
              onChange={(value) => {
                plausible("Filter Orders by Status", {
                  props: {
                    status: value,
                    shop: getLocaleString(shop.name),
                  },
                });
                setIsInitial(false);
                setPage(1);
                setOrderStatus(value);
              }}
            />
            <DeliveryTypeSelect
              value={deliveryType}
              onChange={(value) => {
                plausible("Filter Orders by Delivery Type", {
                  props: {
                    deliveryType: value,
                    shop: getLocaleString(shop.name),
                  },
                });
                setIsInitial(false);
                setPage(1);
                setDeliveryType(value);
              }}
            />
          </div>
          <Search
            alt={t("search.alt")}
            value={query}
            locale={locale}
            onChange={setQuery}
            onSearch={() => {
              plausible("Search Orders", {
                props: { shop: getLocaleString(shop.name) },
              });
              setIsInitial(false);
              setPage(1);
              refreshOrders();
            }}
          >
            <Text type="body-medium" element="p" className="mx-4">
              <Trans
                i18nKey="orders.search.helper"
                ns="manage"
                components={[<kbd key={0} className="kbd" />]}
              />
            </Text>
          </Search>
        </Columns>

        {/* List */}
        <div aria-busy={loading}>
          <List divided>
            <LayoutGroup id="order">
              {!loading
                ? orders.map((order) => (
                    <OrderListItem
                      key={order.id}
                      order={order}
                      shop={shop}
                      onStatusChange={() =>
                        setOrders(
                          orders.filter((mapOrder) => order.id !== mapOrder.id),
                        )
                      }
                      setStatus={setOrderStatus}
                      jimmy={jimmy}
                    />
                  ))
                : list(8).map((idx) => <SkeletonOrderListItem key={idx} />)}
            </LayoutGroup>
          </List>
        </div>

        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="tonal"
            icon={<MaterialIcon icon="print" />}
            onClick={() => setPrintOpen(true)}
          >
            {t("action.bulkPrint")}
          </Button>
          <BulkPrintOrdersDialog
            shopID={shop.id}
            open={printOpen}
            onClose={() => setPrintOpen(false)}
          />
        </Actions>

        {/* Pagination */}
        <SegmentedButton
          alt={t("pagination.alt")}
          className="sticky bottom-24 mx-auto sm:bottom-4 [&>*]:!bg-surface-1"
        >
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="chevron_left" />}
            tooltip={t("pagination.action.previous")}
            onClick={() => {
              if (page <= 1) return;
              setPage(page - 1);
            }}
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
            tooltip={t("pagination.action.next")}
            onClick={() => {
              // If the Orders length is less than the page size, then we know
              // that we are on the last page
              if (orders.length !== ROWS_PER_PAGE) return;
              setPage(page + 1);
            }}
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

  const { data, error } = await jimmy.fetch<Order[]>(`/orders`, {
    query: {
      pagination: { p: 0, size: ROWS_PER_PAGE },
      filter: {
        data: {
          shop_ids: [shop.id],
          shipment_status: "not_shipped_out",
          delivery_type: "school_pickup",
        },
      },
      sorting: { by: ["created_at"], ascending: false },
      descendant_fetch_level: "compact",
    },
  });
  if (error) {
    logError("/account/manage/:id/orders getServerSideProps (orders)", error);
    return { notFound: true };
  }
  const orders = data.map((order) => omit(order, ["promptpay_qr_code_url"]));

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
        "receipt",
      ])),
      shop,
      orders,
    },
  };
};

export default ManageOrdersPage;

