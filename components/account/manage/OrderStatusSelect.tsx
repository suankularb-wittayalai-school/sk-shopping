// Imports
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { OrderStatus } from "@/utils/types/order";
import {
  Button,
  MenuItem,
  SegmentedButton,
  Select,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Segmented Button that allows the user to select an Order Status to view in
 * the Manage Orders page.
 *
 * @param value The currently selected Order Status.
 * @param onChange Triggers when the currently selected Order Status changes.
 */
const OrderStatusSelect: StylableFC<{
  value: OrderStatus;
  onChange: (value: OrderStatus) => void;
}> = ({ value, onChange, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("manage", { keyPrefix: "orders.statusSelect" });

  return (
    <div style={style} className={className}>
      <SegmentedButton alt={t("label")} className="!hidden md:!flex">
        <Button
          appearance="outlined"
          dangerous
          selected={value === "canceled"}
          onClick={() => onChange("canceled")}
          className={cn(value === "canceled" && `!bg-error-container`)}
        >
          {t("canceled")}
        </Button>
        <Button
          appearance="outlined"
          selected={value === "not_shipped_out"}
          onClick={() => onChange("not_shipped_out")}
        >
          {t("notShippedOut")}
        </Button>
        <Button
          appearance="outlined"
          selected={value === "pending"}
          onClick={() => onChange("pending")}
        >
          {t("pending")}
        </Button>
        <Button
          appearance="outlined"
          selected={value === "delivered"}
          onClick={() => onChange("delivered")}
        >
          {t("delivered")}
        </Button>
      </SegmentedButton>
      <Select
        appearance="outlined"
        label={t("label")}
        locale={locale}
        value={value}
        onChange={onChange}
        className="md:!hidden"
      >
        <MenuItem value="canceled">{t("canceled")}</MenuItem>
        <MenuItem value="not_shipped_out">{t("notShippedOut")}</MenuItem>
        <MenuItem value="pending">{t("pending")}</MenuItem>
        <MenuItem value="delivered">{t("delivered")}</MenuItem>
      </Select>
    </div>
  );
};

export default OrderStatusSelect;
