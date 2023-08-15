import { FormControlProps, StylableFC } from "@/utils/types/common";
import { TextField } from "@suankularb-components/react";

const AddressFields: StylableFC<{
  formProps: FormControlProps<
    "street_address" | "province" | "district" | "zip_code"
  >;
}> = ({ formProps }) => (
  <>
    <TextField
      appearance="filled"
      label="บ้านเลขที่ ซอย ถนน ตำบล"
      behavior="multi-line"
      className="col-span-2"
      {...formProps.street_address}
    />
    <TextField appearance="filled" label="อำเภอ" {...formProps.province} />
    <TextField appearance="filled" label="จังหวัด" {...formProps.district} />
    <TextField
      appearance="filled"
      label="รหัสไปรษนีย์"
      {...formProps.zip_code}
    />
  </>
);

export default AddressFields;
