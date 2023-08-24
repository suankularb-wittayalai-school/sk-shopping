// Imports
import AddressFields from "@/components/address/AddressFields";
import cn from "@/utils/helpers/cn";
import { Address } from "@/utils/types/address";
import { FormControlProps, StylableFC } from "@/utils/types/common";
import { DeliveryType } from "@/utils/types/order";
import { Shop } from "@/utils/types/shop";
import {
  CardContent,
  CardHeader,
  FormGroup,
  FormItem,
  Radio,
  Text,
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
 * @param addresses The Addresses the user has saved.
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
  addresses: Address[];
  savedAddress?: Address;
  onSavedAddressChange: (address?: Address) => void;
  addressProps: FormControlProps<
    "street_address" | "province" | "district" | "zip_code"
  >;
}> = ({
  value,
  onChange,
  shippingCost,
  shop,
  addresses,
  addressProps,
  savedAddress,
  onSavedAddressChange,
  style,
  className,
}) => {
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
            {/* School pickup */}
            {shop.is_school_pickup_allowed && (
              <FormItem
                label={shop.pickup_location || t("schoolPickup.option")}
              >
                <Radio
                  value={value === "school_pickup"}
                  onChange={() => {
                    if (!value) return;
                    onSavedAddressChange();
                    onChange("school_pickup");
                  }}
                />
              </FormItem>
            )}
            {/* Saved addresses */}
            {addresses.map((address) => (
              <FormItem
                key={address.id}
                label={t("delivery.saved.option", {
                  address: [
                    address.street_address_line_1,
                    address.street_address_line_2?.replace("\n", " "),
                    address.district,
                    address.province,
                    address.zip_code,
                  ].join(" "),
                  shippingCost,
                })}
              >
                <Radio
                  value={savedAddress?.id === address.id}
                  onChange={() => {
                    if (!value) return;
                    onSavedAddressChange(address);
                    onChange("delivery");
                  }}
                />
              </FormItem>
            ))}
            {/* Delivery */}
            {shop.is_delivery_allowed && (
              <FormItem label={t("delivery.custom.option", { shippingCost })}>
                <Radio
                  value={value === "delivery" && !savedAddress}
                  onChange={() => {
                    if (!value) return;
                    onSavedAddressChange();
                    onChange("delivery");
                  }}
                />
              </FormItem>
            )}
          </FormGroup>
        </CardContent>
      </motion.div>
      <CardContent className="md:bg-surface-1">
        <AnimatePresence mode="wait" initial={false}>
          {/* School Pickup and saved address Delivery only requires 1 line of
              description so the `<div>` is shared */}
          {value === "school_pickup" || savedAddress ? (
            <motion.div
              key={savedAddress?.id || "school-pickup"}
              layout="position"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={transition(duration.medium2, easing.standard)}
            >
              <Text type="body-medium" element="p">
                {value === "school_pickup"
                  ? // School Pickup
                    t("schoolPickup.detail.desc", {
                      location: shop.pickup_location,
                    })
                  : // Saved address Delivery
                    t("delivery.saved.detail.desc", {
                      address: savedAddress?.street_address_line_1,
                    })}
              </Text>
            </motion.div>
          ) : (
            // Delivery
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

