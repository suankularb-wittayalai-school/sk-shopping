// Imports
import ListingView from "@/components/shop/details/ListingView";
import cn from "@/utils/helpers/cn";
import getSchemeFromBackgroundColor from "@/utils/helpers/getSchemeFromBackgroundColor";
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import { StylableFC } from "@/utils/types/common";
import { ListingOption } from "@/utils/types/listing-option";
import {
  FullscreenDialog,
  Progress,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion, useAnimationControls } from "framer-motion";
import { ComponentProps, useEffect, useState } from "react";

const ListingDetailsDialog: StylableFC<
  Pick<
    ComponentProps<typeof ListingView>,
    "shop" | "listing" | "setFullscreenImage"
  > & { open: boolean; onClose: () => void }
> = ({
  shop,
  listing,
  open,
  setFullscreenImage,
  onClose,
  style,
  className,
}) => {
  const jimmy = useJimmy();

  const { duration, easing } = useAnimationConfig();
  const viewControls = useAnimationControls();

  const [variants, setVariants] = useState<ListingOption[]>();
  useEffect(() => {
    if (!open || !listing) return;
    viewControls.set({ opacity: 0 });
    (async () => {
      const { data, error } = await jimmy.fetch<ListingOption[]>(`/items`, {
        query: { filter: { data: { listing_ids: [listing.id] } } },
      });
      if (error) logError("ListingDetailsSection", error);
      else setVariants(data);
    })();
  }, [open, listing]);

  useEffect(() => {
    setTimeout(
      () =>
        viewControls.start({
          opacity: 1,
          transition: transition(duration.medium2, easing.standard),
        }),
      duration.medium2 * 1000,
    );
  }, [variants]);

  return (
    <>
      <FullscreenDialog
        open={open}
        title=""
        width={560}
        onClose={onClose}
        style={{
          backgroundColor: `#${shop.background_color}`,
          backgroundImage:
            // Top 40%, bottom 0%, accent color
            `linear-gradient(
              to bottom,
              #${shop.accent_color}66,
              transparent
            )`,
          colorScheme: shop.background_color
            ? getSchemeFromBackgroundColor(shop.background_color)
            : undefined,
          ...style,
        }}
        className={cn(
          `relative [&>:first-child]:!hidden [&>:nth-child(2)]:h-[100dvh]
          [&>:nth-child(2)]:!pb-0`,
          shop.background_color &&
            getSchemeFromBackgroundColor(shop.background_color),
          className,
        )}
      >
        <motion.div
          animate={viewControls}
          className="!mx-0 -mt-20 h-full opacity-0 sm:!-m-6 sm:!-mt-8 sm:h-fit"
        >
          <ListingView
            shop={shop}
            listing={listing}
            variants={variants}
            setFullscreenImage={setFullscreenImage}
            onClose={onClose}
          />
        </motion.div>
        <Progress appearance="linear" alt="" />
      </FullscreenDialog>
    </>
  );
};

export default ListingDetailsDialog;
