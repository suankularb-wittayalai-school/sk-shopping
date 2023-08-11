// Imports
import UseVector from "@/components/UseVector";
import cn from "@/utils/helpers/cn";
import { Collection } from "@/utils/types/collection";
import { StylableFC } from "@/utils/types/common";
import { CompactShop } from "@/utils/types/shop";
import { Actions, Button, Columns, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import shortUUID from "short-uuid";

/**
 * A Card in a list representing a Collection customized by images and text.
 *
 * @param collection A Collection.
 * @param shop The Shop the Collection belongs to.
 */
const CollectionCard: StylableFC<{
  collection: Collection;
  shop: CompactShop;
}> = ({ collection, shop, style, className }) => {
  const { t } = useTranslation("landing", { keyPrefix: "collections" });

  const { fromUUID } = shortUUID();

  return (
    <li
      style={{
        backgroundImage: collection.background_url || undefined,
        ...style,
      }}
      className={cn(
        `relative overflow-hidden rounded-xl border-1 border-outline-variant
        bg-cover sm:h-[12.5rem]`,
        className,
      )}
    >
      {/* Default background is shown if no background is specified */}
      {!collection.background_url && (
        <UseVector
          href="blob-card-full"
          className="absolute inset-0 -z-10 h-full w-full"
        />
      )}
      <Columns columns={2} className="h-full">
        {/* Foreground image */}
        {collection.foreground_url && (
          <Image
            src={collection.foreground_url}
            alt=""
            className="aspect-[4/3]"
          />
        )}

        <div
          className={cn(
            `flex flex-col gap-1 self-stretch p-5`,
            collection.foreground_url ? `sm:pl-0` : `pl-7`,
          )}
        >
          {/* Text */}
          <Text type="headline-medium">
            <Balancer>{collection.name}</Balancer>
          </Text>
          <Text type="body-medium" className="grow">
            <Balancer>{collection.description}</Balancer>
          </Text>

          {/* Browse Button */}
          <Actions className="bottom-5 right-5 mt-3 sm:absolute">
            <Button
              appearance="filled"
              href={`/shop/${fromUUID(shop.id)}#${fromUUID(collection.id)}`}
              element={Link}
            >
              {t("action.browse")}
            </Button>
          </Actions>
        </div>
      </Columns>
    </li>
  );
};

export default CollectionCard;
