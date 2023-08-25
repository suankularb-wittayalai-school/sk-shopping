// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { OrderStatus } from "@/utils/types/order";
import { Button, SegmentedButton } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Segmented Button that allows the user to select an Order Status to view in
 * the Manage Orders page.
 *
 * @param value The currently selected Order Status.
 * @param onChange Triggers when the currently selected Order Status changes.
 */
const OrderStatusSelector: StylableFC<{
  value: OrderStatus;
  onChange: (value: OrderStatus) => void;
}> = ({ value, onChange, style, className }) => {
  const { t } = useTranslation("manage");

  return (
    <SegmentedButton
      alt="สถานะการสั่งซื้อ"
      full
      style={style}
      className={className}
    >
      <Button
        appearance="outlined"
        dangerous
        selected={value === "canceled"}
        onClick={() => onChange("canceled")}
        className={cn(value === "canceled" && `!bg-error-container`)}
      >
        ถูกยกเลิก
      </Button>
      <Button
        appearance="outlined"
        selected={value === "not_shipped_out"}
        onClick={() => onChange("not_shipped_out")}
      >
        ยังไม่ได้จัดส่ง
      </Button>
      <Button
        appearance="outlined"
        selected={value === "pending"}
        onClick={() => onChange("pending")}
      >
        กำลังส่ง/พร้อมรับ
      </Button>
      <Button
        appearance="outlined"
        selected={value === "delivered"}
        onClick={() => onChange("delivered")}
      >
        รับสินค้าแล้ว
      </Button>
    </SegmentedButton>
  );
};

export default OrderStatusSelector;

