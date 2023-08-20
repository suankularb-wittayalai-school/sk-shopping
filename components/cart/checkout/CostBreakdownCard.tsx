import CostBreakdown from "@/components/cart/CostBreakdown";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Card, Progress } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { omit } from "radash";
import { ComponentProps } from "react";

/**
 * A Card displaying a table breaking down the total cost of the Cart. Shows
 * how much each Item is contributing to the total and the shipping cost.
 *
 * @param items An array of objects with Item and amount of that Item.
 * @param deliveryType The delivery type. If this is `delivery`, shipping cost is applied.
 * @param shippingCost How much the shipping cost.
 * @param total The total cost.
 */
const CostBreakdownCard: StylableFC<
  Omit<ComponentProps<typeof CostBreakdown>, "style" | "className">
> = (props) => {
  const { t } = useTranslation("checkout", { keyPrefix: "costBreakdown" });

  const { style, className, items } = props;

  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(`relative overflow-hidden`, className)}
    >
      <Progress
        appearance="linear"
        alt={t("loading")}
        visible={!items.length}
        className="absolute inset-0 bottom-10 top-auto"
      />
      <CostBreakdown {...omit(props, ["style", "className"])} />
    </Card>
  );
};

export default CostBreakdownCard;
