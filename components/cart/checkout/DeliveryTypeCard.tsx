// Imports
import { StylableFC } from "@/utils/types/common";
import { DeliveryType } from "@/utils/types/order";
import { Shop } from "@/utils/types/shop";
import {
  Card,
  CardHeader,
  CardContent,
  FormGroup,
  FormItem,
  Radio,
} from "@suankularb-components/react";

const DeliveryTypeCard: StylableFC<{
  value: DeliveryType;
  onChange: (value: DeliveryType) => void;
  shippingCost: number;
  shop: Pick<
    Shop,
    "is_school_pickup_allowed" | "pickup_location" | "is_delivery_allowed"
  >;
}> = ({ value, onChange, shippingCost, shop, style, className }) => {
  return (
    <Card appearance="outlined">
      <CardHeader title="รับสินค้าที่…" className="!-mb-2 !pb-0" />
      <CardContent>
        <FormGroup
          label="รับสินค้าที่…"
          className="[&>.skc-form-group\_\_label]:sr-only"
        >
          {shop.is_school_pickup_allowed && (
            <FormItem label={shop.pickup_location || "โรงเรียน"}>
              <Radio
                value={value === "school_pickup"}
                onChange={(value) => value && onChange("school_pickup")}
              />
            </FormItem>
          )}
          {shop.is_delivery_allowed && (
            <FormItem label={`ที่อยู่อื่น… (เพิ่มค่าส่ง ฿${shippingCost})`}>
              <Radio
                value={value === "delivery"}
                onChange={(value) => value && onChange("delivery")}
              />
            </FormItem>
          )}
        </FormGroup>
      </CardContent>
    </Card>
  );
};

export default DeliveryTypeCard;
