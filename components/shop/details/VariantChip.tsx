// Imports
import SplitColorsCircle from "@/components/SplitColorsCircle";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ListingOption } from "@/utils/types/listing-option";
import { Shop } from "@/utils/types/shop";
import { FilterChip } from "@suankularb-components/react";

const VariantChip: StylableFC<{
  variant: ListingOption;
  shop: Shop;
  selected?: boolean;
  onClick: () => void;
}> = ({ variant, shop, selected, onClick, style, className }) => (
  <FilterChip
    icon={
      <SplitColorsCircle
        colors={variant.colors.map((color) => `#${color}`)}
        className="m-[0.0625rem]"
      />
    }
    selected={selected}
    onClick={onClick}
    style={{
      ...style,
      backgroundColor: selected ? `#${shop.accent_color}` : undefined,
    }}
    className={cn(
      selected
        ? `isolate !text-surface after:absolute after:inset-0 after:-z-10
          after:bg-on-surface after:opacity-10 [&_.skc-icon]:!text-surface`
        : undefined,
      className,
    )}
  >
    {variant.variant_name}
  </FilterChip>
);

export default VariantChip;
