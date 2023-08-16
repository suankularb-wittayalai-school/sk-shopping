// Imports
import { StylableFC } from "@/utils/types/common";
import { PaymentMethod } from "@/utils/types/order";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormGroup,
  FormItem,
  Radio,
} from "@suankularb-components/react";

const PaymentMethodCard: StylableFC<{
  value: PaymentMethod;
  disabled: boolean;
  onChange: (value: PaymentMethod) => void;
  onSubmit: () => void;
}> = ({ value, disabled, onChange, onSubmit, style, className }) => {
  return (
    <Card appearance="outlined" style={style} className={className}>
      <CardHeader title="จ่ายผ่านวิธี…" className="!-mb-2 !pb-0" />
      <CardContent className="grow">
        <FormGroup
          label="จ่ายผ่านวิธี…"
          className="grow [&>.skc-form-group\_\_label]:sr-only"
        >
          <FormItem label="พร้อมเพย์">
            <Radio
              value={value === "promptpay"}
              onChange={(value) => value && onChange("promptpay")}
            />
          </FormItem>
          <FormItem label="จ่ายเงินสดปลายทาง">
            <Radio
              value={value === "cod"}
              onChange={(value) => value && onChange("cod")}
            />
          </FormItem>
        </FormGroup>
        <Button appearance="filled" disabled={disabled} onClick={onSubmit}>
          สั่งซื้อ
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
