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
} from "@suankularb-components/react";
import { Trans, useTranslation } from "next-i18next";
import { camel } from "radash";
import { useState } from "react";

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
        className="!pb-0"
      />
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div className="flex flex-row items-center gap-1">
            <MaterialIcon
              icon="location_on"
              className="text-on-surface-variant"
            />
            <p className="grow">
              {order.delivery_type === "school_pickup"
                ? t("delivery.schoolPickup")
                : t(`delivery.delivery.${camel(order.shipment_status)}`, {
                    streetAddress: order.street_address_line_1,
                  })}
            </p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <MaterialIcon
              icon="account_balance"
              className="text-on-surface-variant"
            />
            <p className="grow">{t(`payment.${order.payment_method}`)}</p>
          </div>
          <div className="col-span-2 flex flex-row items-center gap-1">
            <MaterialIcon icon="receipt" className="text-on-surface-variant" />
            <p className="grow">
              <Trans
                i18nKey="order.ref"
                ns="cart"
                values={{ refID: order.ref_id }}
                components={[<span key={0} className="font-mono" />]}
              />
            </p>
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
