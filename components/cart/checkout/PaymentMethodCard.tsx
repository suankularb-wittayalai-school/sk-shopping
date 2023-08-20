// Imports
import { StylableFC } from "@/utils/types/common";
import { PaymentMethod } from "@/utils/types/order";
import { Shop } from "@/utils/types/shop";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormGroup,
  FormItem,
  Radio,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Card letting the user choose their payment method.
 *
 * @param value Form control value for the payment method Form Group.
 * @param shop The Shop this Cart belongs to. This is used to only show options allowed by the Shop.
 * @param disabled Whether the place order Button is disabled. This should be used to prevent the user from placing an order when the Cart hasn’t been loaded yet.
 * @param onChange Form control setter for the payment method Form Group.
 * @param onSubmit Triggers when the place order Button is pressed.
 */
const PaymentMethodCard: StylableFC<{
  value: PaymentMethod;
  shop: Pick<Shop, "accept_promptpay" | "accept_cod">;
  loading: boolean;
  disabled: boolean;
  onChange: (value: PaymentMethod) => void;
  onSubmit: () => void;
}> = ({
  value,
  shop,
  loading,
  disabled,
  onChange,
  onSubmit,
  style,
  className,
}) => {
  const { t } = useTranslation("checkout", { keyPrefix: "payment" });

  return (
    <Card appearance="outlined" style={style} className={className}>
      <CardHeader title={t("title")} className="!-mb-2 !pb-0" />
      <CardContent className="grow">
        <FormGroup
          label={t("title")}
          className="grow [&>.skc-form-group\_\_label]:sr-only"
        >
          {shop.accept_promptpay && (
            <FormItem label={t("option.promptpay")}>
              <Radio
                value={value === "promptpay"}
                onChange={(value) => value && onChange("promptpay")}
              />
            </FormItem>
          )}
          {shop.accept_cod && (
            <FormItem label={t("option.cod")}>
              <Radio
                value={value === "cod"}
                onChange={(value) => value && onChange("cod")}
              />
            </FormItem>
          )}
        </FormGroup>
        <Button appearance="filled" loading={loading} disabled={disabled} onClick={onSubmit}>
          {t("action.placeOrder")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
