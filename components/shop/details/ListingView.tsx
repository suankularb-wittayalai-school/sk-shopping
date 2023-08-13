import PriceDisplay from "@/components/shop/PriceDisplay";
import VariantChip from "@/components/shop/details/VariantChip";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { ListingCompact } from "@/utils/types/listing";
import { ListingOption } from "@/utils/types/listing-option";
import { Shop } from "@/utils/types/shop";
import {
  Actions,
  Button,
  ChipSet,
  Interactive,
  MaterialIcon,
  Progress,
  Text,
  TextField,
  ToggleButton,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";

const ListingView: FC<{
  shop: Shop;
  listing: ListingCompact;
  variants?: ListingOption[];
  onClose?: () => void;
}> = ({ shop, listing, variants, onClose }) => {
  const locale = useLocale();
  const { t } = useTranslation("shop");
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  // Keep track of the selected variant
  // When the Listing is loaded, automatically select the first variant
  // The user can browse through variants via Variant Chips
  const [selectedVariant, setSelectedVariant] = useState<ListingOption>();
  useEffect(() => {
    if (variants) setSelectedVariant(variants[0]);
    else setSelectedVariant(undefined);
  }, [variants]);

  // Keep track of the main image
  // When a variant is selected, automatically select the first image
  // The user can browse through images via the list on the right
  const [selectedImage, setSelectedImage] = useState<string>();
  useEffect(() => {
    if (!selectedVariant) return;
    setSelectedImage(selectedVariant.image_urls[0]);
  }, [selectedVariant]);

  const imageSideRef = useRef<HTMLImageElement>(null);
  const [imageListHeight, setImageListHeight] = useState(261);
  useEffect(() => {
    const imageSideElement = imageSideRef.current!;
    const handleResize = () =>
      setImageListHeight(imageSideElement.getBoundingClientRect().height);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show a fade out effect on the top of the text content when scrolled
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const contentElement = contentRef.current!;
    const handleScroll = () => setScrolled(contentElement.scrollTop > 0);
    contentElement.addEventListener("scroll", handleScroll);
    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, []);

  // The number of items to add to cart
  const [count, setCount] = useState("1");

  async function handleShare() {
    const shareData: ShareData = {
      title: tx("tabName", { tabName: listing.name }),
      text: listing.description,
      url: window.location.href,
    };
    if (navigator.canShare && navigator.canShare(shareData))
      await navigator.share(shareData);
    return;
  }

  return (
    <div className="flex h-full flex-col">
      <section className="grid grid-cols-3 items-start gap-4 p-4 pb-0">
        <div ref={imageSideRef} className="col-span-2 flex flex-col gap-2">
          <div className="grid grid-cols-[2rem,1fr] gap-2">
            {/* Close button */}
            <Button
              appearance="text"
              icon={<MaterialIcon icon="close" />}
              onClick={onClose}
              style={{ color: `#${shop.accent_color}` }}
              className="!-ml-2 state-layer:!bg-on-surface"
            />

            {/* Variants */}
            <ChipSet className="relative">
              <Progress
                appearance="circular"
                alt="Loading variants…"
                visible={!selectedVariant}
                className="absolute !h-6 !w-6"
              />
              {selectedVariant &&
                variants!.length > 1 &&
                variants!.map((variant) => (
                  <VariantChip
                    key={variant.id}
                    variant={variant}
                    shop={shop}
                    selected={selectedVariant.id === variant.id}
                    onClick={() => setSelectedVariant(variant)}
                  />
                ))}
            </ChipSet>
          </div>

          {/* Main image */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={transition(duration.medium2, easing.standard)}
              className="aspect-[4/3] rounded-md"
              style={{ backgroundColor: `#${shop.accent_color}33` }}
            >
              {selectedImage && (
                <Image
                  src={selectedImage}
                  width={326}
                  height={245}
                  alt=""
                  className="aspect-[4/3] w-full rounded-md object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image list */}
        <div
          style={{ height: `${imageListHeight}px` }}
          className="overflow-auto"
        >
          <ul className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {selectedVariant?.image_urls?.map((image) => (
                <motion.li
                  key={image}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    selectedImage === image
                      ? { opacity: 0.8, scale: 0.95 }
                      : { opacity: 1, scale: 1 }
                  }
                  exit={{ opacity: 0, scale: 0 }}
                  transition={transition(duration.medium2, easing.standard)}
                  style={{ backgroundColor: `#${shop.accent_color}33` }}
                  className={cn(
                    `overflow-hidden transition-[border-radius]`,
                    selectedImage === image ? `rounded-full` : `rounded-md`,
                  )}
                >
                  <Interactive
                    onClick={() => setSelectedImage(image)}
                    className="block w-full"
                  >
                    <Image
                      src={image}
                      width={115}
                      height={86}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </Interactive>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </section>

      {/* Text content */}
      <section
        ref={contentRef}
        className={cn(
          `flex grow flex-col gap-2 overflow-auto px-4 pb-[7.25rem] pt-3`,
          scrolled &&
            `[mask-image:linear-gradient(to_bottom,transparent_0.75rem,black_2.75rem)]`,
        )}
      >
        <div className="flex flex-row gap-4">
          {/* Listing name */}
          <div className="grow">
            <Text type="display-small" element="h2" className="text-on-surface">
              {listing.name}
            </Text>

            {/* Listing price */}
            <Text type="headline-medium" className="text-on-surface-variant">
              <PriceDisplay listing={selectedVariant || listing} />
            </Text>
          </div>

          {/* Listing actions */}
          <Actions className="!flex-nowrap">
            {/* Share */}
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="share" />}
              onClick={handleShare}
              style={{ color: `#${shop.accent_color}` }}
              className="focus:!border-on-surface state-layer:!bg-on-surface"
            />

            {/* Favorite */}
            <ToggleButton
              appearance="tonal"
              icon={<MaterialIcon icon="star" />}
              alt="นำรายการนี้เข้าสู่รายการโปรด"
              tooltip="นำเข้าสู่รายการโปรด"
              style={{ backgroundColor: `#${shop.accent_color}33` }}
              className="[&>.skc-icon]:text-on-surface"
            />
          </Actions>
        </div>

        {/* Listing description */}
        <Text type="body-medium" element="p" className="text-on-surface">
          {listing.description}
        </Text>
      </section>

      {/* Add to Cart section */}
      <section
        className="absolute inset-0 top-auto isolate grid grid-cols-2 items-end gap-4 rounded-xl p-6"
        style={{ backgroundColor: `#${shop.accent_color}66` }}
      >
        <div
          className="absolute inset-0 -z-10 rounded-xl backdrop-blur-md"
          style={{ backgroundColor: `#${shop.background_color}80` }}
        />
        <TextField<string>
          appearance="filled"
          label="จำนวน"
          required
          disabled={listing.is_sold_out}
          value={count}
          onChange={setCount}
          locale={locale}
          inputAttr={{ type: "number", min: 1 }}
        />
        <Actions>
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="add" />}
            disabled={listing.is_sold_out}
          >
            เพิ่มใส่รถเข็น
          </Button>
        </Actions>
      </section>
    </div>
  );
};

export default ListingView;
