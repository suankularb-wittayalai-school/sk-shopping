import PriceDisplay from "@/components/shop/PriceDisplay";
import VariantChip from "@/components/shop/details/VariantChip";
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
import Image from "next/image";
import { FC, useEffect, useState } from "react";

const ListingView: FC<{
  shop: Shop;
  listing: ListingCompact;
  variants?: ListingOption[];
  onClose?: () => void;
}> = ({ shop, listing, variants, onClose }) => {
  const locale = useLocale();

  const { duration, easing } = useAnimationConfig();

  const [selectedVariant, setSelectedVariant] = useState<ListingOption>();
  useEffect(() => {
    if (variants) setSelectedVariant(variants[0]);
    else setSelectedVariant(undefined);
  }, [variants]);

  const [selectedImage, setSelectedImage] = useState<string>();
  useEffect(() => {
    if (!selectedVariant) return;
    setSelectedImage(selectedVariant.image_urls[0]);
  }, [selectedVariant]);

  const [count, setCount] = useState("1");

  return (
    <div className="flex h-full flex-col">
      <section className="grid grid-cols-3 gap-4 p-4 pb-0">
        <div className="col-span-2 flex flex-col gap-2">
          <div className="grid grid-cols-[2rem,1fr] gap-2">
            <Button
              appearance="text"
              icon={<MaterialIcon icon="close" />}
              onClick={onClose}
              className="!-ml-2"
            />
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
        <div className="h-full overflow-auto">
          <ul className="flex flex-col gap-2">
            <AnimatePresence mode="wait" initial={false}>
              {selectedVariant?.image_urls?.map((image) => (
                <motion.li
                  key={image}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    borderRadius: selectedImage === image ? 100 : 12,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={transition(duration.medium2, easing.standard)}
                  className="overflow-hidden rounded-md"
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

      <section className="relative grow overflow-auto px-4 py-3">
        <div className="flex flex-row gap-4">
          <div className="grow">
            <Text type="display-small" element="h2">
              {listing.name}
            </Text>
            <Text type="headline-medium" className="text-on-surface-variant">
              <PriceDisplay listing={selectedVariant || listing} />
            </Text>
          </div>
          <Actions className="!flex-nowrap">
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="share" />}
            />
            <ToggleButton
              appearance="tonal"
              icon={<MaterialIcon icon="star" />}
              alt="นำรายการนี้เข้าสู่รายการโปรด"
              tooltip="นำเข้าสู่รายการโปรด"
            />
          </Actions>
        </div>

        <p>{listing.description}</p>

        <div
          className="absolute inset-0 top-auto grid grid-cols-2 items-end gap-4 rounded-xl p-6"
          style={{ backgroundColor: `#${shop.accent_color}33` }}
        >
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
        </div>
      </section>
    </div>
  );
};

export default ListingView;
