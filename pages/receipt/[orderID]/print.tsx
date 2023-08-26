// Imports
import CostBreakdown from "@/components/cart/CostBreakdown";
import UseIcon from "@/components/icon/UseIcon";
import cn from "@/utils/helpers/cn";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import { MaterialIcon, Text } from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import shortUUID from "short-uuid";

const PAPER_HEIGHT_MM = 147;
const PAPER_WIDTH_MM = 105;

const PrintReceiptPage: NextPage<{ order: Order }> = ({ order }) => {
  const { fromUUID } = shortUUID();
  useEffect(() => {
    const timeout = setTimeout(() => window.print(), 100);
    return () => clearTimeout(timeout);
  }, []);

  const tableRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState<boolean>();
  useEffect(() => {
    if (!tableRef.current) return;
    const { scrollHeight, clientHeight } = tableRef.current;
    setOverflowing(scrollHeight > clientHeight);
  }, [tableRef]);

  return (
    <main
      id="receipt"
      style={{ height: `${PAPER_HEIGHT_MM}mm`, width: `${PAPER_WIDTH_MM}mm` }}
      className="light invisible absolute flex flex-col divide-y-1 divide-dashed divide-black bg-white text-black print:visible"
    >
      <div className="flex grow flex-col gap-2 overflow-hidden p-6 relative">
        <div className="flex flex-row items-start gap-6">
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
            className={cn(
              `box-content h-auto w-16`,
              overflowing && `border-8 border-error p-1`,
            )}
          />
        </div>
        <div
          ref={tableRef}
          className="relative grow overflow-hidden border-1 border-black"
        >
          <CostBreakdown
            items={order.items}
            deliveryType="school_pickup"
            total={order.total_price}
            density={-2}
            className="[&>tfoot]:bg-white"
          />
        </div>
        <div className="flex flex-row items-center">
          <Text type="body-medium" className="grow">
            {[
              order.receiver_name,
              new Date(order.created_at).toLocaleString("th", {
                dateStyle: "medium",
                timeStyle: "medium",
              }),
            ].join(" • ")}
          </Text>
          <UseIcon icon="kornor" />
        </div>
        <MaterialIcon icon="cut" size={20} className="absolute -bottom-1 left-6" />
      </div>
      <div className="flex h-24 relative flex-col -space-y-1 p-4">
        <Text type="title-medium">เลขใบเสร็จ</Text>
        <Text type="display-small" element="pre" className="!font-mono">
          {order.ref_id.slice(-5)}
        </Text>
        <UseIcon icon="kornor" className="absolute bottom-6 right-6" />
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
