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
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { camel } from "radash";
import { forwardRef } from "react";
import QRCode from "react-qr-code";
import shortUUID from "short-uuid";

/**
 * The amount to add to the total if shipping is needed. This is a flat value
 * Kornor has decided for Samarnmitr ‘66 to simplify things.
 *
 * Note: this constant is also defined in @/pages/cart/checkout/[shopID].tsx.
 * Change both if needs be.
 */
const FLAT_SHIPPING_COST_THB = 70;

/**
 * A Dialog displaying detailed information about an Order.
 *
 * @param order The Order to display information of.
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const ReceiptDialog: StylableFC<{
  order: Order;
  open: boolean;
  onClose: () => void;
}> = ({ order, open, onClose, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("receipt");

  const { fromUUID } = shortUUID();

  const router = useRouter();

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
          {t("title", { date: new Date(order.created_at) })}
        </Text>
        <Text
          type="body-medium"
          element="p"
          className="text-on-surface-variant"
        >
          {new Date(order.created_at).toLocaleString(locale, {
            dateStyle: "short",
            timeStyle: "medium",
          })}
          {" • "}
          <span className="font-mono">{order.ref_id}</span>
        </Text>
      </div>
      <div className="grid grid-cols-2 items-start gap-6 p-6">
        <div className="grid grid-cols-[1.5rem,minmax(0,1fr)] gap-1 [&>i]:text-on-surface-variant [&>p]:py-0.5">
          <MaterialIcon icon="location_on" />
          <Text type="body-medium" element="p" className="line-clamp-3">
            {t(`details.delivery.${camel(order.delivery_type)}`, {
              streetAddress: order.street_address_line_1,
            })}
          </Text>
          {order.delivery_type === "delivery" && (
            <>
              <MaterialIcon icon="local_shipping" />
              <Text type="body-medium" element="p">
                {t(`details.shipmentStatus.${camel(order.shipment_status)}`)}
              </Text>
            </>
          )}
          {
            {
              cod: <MaterialIcon icon="payments" />,
              promptpay: <MaterialIcon icon="qr_code_scanner" />,
              pos_cash: <MaterialIcon icon="point_of_sale" />,
            }[order.payment_method]
          }
          <Text type="body-medium" element="p">
            {t(`details.payment.${camel(order.payment_method)}`)}
          </Text>
          {order.is_paid ? (
            <MaterialIcon icon="check_circle" />
          ) : (
            <MaterialIcon icon="error" />
          )}
          <Text type="body-medium" element="p">
            {t(`details.isPaid.${order.is_paid}`)}
          </Text>
        </div>
        <figure className="light dark:rounded-md dark:bg-surface dark:p-3">
          <QRCode
            value={`https://shopping.skkornor.org/order/${fromUUID(
              order.id,
            )}`}
            bgColor="transparent"
            className="h-auto w-full"
          />
          <figcaption className="sr-only">{t("qrCaption")}</figcaption>
        </figure>
      </div>
      <DialogContent height={342} className="relative">
        <CostBreakdown
          items={order.items}
          deliveryType={order.delivery_type}
          shippingCost={FLAT_SHIPPING_COST_THB}
          total={order.total_price}
          density={-1}
          className={cn(`!m-2 [&>tfoot]:static [&>tfoot]:bg-transparent`)}
        />
      </DialogContent>
      <Actions className="!justify-between">
        <Button
          appearance="text"
          icon={<MaterialIcon icon="print" />}
          onClick={onClose}
          href={`/order/${fromUUID(order.id)}/print/receipt`}
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a {...props} ref={ref} target="_blank" />
          ))}
        />
        <Button appearance="text" onClick={onClose}>
          {t("action.done")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ReceiptDialog;
