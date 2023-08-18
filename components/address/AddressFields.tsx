// Imports
import { FormControlProps, StylableFC } from "@/utils/types/common";
import { TextField } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A fragment containing Text Fields for a Thai address.
 * 
 * Works best when contained by Columns.
 * 
 * @param formProps `formProps` from a `useForm` instance controlling address information.
 */
const AddressFields: StylableFC<{
  formProps: FormControlProps<
    "street_address" | "district" | "province" | "zip_code"
  >;
}> = ({ formProps }) => {
  const { t } = useTranslation("address");

  return (
    <>
      <TextField
        appearance="filled"
        label={t("streetAddress")}
        behavior="multi-line"
        className="col-span-2"
        {...formProps.street_address}
      />
      <TextField
        appearance="filled"
        label={t("district")}
        {...formProps.district}
      />
      <TextField
        appearance="filled"
        label={t("province")}
        {...formProps.province}
      />
      <TextField
        appearance="filled"
        label={t("zipCode")}
        {...formProps.zip_code}
      />
    </>
  );
};

export default AddressFields;
