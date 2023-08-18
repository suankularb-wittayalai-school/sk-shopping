// Imports
import DefaultView from "@/components/shop/details/DefaultView";
import ListingView from "@/components/shop/details/ListingView";
import cn from "@/utils/helpers/cn";
import getSchemeFromBackgroundColor from "@/utils/helpers/getSchemeFromBackgroundColor";
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import { StylableFC } from "@/utils/types/common";
import { ListingCompact } from "@/utils/types/listing";
import { ListingOption } from "@/utils/types/listing-option";
import { Shop } from "@/utils/types/shop";
import {
  Progress,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ListingDetailsSection: StylableFC<{
  shop: Shop;
  listing?: ListingCompact;
  setFullscreenImage: (image: string) => void;
  onClose: () => void;
}> = ({ shop, listing, setFullscreenImage, onClose, style, className }) => {
  const jimmy = useJimmy();

  const { duration, easing } = useAnimationConfig();

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
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={listing?.id || "default"}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            ...transition(duration.medium2, easing.standardDecelerate),
            delay: 0.1,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          transition: transition(duration.short4, easing.standard),
        }}
        style={{
          backgroundColor: `#${shop.background_color}`,
          backgroundImage:
            // Top 40%, bpttom 0%, accent color
            `linear-gradient(
              to bottom,
              #${shop.accent_color}66,
              transparent
            )`,
          ...style,
        }}
        className={cn(
          `relative overflow-hidden rounded-xl`,
          shop.background_color &&
            getSchemeFromBackgroundColor(shop.background_color),
          className,
        )}
      >
        {listing && !variants && (
          <Progress
            alt="Loading listing…"
            appearance="linear"
            visible
            className="fixed inset-0 bottom-auto"
          />
        )}
        {listing ? (
          <ListingView
            shop={shop}
            listing={listing}
            variants={variants}
            setFullscreenImage={setFullscreenImage}
            onClose={onClose}
          />
        ) : (
          <DefaultView shop={shop} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ListingDetailsSection;
