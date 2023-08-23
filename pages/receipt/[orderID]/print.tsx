// Imports
import CostBreakdown from "@/components/cart/CostBreakdown";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import { Text } from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import shortUUID from "short-uuid";

const PAPER_HEIGHT_MM = 105;
const PAPER_WIDTH_MM = 148;

const PrintReceiptPage: NextPage<{ order: Order }> = ({ order }) => {
  const { fromUUID } = shortUUID();
  useEffect(() => {
    const timeout = setTimeout(() => window.print(), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main
      id="receipt"
      style={{ height: `${PAPER_HEIGHT_MM}mm`, width: `${PAPER_WIDTH_MM}mm` }}
      className="light absolute hidden flex-row bg-white text-black print:flex"
    >
      <div className="flex grow flex-col gap-2 border-r-1 border-r-black p-6">
        <div className="flex flex-row gap-6">
          <h1 className="grow self-end">
            <Text type="headline-medium">ใบเสร็จ • </Text>
            <Text type="title-large" className="!font-mono">
              <span className="opacity-50">{order.ref_id.slice(0, -5)}</span>
              <strong>{order.ref_id.slice(-5)}</strong>
            </Text>
          </h1>
          <QRCode
            value={`https://shopping.skkornor.org/receipt/${fromUUID(
              order.id,
            )}`}
            bgColor="transparent"
            className="h-auto w-12"
          />
        </div>
        <div className="relative grow overflow-hidden border-1 border-black">
          <CostBreakdown
            items={order.items}
            deliveryType="school_pickup"
            total={order.total_price}
            className="[&>tfoot]:bg-white"
          />
        </div>
        <Text type="body-medium" className="grow">
          {order.receiver_name}
          {" • "}
          {new Date(order.created_at).toLocaleString("th", {
            dateStyle: "medium",
            timeStyle: "medium",
          })}
        </Text>
      </div>
      <div className="flex w-24 rotate-180 flex-row items-center justify-center p-4">
        <Text
          type="display-small"
          element="pre"
          className="!font-mono [writing-mode:vertical-lr]"
        >
          {order.ref_id.slice(-5)}
        </Text>
        <Text
          type="headline-small"
          className="block [writing-mode:vertical-lr]"
        >
          เลขใบเสร็จ
        </Text>
      </div>
      <style>{`
        @media print {
          .skc-nav-bar {
            display: none;
          }
        }
      `}</style>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const jimmy = await createJimmy();
  const { toUUID } = shortUUID();

  const { data: order, error } = await jimmy.fetch<Order>(
    `/orders/${toUUID(params!.orderID as string)}`,
    { query: { descendant_fetch_level: "compact" } },
  );
  if (error) {
    logError("/receipt/:id getServerSideProps", error);
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "receipt",
      ])),
      order,
    },
  };
};

export default PrintReceiptPage;
