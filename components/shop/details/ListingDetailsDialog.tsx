// Imports
import ListingView from "@/components/shop/details/ListingView";
import cn from "@/utils/helpers/cn";
import getSchemeFromBackgroundColor from "@/utils/helpers/getSchemeFromBackgroundColor";
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import { StylableFC } from "@/utils/types/common";
import { ListingOption } from "@/utils/types/listing-option";
import { FullscreenDialog } from "@suankularb-components/react";
import { ComponentProps, useEffect, useState } from "react";

const ListingDetailsDialog: StylableFC<
  Pick<ComponentProps<typeof ListingView>, "shop" | "listing"> & {
    open: boolean;
    onClose: () => void;
  }
> = ({ shop, listing, open, onClose, style, className }) => {
  const jimmy = useJimmy();

  const [variants, setVariants] = useState<ListingOption[]>();
  useEffect(() => {
    if (!listing) return;
    setVariants([]);
    (async () => {
      const { data, error } = await jimmy.fetch<ListingOption[]>(`/items`, {
        query: { filter: { data: { listing_ids: [listing.id] } } },
      });
      if (error) logError("ListingDetailsSection", error);
      else setVariants(data);
    })();
  }, [listing]);

  return (
    <FullscreenDialog
      open={open}
      title=""
      width={560}
      onClose={onClose}
      style={{
        backgroundColor: `#${shop.background_color}`,
        backgroundImage:
          // Left 40%, right 0%, accent color
          `linear-gradient(
            to bottom,
            #${shop.accent_color}66,
            transparent
          )`,
        ...style,
      }}
      className={cn(
        `[&>.skc-fullscreen-dialog\\_\\_top-app-bar]:!hidden`,
        shop.background_color &&
          getSchemeFromBackgroundColor(shop.background_color),
        className,
      )}
    >
      <ListingView
        shop={shop}
        listing={listing}
        variants={variants}
        onClose={onClose}
        className="-mt-20 !mx-0 sm:!-m-6 sm:!-mt-8"
      />
    </FullscreenDialog>
  );
};

export default ListingDetailsDialog;
