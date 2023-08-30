// Imports
import PrintedOrder from "@/components/order/PrintedOrder";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { DeliveryType, Order, OrderStatus } from "@/utils/types/order";
import { endOfDay } from "date-fns";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import shortUUID from "short-uuid";

// Paper sizes
const A6_PAPER_SIZE_MM = { width: 105, height: 148 };
const A5_PAPER_SIZE_MM = { width: 148, height: 210 };
const A4_PAPER_SIZE_MM = { width: 210, height: 297 };

/**
 * The Bulk Print Orders page is accessed via the Bulk Print Orders Dialog,
 * where Shop Managers can specify options for bulk printing Orders.
 *
 * @param orders The Orders to print.
 * @param type The type of the printed Orders. Either a receipt, an A5 label, or an A4 label.
 */
const BulkPrintOrdersPage: NextPage<{
  orders: Order[];
  type: "receipt" | "label_a5" | "label_a4";
}> = ({ orders, type }) => {
  // Normally, we’d rely on Printed Order to start the print automatically, but
  // since there are many Printed Orders on this page, we need to start the
  // print manually to ensure it only happens once.
  useEffect(() => {
    const timeout = setTimeout(() => window.print(), 100);
    return () => clearTimeout(timeout);
  }, []);

  // To print many Orders at the same time, I just map the Orders into Printed
  // Orders and put one after another vertically in the hopes that the browser
  // will cut them into pages while printing. It works, but it’s not perfect.
  // I’m not sure if there’s a better way to do this.

  return (
    <div className="absolute">
      {orders.map((order) => (
        <PrintedOrder
          key={order.id}
          order={order}
          type={type === "receipt" ? "receipt" : "label"}
          {...{
            receipt: { ...A6_PAPER_SIZE_MM, density: -2 as -2 },
            label_a5: { ...A5_PAPER_SIZE_MM, density: -1 as -1 },
            label_a4: A4_PAPER_SIZE_MM,
          }[type]}
          // There are some text jumping issues when printing if I don’t add
          // `-mb-1 pb-1` here. Printing on the web is such a joy isn’t it?
          className="!static -mb-1 pb-1"
        />
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  query,
}) => {
  // Get query parameters
  const { shipmentStatus, deliveryType, dateStart, dateEnd, type } = query as {
    shipmentStatus: OrderStatus;
    deliveryType: DeliveryType;
    dateStart: string;
    dateEnd: string;
    type: "receipt" | "label_a5" | "label_a4";
  };

  const { toUUID } = shortUUID();
  const jimmy = await createJimmy();

  // Get orders from the API
  const { data, error } = await jimmy.fetch<Order[]>(`/orders`, {
    query: {
      pagination: { p: 0, size: 1000 },
      filter: {
        data: {
          shop_ids: [toUUID(params!.shopID as string)],
          shipment_status: shipmentStatus,
          delivery_type: deliveryType,
        },
      },
      descendant_fetch_level: "compact",
    },
  });
  if (error) {
    logError("/account/manage/:id/orders/print getServerSideProps", error);
    return { notFound: true };
  }

  // Further filter orders as the API cannot sufficiently satisfy the query
  const orders = data
    // Filter orders by start and end date as provided in the query
    .filter((order) => {
      const orderDate = new Date(order.created_at);
      const startDate = new Date(dateStart);
      // Set dateEnd to the end of the day
      const endDate = endOfDay(new Date(dateEnd));
      return orderDate >= startDate && orderDate <= endDate;
    })
    // Blank out the PromptPay QR code URL as it is very big and not needed for
    // printing
    .map((order) => ({
      ...order,
      promptpay_qr_code_url: "",
    }));

  // If there are no orders, return a 404
  if (orders.length === 0) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "receipt",
      ])),
      orders,
      type,
    },
  };
};

export default BulkPrintOrdersPage;