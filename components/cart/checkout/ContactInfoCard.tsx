import { FormControlProps, StylableFC } from "@/utils/types/common";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Card with a form for contact information: name, email, and phone number.
 *
 * @param formProps `formProps` from a `useForm` instance controlling contact information.
 */
const ContactInfoCard: StylableFC<{
  formProps: FormControlProps<"name" | "email" | "tel">;
}> = ({ formProps, style, className }) => {
  const { t } = useTranslation("checkout", { keyPrefix: "contact" });

  return (
    <Card appearance="outlined" style={style} className={className}>
      <CardHeader title={t("title")} className="!pb-0" />
      <CardContent className="!grid !grid-cols-2 !gap-6 sm:!flex sm:!gap-3">
        <TextField
          appearance="filled"
          label={t("name")}
          {...formProps.name}
          className="col-span-2 sm:col-span-1"
        />
        <TextField
          appearance="filled"
          label={t("email")}
          inputAttr={{ type: "email" }}
          {...formProps.email}
        />
        <TextField
          appearance="filled"
          label={t("tel")}
          inputAttr={{ type: "tel", enterKeyHint: "done" }}
          {...formProps.tel}
        />
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
