// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { DeliveryType } from "@/utils/types/order";
import { ChipSet, FilterChip } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Chip Set that allows the user to select a Delivery Type.
 *
 * @param value The currently selected Delivery Type.
 * @param onChange Triggers when the currently selected Delivery Type changes.
 */
const DeliveryTypeSelect: StylableFC<{
  value: DeliveryType | "all";
  onChange: (value: DeliveryType | "all") => void;
}> = ({ value, onChange, style, className }) => {
  const { t } = useTranslation("manage", {
    keyPrefix: "orders.deliverySelect",
  });

  return (
    <ChipSet scrollable style={style} className={cn(`-mx-4 !px-4`, className)}>
      <FilterChip selected={value === "all"} onClick={() => onChange("all")}>
        {t("all")}
      </FilterChip>
      <FilterChip
        selected={value === "school_pickup"}
        onClick={() => onChange("school_pickup")}
      >
        {t("schoolPickup")}
      </FilterChip>
      <FilterChip
        selected={value === "delivery"}
        onClick={() => onChange("delivery")}
      >
        {t("delivery")}
      </FilterChip>
      <FilterChip selected={value === "pos"} onClick={() => onChange("pos")}>
        {t("pos")}
      </FilterChip>
    </ChipSet>
  );
};

export default DeliveryTypeSelect;

