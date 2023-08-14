import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ListingOption } from "@/utils/types/listing-option";
import { DeliveryType } from "@/utils/types/order";
import { Card, Text } from "@suankularb-components/react";

const CostCard: StylableFC<{
  items: { item: ListingOption; amount: number }[];
  deliveryType: DeliveryType;
  shippingCost: number;
  total: number;
}> = ({ style, className }) => (
  <Card
    appearance="outlined"
    style={style}
    className={cn(`relative overflow-hidden`, className)}
  >
    <table className="mb-10 [&>*>*>*:last-child]:text-end [&>*>*>*]:text-start">
      <thead>
        <tr className="[&>*]:px-4 [&>*]:pb-1 [&>*]:pt-3">
          <Text type="title-medium" element="th" className="w-20">
            จำนวน
          </Text>
          <Text type="title-medium" element="th">
            สินค้า
          </Text>
          <Text type="title-medium" element="th" className="w-40">
            ราคา
          </Text>
        </tr>
      </thead>
      <tbody>
        <tr className="[&>*]:px-4 [&>*]:py-1 last:[&>*]:pb-3">
          <Text
            type="body-large"
            element="td"
            className={'[font-feature-settings:"tnum"on,"lnum"on]'}
          >
            2
          </Text>
          <Text type="body-large" element="td">
            เสื้อสวนกุหลาบๆๆ
          </Text>
          <Text
            type="body-large"
            element="td"
            className={'[font-feature-settings:"tnum"on,"lnum"on]'}
          >
            ฿400.00
          </Text>
        </tr>
      </tbody>
      <tfoot className="absolute inset-0 top-auto bg-surface-variant">
        <tr className="[&>*]:px-4 [&>*]:py-2">
          <Text
            type="title-medium"
            element={(props) => <th {...props} scope="row" colSpan={2} />}
            className="w-full"
          >
            รวม
          </Text>
          <Text
            type="body-large"
            element="td"
            className={'[font-feature-settings:"tnum"on,"lnum"on]'}
          >
            ฿400.00
          </Text>
        </tr>
      </tfoot>
    </table>
  </Card>
);

export default CostCard;
