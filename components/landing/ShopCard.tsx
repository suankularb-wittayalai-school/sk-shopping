// Imports
import ShopLogo from "@/components/landing/ShopLogo";
import cn from "@/utils/helpers/cn";
import getSchemeFromBackgroundColor from "@/utils/helpers/getSchemeFromBackgroundColor";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { StylableFC } from "@/utils/types/common";
import { ShopCompact } from "@/utils/types/shop";
import { Card, CardHeader } from "@suankularb-components/react";
import Link from "next/link";
import shortUUID from "short-uuid";

/**
 * A small Card in a list representing a Shop.
 *
 * @param role The role of the user. Used in determining the URL.
 * @param shop A compact Shop.
 */
const ShopCard: StylableFC<{
  role: "customer" | "manager";
  shop: ShopCompact;
}> = ({ role, shop, style, className }) => {
  const getLocaleString = useGetLocaleString();

  const { fromUUID } = shortUUID();

  return (
    <li>
      <Card
        appearance="filled"
        direction="row"
        stateLayerEffect
        href={
          {
            customer: `/shop/${fromUUID(shop.id)}`,
            manager: `/account/manage/${fromUUID(shop.id)}/customize`,
          }[role]
        }
        element={Link}
        className={cn(
          `relative isolate min-h-[5rem] overflow-hidden`,
          shop.background_color &&
            getSchemeFromBackgroundColor(shop.background_color),
          className,
        )}
        style={{
          backgroundColor: `#${shop.background_color}` || undefined,
          ...style,
        }}
      >
        {/* Accent gradient */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              // Left 40%, right 0%, accent color
              `linear-gradient(
                to right,
                #${shop.accent_color}60,
                transparent
              )`,
          }}
        />
        {/* Text */}
        <CardHeader
          avatar={<ShopLogo shop={shop} />}
          title={getLocaleString(shop.name)}
          className="!grid grow grid-cols-[2.5rem,1fr] [&_.skc-card-header\_\_title]:line-clamp-2"
        />
      </Card>
    </li>
  );
};

export default ShopCard;
