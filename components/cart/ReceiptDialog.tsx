// Imports
import CostBreakdown from "@/components/cart/CostBreakdown";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import QRCode from "react-qr-code";
import shortUUID from "short-uuid";

const ReceiptDialog: StylableFC<{
  order: Order;
  open: boolean;
  onClose: () => void;
}> = ({ order, open, onClose, style, className }) => {
  const locale = useLocale();

  const { fromUUID } = shortUUID();

  return (
    <Dialog
      open={open}
      width={342}
      onClose={onClose}
      style={style}
      className={cn(`divide-y-1 divide-outline`, className)}
    >
      <div className="flex flex-col gap-1 p-6">
        <Text type="headline-small" element="h2" className="text-on-surface">
          ใบเสร็จ{" "}
          {new Date(order.created_at).toLocaleDateString(locale, {
            dateStyle: "long",
          })}
        </Text>
        <Text
          type="body-medium"
          element="p"
          className="text-on-surface-variant"
        >
          {new Date(order.created_at).toLocaleString(locale, {
            dateStyle: "short",
            timeStyle: "short",
          })}
          {" • "}
          <span className="font-mono">{order.ref_id}</span>
        </Text>
      </div>
      <div className="grid grid-cols-2 items-start gap-6 p-6">
        <div className="grid grid-cols-[1.5rem,1fr] gap-1 [&>i]:text-on-surface-variant [&>p]:py-0.5">
          <MaterialIcon icon="location_on" />
          <Text type="body-medium" element="p">
            รับสินค้าที่ 88 ถนนตรีเพชร
          </Text>
          <MaterialIcon icon="local_shipping" />
          <Text type="body-medium" element="p">
            ยังไม่ได้จัดส่ง
          </Text>
          <MaterialIcon icon="account_balance" />
          <Text type="body-medium" element="p">
            จ่ายผ่านพร้อมเพย์
          </Text>
        </div>
        <figure className="light dark:rounded-md dark:bg-surface dark:p-3">
          <QRCode
            value={`https://shopping.skkornor.org/receipt?id=${fromUUID(
              order.id,
            )}`}
            bgColor="transparent"
            className="h-auto w-full"
          />
          <figcaption className="sr-only">รหัส QR สำหรับใบเสร็จ</figcaption>
        </figure>
      </div>
      <DialogContent height={342} className="relative">
        <CostBreakdown
          items={order.items}
          deliveryType={order.delivery_type}
          shippingCost={70}
          total={order.total_price}
          className="[&>tfoot>*]:border-t-1 [&>tfoot>*]:border-t-outline [&>tfoot>*]:bg-surface-3"
        />
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          เสร็จสิ้น
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ReceiptDialog;
