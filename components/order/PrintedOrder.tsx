// Imports
import CostBreakdown from "@/components/cart/CostBreakdown";
import UseIcon from "@/components/icon/UseIcon";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import { MaterialIcon, Text } from "@suankularb-components/react";
import { sift } from "radash";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import Balancer from "react-wrap-balancer";
import shortUUID from "short-uuid";

const PrintedOrder: StylableFC<{
  order: Order;
  type: "receipt" | "label";
  width: number;
  height: number;
  density?: -2 | -1 | 0;
  autoPrint?: boolean;
}> = ({ order, type, width, height, density, autoPrint }) => {
  const { fromUUID } = shortUUID();
  useEffect(() => {
    if (!autoPrint) return;
    // const timeout = setTimeout(() => window.print(), 100);
    // return () => clearTimeout(timeout);
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
      style={{ width: `${width}mm`, height: `${height}mm` }}
      className={cn(`light //invisible absolute flex flex-col divide-y-1
        divide-dashed divide-black bg-white text-black print:visible`)}
    >
      <div
        className={cn(
          `relative flex grow flex-col overflow-hidden p-6`,
          density === -2 ? `gap-2` : `gap-4`,
        )}
      >
        {!(order.is_paid && order.is_verified) && (
          <Text
            type="display-large"
            className={cn(`absolute inset-0 bottom-auto top-1/2
              -translate-y-1/2 text-center text-error opacity-50`)}
          >
            ยังไม่ชำระเงิน
          </Text>
        )}

        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr),4rem] items-end gap-6">
          <Text
            type={density === -2 ? "headline-medium" : "display-medium"}
            element="h1"
            className="!leading-none"
          >
            {type === "receipt" ? (
              <>
                {order.is_paid && order.is_verified
                  ? "ใบเสร็จ"
                  : "ใบแจ้งชำระเงิน"}
                {" • "}
                <Text type="title-large" className="!font-mono">
                  {order.delivery_type === "pos" ? (
                    <>
                      <span className="opacity-50">
                        {order.ref_id.slice(0, -5)}
                      </span>
                      <strong>{order.ref_id.slice(-5)}</strong>
                    </>
                  ) : (
                    order.ref_id
                  )}
                </Text>
              </>
            ) : (
              <>
                <span className="!font-mono">
                  {new Date(order.created_at)
                    .getDate()
                    .toString()
                    .padStart(2, "0")}
                </span>
                {" • "}
                <span className="!font-mono">{order.ref_id.slice(-5)}</span>
              </>
            )}
          </Text>
          <QRCode
            value={`https://shopping.skkornor.org/order/${fromUUID(order.id)}`}
            bgColor="transparent"
            className="h-auto w-full"
          />
        </div>

        {order.delivery_type === "delivery" && type === "label" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 border-1 border-black px-4 py-3">
              <Text type="title-medium" element="h2">
                ที่อยู่ผู้ส่ง
              </Text>
              <Text type="body-medium" element="address" className="not-italic">
                88 ถนนตรีเพชร
                <br />
                แขวงวังบูรพาภิรมย์
                <br />
                เขตพระนคร กรุงเทพมหานคร
                <br />
                10200
              </Text>
            </div>
            <div className="space-y-1 border-1 border-black px-4 py-3">
              <Text type="title-medium" element="h2">
                ที่อยู่ผู้รับ
              </Text>
              <Text type="body-medium" element="address" className="not-italic">
                <Balancer>{order.street_address_line_1}</Balancer>
                <br />
                {order.street_address_line_2 && (
                  <>
                    <Balancer>{order.street_address_line_2}</Balancer>
                    <br />
                  </>
                )}
                {order.district} {order.province}
                <br />
                {order.zip_code}
              </Text>
            </div>
          </div>
        )}

        {/* Cost Breakdown */}
        <div
          ref={tableRef}
          className="relative grow overflow-hidden border-1 border-black"
        >
          <CostBreakdown
            items={order.items}
            deliveryType="school_pickup"
            total={order.total_price}
            density={density}
            className="[&>tfoot]:bg-white"
          />
        </div>
        {overflowing && (
          <Text
            type="body-medium"
            element="p"
            className={cn(`-mt-2 bg-black px-4 py-2 text-white
              [print-color-adjust:exact]`)}
          >
            ใบเสร็จแสดงสินค้าไม่ครบ โปรดสแกนรหัส QR
          </Text>
        )}

        {/* Receiver and timestamp */}
        <div className="flex flex-row items-end">
          <Text type="body-medium" className="my-0.5 grow">
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

        {order.delivery_type === "pos" && (
          <MaterialIcon
            icon="cut"
            size={20}
            className="absolute -bottom-1 left-6"
          />
        )}
      </div>

      {/* Customer part for POS receipt */}
      {order.delivery_type === "pos" &&
        order.shipment_status !== "delivered" && (
          <div className="relative flex h-24 flex-col -space-y-1 px-6 py-4">
            <Text type="title-medium">เลขใบเสร็จ</Text>
            <Text type="display-small" element="pre" className="!font-mono">
              {order.ref_id.slice(-5)}
            </Text>
            <UseIcon icon="kornor" className="absolute bottom-6 right-6" />
          </div>
        )}

      <style>{`
        @media print {
          body {
            background-color: var(--white);
          }

          .skc-nav-bar,
          #credential_picker_iframe,
          #credential_picker_container {
            display: none;
          }
        }
      `}</style>
    </main>
  );
};

export default PrintedOrder;
