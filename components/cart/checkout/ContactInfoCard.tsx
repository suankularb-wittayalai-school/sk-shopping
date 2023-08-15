import { FormControlProps, StylableFC } from "@/utils/types/common";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@suankularb-components/react";

const ContactInfoCard: StylableFC<{
  formProps: FormControlProps<"name" | "email" | "tel">;
}> = ({ formProps, style, className }) => (
  <Card appearance="outlined" style={style} className={className}>
    <CardHeader title="ช่องทางการติดต่อสำหรับขนส่ง" className="!pb-0" />
    <CardContent className="!grid !grid-cols-2 !gap-6 sm:!flex sm:!gap-3">
      <TextField
        appearance="filled"
        label="ชื่อสกุล"
        {...formProps.name}
        className="col-span-2 sm:col-span-1"
      />
      <TextField
        appearance="filled"
        label="อีเมล"
        inputAttr={{ type: "email" }}
        {...formProps.email}
      />
      <TextField
        appearance="filled"
        label="โทร."
        inputAttr={{ type: "tel", enterKeyHint: "done" }}
        {...formProps.tel}
      />
    </CardContent>
  </Card>
);

export default ContactInfoCard;
