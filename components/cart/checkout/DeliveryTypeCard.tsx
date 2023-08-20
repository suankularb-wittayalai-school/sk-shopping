// Imports
import AddressFields from "@/components/address/AddressFields";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { FormControlProps, StylableFC } from "@/utils/types/common";
import { DeliveryType } from "@/utils/types/order";
import { Shop } from "@/utils/types/shop";
import {
  CardContent,
  CardHeader,
  FormGroup,
  FormItem,
  Radio,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * A Card letting the user choose how the Items in their Cart should be
 * delivered, and enter the address if needed.
 *
 * @param value Form control value for the delivery type Form Group.
 * @param onChange Form control setter for the delivery type Form Group.
 * @param shippingCost How much the shipping cost.
 * @param shop The Shop this Cart belongs to. This is used to only show options allowed by the Shop.
 * @param addressProps `formProps` from a `useForm` instance controlling address information.
 */
const DeliveryTypeCard: StylableFC<{
  value: DeliveryType;
  onChange: (value: DeliveryType) => void;
  shippingCost: number;
  shop: Pick<
    Shop,
    "is_school_pickup_allowed" | "pickup_location" | "is_delivery_allowed"
  >;
  addressProps: FormControlProps<
    "street_address" | "province" | "district" | "zip_code"
  >;
}> = ({
  value,
  onChange,
  shippingCost,
  shop,
  addressProps,
  style,
  className,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("checkout", { keyPrefix: "delivery" });

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.div
      key="delivery-card"
      layout
      layoutId="delivery-card"
      transition={transition(duration.medium4, easing.standard)}
      style={{ borderRadius: 12, ...style }}
      className={cn(
        `grid overflow-hidden rounded-md border-1 border-outline-variant
        bg-surface md:grid-cols-2`,
        className,
      )}
    >
      <motion.div layout="position">
        <CardHeader title={t("title")} className="!-mb-2 !pb-0" />
        <CardContent>
          <FormGroup
            label={t("title")}
            className="[&>.skc-form-group\_\_label]:sr-only"
          >
            {shop.is_school_pickup_allowed && (
              <FormItem
                label={shop.pickup_location || t("schoolPickup.option")}
              >
                <Radio
                  value={value === "school_pickup"}
                  onChange={(value) => value && onChange("school_pickup")}
                />
              </FormItem>
            )}
            {shop.is_delivery_allowed && (
              <FormItem label={t("delivery.option", { shippingCost })}>
                <Radio
                  value={value === "delivery"}
                  onChange={(value) => value && onChange("delivery")}
                />
              </FormItem>
            )}
          </FormGroup>
        </CardContent>
      </motion.div>
      <CardContent className="md:bg-surface-1">
        <AnimatePresence mode="wait" initial={false}>
          {value === "school_pickup" ? (
            <motion.div
              key="school-pickup"
              layout="position"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={transition(duration.medium2, easing.standard)}
              className="flex flex-col gap-2"
            >
              <p>
                {t("schoolPickup.detail.desc", {
                  location: shop.pickup_location,
                })}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="delivery"
              layout="position"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={transition(duration.medium2, easing.standard)}
              className="grid grid-cols-2 gap-x-6 gap-y-4"
            >
              <AddressFields formProps={addressProps} />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </motion.div>
  );
};

export default DeliveryTypeCard;
