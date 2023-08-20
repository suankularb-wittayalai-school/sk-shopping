import OutOfStockBanner from "@/components/shop/OutOfStockBanner";
import PriceDisplay from "@/components/shop/PriceDisplay";
import VariantChip from "@/components/shop/details/VariantChip";
import CartsContext from "@/contexts/CartsContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
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
  Snackbar,
  Text,
  TextField,
  ToggleButton,
  transition,
  useAnimationConfig,
  useBreakpoint,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { list } from "radash";
import { useContext, useEffect, useRef, useState } from "react";

const ListingView: StylableFC<{
  shop: Shop;
  listing: ListingCompact;
  variants?: ListingOption[];
  setFullscreenImage: (image: string) => void;
  onClose?: () => void;
}> = ({
  shop,
  listing,
  variants,
  setFullscreenImage,
  onClose,
  style,
  className,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("shop", { keyPrefix: "detail.listing" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);
  const { atBreakpoint } = useBreakpoint();
  const { duration, easing } = useAnimationConfig();

  // Keep track of the selected variant
  // When the Listing is loaded, automatically select the first variant
  // The user can browse through variants via Variant Chips
  const [selectedVariant, setSelectedVariant] = useState<ListingOption>();
  useEffect(() => {
    if (variants) setSelectedVariant(variants[0]);
    else setSelectedVariant(undefined);
  }, [variants]);

  const variantStock = selectedVariant
    ? selectedVariant.lifetime_stock - selectedVariant.amount_sold
    : 0;

  // Keep track of the main image
  // When a variant is selected, automatically select the first image
  // The user can browse through images via the list on the right
  const [selectedImage, setSelectedImage] = useState<string>();
  useEffect(() => {
    if (!selectedVariant) {
      setSelectedImage(undefined);
      return;
    }
    setSelectedImage(
      selectedVariant.image_urls.find((url) => url.includes("main")) ||
        selectedVariant.image_urls[0],
    );
  }, [selectedVariant]);

  const imageSideRef = useRef<HTMLImageElement>(null);
  const [imageListHeight, setImageListHeight] = useState(261);
  useEffect(() => {
    const imageSideElement = imageSideRef.current!;
    const handleResize = () =>
      setImageListHeight(imageSideElement.getBoundingClientRect().height);
    const timeout = setTimeout(
      () => handleResize(),
      ["base", "sm"].includes(atBreakpoint) ? duration.medium2 * 1000 : 0,
    );
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
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
  const [amount, setAmount] = useState("1");

  const { addItem } = useContext(CartsContext);

  /**
   * Opens the native share dialog for the link to this Listing.
   */
  async function handleShare() {
    const shareData: ShareData = {
      title: tx("tabName", { tabName: listing.name }),
      url: window.location.href,
    };
    if (navigator.canShare && navigator.canShare(shareData))
      await navigator.share(shareData);
  }

  /**
   * Add the specified number of the selected variant to Cart.
   */
  function handleAddToCart() {
    // Do nothing if the field is empty
    if (!amount) return;

    // Add via context
    addItem(selectedVariant!, Number(amount), shop);

    // Visual feedback
    setSnackbar(
      <Snackbar
        action={
          <Button appearance="text" href="/cart" element={Link}>
            ดูในรถเข็น
          </Button>
        }
        stacked
      >
        เพิ่ม “{selectedVariant?.name}” สู่รถเข็นแล้ว
      </Snackbar>,
    );

    // Reset form
    setAmount("1");
  }

  return (
    <div style={style} className={cn(`flex h-full flex-col`, className)}>
      <section
        className={cn(`flex flex-col gap-4 p-4 pb-0 sm:grid sm:grid-cols-6
          sm:items-start`)}
      >
        <div ref={imageSideRef} className="col-span-5 flex flex-col gap-2">
          <div className="grid grid-cols-[2rem,1fr] items-start gap-2">
            {/* Close button */}
            <Button
              appearance="text"
              icon={<MaterialIcon icon="close" />}
              alt={t("action.close.alt")}
              tooltip={t("action.close.tooltip")}
              onClick={onClose}
              style={{ color: `#${shop.accent_color}` }}
              className="!-ml-2 !-mt-[0.1875rem] state-layer:!bg-on-surface"
            />

            {/* Variants */}
            <ChipSet className="relative" scrollable>
              <Progress
                appearance="circular"
                alt="Loading variants…"
                visible={!selectedVariant}
                className="absolute mt-8 !h-6 !w-6"
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
              layoutId={`main-image-${selectedImage}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={transition(duration.medium2, easing.standard)}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-md"
              style={{
                backgroundColor: `#${shop.accent_color}33`,
                borderRadius: 18,
              }}
            >
              {selectedImage && (
                <Interactive
                  onClick={() => setFullscreenImage(selectedImage)}
                  className="h-full w-full"
                >
                  <Image
                    src={selectedImage}
                    width={326}
                    height={245}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </Interactive>
              )}
              {(selectedVariant
                ? selectedVariant.lifetime_stock -
                    selectedVariant.amount_sold ===
                  0
                : listing.is_sold_out) && (
                <OutOfStockBanner className="!rounded-b-md" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image list */}
        <div
          style={
            atBreakpoint !== "base"
              ? { height: `${imageListHeight}px` }
              : undefined
          }
          className="overflow-auto"
        >
          <ul
            className={cn(`flex h-16 w-fit flex-row gap-2 sm:h-fit sm:w-full
              sm:flex-col`)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {selectedVariant?.image_urls?.length
                ? // If there are images, show those images
                  selectedVariant.image_urls.map((image) => (
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
                        `aspect-[4/3] overflow-hidden transition-[border-radius]`,
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
                          className="w-full object-cover"
                        />
                      </Interactive>
                    </motion.li>
                  ))
                : // If the list hasn’t been loaded or is empty, show some
                  // placeholder rectangles
                  list(1).map((i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={transition(duration.medium2, easing.standard)}
                      style={{ backgroundColor: `#${shop.accent_color}33` }}
                      className="aspect-[4/3] rounded-md"
                    />
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
              alt={t("action.share.alt")}
              tooltip={t("action.share.tooltip")}
              onClick={handleShare}
              style={{ color: `#${shop.accent_color}` }}
              className="focus:!border-on-surface state-layer:!bg-on-surface"
            />

            {/* Favorite */}
            <ToggleButton
              appearance="tonal"
              icon={<MaterialIcon icon="star" />}
              alt={t("action.favorite.alt")}
              tooltip={t("action.favorite.tooltip")}
              style={{ backgroundColor: `#${shop.accent_color}33` }}
              className="[&>.skc-icon]:text-on-surface"
            />
          </Actions>
        </div>

        {/* Listing description */}
        <Text type="body-large" element="p" className="text-on-surface">
          {listing.description}
        </Text>
      </section>

      {/* Add to Cart section */}
      <section
        className={cn(`absolute inset-0 top-auto isolate grid grid-cols-2
          items-end gap-4 rounded-t-xl p-6 md:rounded-xl`)}
        style={{ backgroundColor: `#${shop.accent_color}66` }}
      >
        <div
          className="absolute inset-0 -z-10 rounded-[inherit] backdrop-blur-md"
          style={{ backgroundColor: `#${shop.background_color}80` }}
        />
        <TextField<string>
          appearance="filled"
          label={t("count")}
          required
          disabled={variantStock === 0}
          value={amount}
          onChange={setAmount}
          locale={locale}
          inputAttr={{ type: "number", min: 1 }}
        />
        <Actions className="relative">
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="add" />}
            // Prevent adding a sold out Listing Option to cart
            disabled={variantStock === 0 || Number(amount) > variantStock}
            onClick={handleAddToCart}
            style={{ backgroundColor: `#${shop.accent_color}` }}
            className={cn(`isolate !text-surface after:absolute after:inset-0
              after:-z-10 after:bg-on-surface after:opacity-10
              state-layer:!bg-surface`)}
          >
            {t("action.addToCart")}
          </Button>
        </Actions>
      </section>
    </div>
  );
};

export default ListingView;
