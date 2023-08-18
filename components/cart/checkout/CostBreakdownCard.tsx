import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ListingOption } from "@/utils/types/listing-option";
import { DeliveryType } from "@/utils/types/order";
import { Card, Text } from "@suankularb-components/react";
import { sift } from "radash";

/**
 * A Card displaying a table breaking down the total cost of the Cart. Shows
 * how much each Item is contributing to the total and the shipping cost.
 *
 * @param items An array of objects with Item and amount of that Item.
 * @param deliveryType The delivery type. If this is `delivery`, shipping cost is applied.
 * @param shippingCost How much the shipping cost.
 * @param total The total cost.
 */
const CostBreakdownCard: StylableFC<{
  items: { item: ListingOption; amount: number }[];
  deliveryType: DeliveryType;
  shippingCost: number;
  total: number;
}> = ({ items, deliveryType, shippingCost, total, style, className }) => {
  const locale = useLocale();

  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(`relative overflow-hidden`, className)}
    >
      <table
        className={cn(
          `mb-10 [&>*>*>*:last-child]:text-end [&>*>*>*]:text-start`,
          deliveryType === "delivery" ? `mb-10` : `mb-[4.25rem]`,
        )}
      >
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
          {sift([
            ...items,
            deliveryType === "delivery" && {
              item: {
                id: "shipping",
                name: "ค่าขนส่ง",
                price: shippingCost,
              } as ListingOption,
              amount: 1,
            },
          ]).map(({ item, amount }) => (
            <tr
              key={item.id}
              className="[&:last-child>*]:pb-3 [&>*]:px-4 [&>*]:py-1"
            >
              <Text
                type="body-medium"
                element="td"
                className={'[font-feature-settings:"tnum"on,"lnum"on]'}
              >
                {item.id !== "shipping" ? amount : <>&nbsp;</>}
              </Text>
              <Text type="body-medium" element="td">
                {item.name}
              </Text>
              <Text
                type="body-medium"
                element="td"
                className={'[font-feature-settings:"tnum"on,"lnum"on]'}
              >
                {(
                  (item.discounted_price || item.price) * amount
                ).toLocaleString(locale, {
                  style: "currency",
                  currency: "THB",
                })}
              </Text>
            </tr>
          ))}
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
              type="body-medium"
              element="td"
              className={'[font-feature-settings:"tnum"on,"lnum"on]'}
            >
              {total.toLocaleString(locale, {
                style: "currency",
                currency: "THB",
              })}
            </Text>
          </tr>
        </tfoot>
      </table>
    </Card>
  );
};

export default CostBreakdownCard;
