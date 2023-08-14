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
  onChange: (value: PaymentMethod) => void;
  onSubmit: () => void;
}> = ({ value, onChange, onSubmit }) => {
  return (
    <Card appearance="outlined" className="sm:col-span-2 md:col-span-1">
      <CardHeader title="จ่ายผ่านวิธี…" className="!-mb-2 !pb-0" />
      <CardContent>
        <FormGroup
          label="จ่ายผ่านวิธี…"
          className="[&>.skc-form-group\_\_label]:sr-only"
        >
          <FormItem label="พร้อมเพย์">
            <Radio
              value={value === "prompt_pay"}
              onChange={(value) => value && onChange("prompt_pay")}
            />
          </FormItem>
          <FormItem label="จ่ายเงินสดปลายทาง">
            <Radio
              value={value === "cod"}
              onChange={(value) => value && onChange("cod")}
            />
          </FormItem>
        </FormGroup>
        <Button appearance="filled" onClick={onSubmit}>
          สั่งซื้อ
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
