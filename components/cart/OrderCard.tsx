// Imports
import ReceiptDialog from "@/components/cart/ReceiptDialog";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { Trans, useTranslation } from "next-i18next";
import { camel } from "radash";
import { useState } from "react";

/**
 * A Card in a list of Orders the user has made in the past.
 *
 * @param order The Order to display information of.
 */
const OrderCard: StylableFC<{
  order: Order;
}> = ({ order, style, className }) => {
  const { t } = useTranslation("cart", { keyPrefix: "order" });
  const locale = useLocale();

  const [receiptOpen, setReceiptOpen] = useState(false);

  return (
    <Card appearance="filled" style={style} className={className}>
      <CardHeader
        title={order.items
          .map(({ item, amount }) => `${amount}×${item.name}`)
          .join(", ")}
        subtitle={[
          new Date(order.created_at).toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year:
              new Date(order.created_at).getFullYear() !==
              new Date().getFullYear()
                ? "numeric"
                : undefined,
          }),
          order.total_price.toLocaleString(locale, {
            style: "currency",
            currency: "THB",
          }),
        ].join(" • ")}
        className="!pb-0 [&_h3]:line-clamp-2"
      />
      <CardContent>
        <div className="grid grid-cols-2 items-start gap-x-6 gap-y-2 [&_i]:text-on-surface-variant">
          <div className="flex flex-row gap-1">
            <MaterialIcon icon="location_on" />
            <Text type="body-medium" element="p" className="grow py-0.5">
              {order.delivery_type === "school_pickup"
                ? t("delivery.schoolPickup")
                : t(`delivery.delivery.${camel(order.shipment_status)}`, {
                    streetAddress: order.street_address_line_1,
                  })}
            </Text>
          </div>
          <div className="flex flex-row gap-1">
            {
              {
                cod: <MaterialIcon icon="payments" />,
                promptpay: <MaterialIcon icon="qr_code_scanner" />,
                pos_cash: <MaterialIcon icon="point_of_sale" />,
              }[order.payment_method]
            }
            <Text type="body-medium" element="p" className="grow py-0.5">
              {t(`payment.${order.payment_method}`)}
            </Text>
          </div>
          <div className="col-span-2 flex flex-row gap-1">
            <MaterialIcon icon="receipt" />
            <Text type="body-medium" element="p" className="grow py-0.5">
              <Trans
                i18nKey="order.ref"
                ns="cart"
                values={{ refID: order.ref_id }}
                components={[<span key={0} className="font-mono" />]}
              />
            </Text>
          </div>
        </div>
        <Actions className="!mt-0">
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="receipt_long" />}
            onClick={() => setReceiptOpen(true)}
          >
            {t("action.showReceipt")}
          </Button>
          <ReceiptDialog
            order={order}
            open={receiptOpen}
            onClose={() => setReceiptOpen(false)}
          />
        </Actions>
      </CardContent>
    </Card>
  );
};

export default OrderCard;

