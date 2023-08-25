// Imports
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { OrderStatus } from "@/utils/types/order";
import {
  Button,
  MenuItem,
  SegmentedButton,
  Select
} from "@suankularb-components/react";
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
  const locale = useLocale();
  const { t } = useTranslation("manage");

  return (
    <div style={style} className={className}>
      <SegmentedButton alt="สถานะการสั่งซื้อ" className="!hidden md:!flex">
        <Button
          appearance="outlined"
          dangerous
          selected={value === "canceled"}
          onClick={() => onChange("canceled")}
          className={cn(value === "canceled" && `!bg-error-container`)}
        >
          ยกเลิกไปแล้ว
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
      <Select
        appearance="outlined"
        label="สถานะการสั่งซื้อ"
        locale={locale}
        value={value}
        onChange={onChange}
        className="md:!hidden"
      >
        <MenuItem value="canceled">ยกเลิกไปแล้ว</MenuItem>
        <MenuItem value="not_shipped_out">ยังไม่ได้จัดส่ง</MenuItem>
        <MenuItem value="pending">กำลังส่ง/พร้อมรับ</MenuItem>
        <MenuItem value="delivered">รับสินค้าแล้ว</MenuItem>
      </Select>
    </div>
  );
};

export default OrderStatusSelector;
