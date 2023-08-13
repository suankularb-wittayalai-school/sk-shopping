// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Shop } from "@/utils/types/shop";
import Image from "next/image";

/**
 * The logo of a Shop. If a Shop doesn’t have one, the accent color is shown.
 *
 * @param shop A Shop.
 */
const ShopLogo: StylableFC<{
  shop: Pick<Shop, "logo_url" | "background_color" | "accent_color">;
  showBackground?: boolean;
}> = ({ shop, showBackground, style, className }) =>
  shop.logo_url ? (
    <div
      style={
        showBackground
          ? { backgroundColor: `#${shop.background_color}` }
          : undefined
      }
      className={cn(`h-10 w-10 rounded-full`, className)}
    >
      <Image
        src={shop.logo_url}
        width={40}
        height={40}
        alt=""
        className="h-full w-full object-contain"
      />
    </div>
  ) : (
    <div
      style={{
        backgroundColor: shop.accent_color
          ? `#${shop.accent_color}80`
          : undefined,
        ...style,
      }}
      className={cn(`h-10 w-10 rounded-full bg-on-surface-variant`, className)}
    />
  );

export default ShopLogo;
