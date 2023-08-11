// Imports
import cn from "@/utils/helpers/cn";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { StylableFC } from "@/utils/types/common";
import { CompactShop } from "@/utils/types/shop";
import { Card, CardHeader } from "@suankularb-components/react";
import Image from "next/image";
import Link from "next/link";
import { dash } from "radash";
import shortUUID from "short-uuid";

const ShopCard: StylableFC<{ shop: CompactShop }> = ({
  shop,
  style,
  className,
}) => {
  const getLocaleString = useGetLocaleString();
  const { fromUUID } = shortUUID();

  return (
    <Card
      appearance="filled"
      direction="row"
      stateLayerEffect
      href={`/shop/${
        shop.name["en-US"] ? dash(shop.name["en-US"]) : fromUUID(shop.id)
      }`}
      element={Link}
      className={cn(`relative isolate min-h-[5rem] overflow-hidden`, className)}
      style={{
        backgroundColor: `#${shop.background_color}` || undefined,
        ...style,
      }}
    >
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
      <CardHeader
        avatar={
          shop.logo_url?.[0] ? (
            <Image src={shop.logo_url[0]} alt="" width={40} height={40} />
          ) : (
            <div
              style={{
                backgroundColor: `#${shop.accent_color}80` || undefined,
              }}
              className="h-10 w-10 rounded-full"
            />
          )
        }
        title={getLocaleString(shop.name)}
        className="grow"
      />
    </Card>
  );
};

export default ShopCard;
