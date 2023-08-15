import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
import { TextField } from "@suankularb-components/react";

const AddressFields: StylableFC = () => {
  const { form } = useForm<
    "street_address" | "province" | "district" | "zip_code"
  >([]);

  return (
    <>
      <TextField
        appearance="outlined"
        label="บ้านเลขที่ ซอย ถนน ตำบล"
        behavior="multi-line"
        className="col-span-2"
      />
      <TextField appearance="outlined" label="อำเภอ" />
      <TextField appearance="outlined" label="จังหวัด" />
      <TextField appearance="outlined" label="รหัสไปรษนีย์" />
    </>
  );
};

export default AddressFields;
