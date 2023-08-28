// Imports
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ListingOption } from "@/utils/types/listing-option";
import { DeliveryType } from "@/utils/types/order";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { sift } from "radash";

/**
 * A table breaking down the cost of an Order.
 * 
 * @param items The Order Items (an array of objects with an Item and its quantity) in this Order.
 * @param deliveryType The Delviery Type of this Order.
 * @param shippingCost A number in Thai Baht appneded to the breakdown when Delivery Type is `delivery`.
 * @param total The total cost of this Order, including the shipping cost.
 * @param density A lower number means a more dense interface.
 */
const CostBreakdown: StylableFC<{
  items: { item: ListingOption; amount: number }[];
  deliveryType: DeliveryType;
  shippingCost?: number;
  total: number;
  density?: -2 | -1 | 0;
}> = ({
  items,
  deliveryType,
  shippingCost,
  total,
  density,
  style,
  className,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("receipt", { keyPrefix: "costBreakdown" });
 
  return (
    <table
      style={style}
      className={cn(
        `[&>*>*>*:last-child]:text-end [&>*>*>*]:text-start`,
        deliveryType === "delivery" ? `mb-10` : `mb-[4.25rem]`,
        className,
      )}
    >
      <thead>
        <tr className="[&>*]:px-4 [&>*]:pb-1 [&>*]:pt-3">
          <Text type="title-medium" element="th">
            {[undefined, 0].includes(density) && t("thead.amount")}
          </Text>
          <Text
            type="title-medium"
            element="th"
            className={cn(`w-full`, density !== 0 && `!px-0`)}
          >
            {t("thead.item")}
          </Text>
          <Text type="title-medium" element="th">
            {t("thead.price")}
          </Text>
        </tr>
      </thead>
      <tbody
        className={
          density === -2
            ? `[&_td]:!py-0`
            : density === -1
            ? `[&_td]:!py-0.5`
            : undefined
        }
      >
        {sift([
          ...items,
          deliveryType === "delivery" && {
            item: {
              id: "shipping",
              name: t("tbody.shipping"),
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
            <Text
              type="body-medium"
              element="td"
              className={density !== 0 ? `!px-0` : undefined}
            >
              {item.name}
            </Text>
            <Text
              type="body-medium"
              element="td"
              className={'[font-feature-settings:"tnum"on,"lnum"on]'}
            >
              {((item.discounted_price || item.price) * amount).toLocaleString(
                locale,
                { style: "currency", currency: "THB" },
              )}
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
            {t("tfoot.total")}
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
  );
};

export default CostBreakdown;
