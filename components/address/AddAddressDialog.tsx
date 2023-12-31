// Imports
import AddressFields from "@/components/address/AddressFields";
import { logError } from "@/utils/helpers/logError";
import useForm from "@/utils/helpers/useForm";
import useJimmy from "@/utils/helpers/useJimmy";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { THAI_ZIPCODE_REGEX } from "@/utils/regex";
import { StylableFC } from "@/utils/types/common";
import { Button, FullscreenDialog } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { omit } from "radash";
import { useState } from "react";

/**
 * The Add Address Dialog allows users to add a new Address to their account.
 * These Addresses are shown in the Checkout page.
 * 
 * This component also handle adding to the database.
 * 
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const AddAddressDialog: StylableFC<{
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ open, onClose, onSubmit, style, className }) => {
  const { t } = useTranslation("address");

  const refreshProps = useRefreshProps();
  const jimmy = useJimmy();
  const [loading, setLoading] = useState(false);

  const { form, formOK, formProps } = useForm<
    "street_address" | "province" | "district" | "zip_code"
  >([
    { key: "street_address", required: true },
    { key: "province", required: true },
    { key: "district", required: true },
    {
      key: "zip_code",
      validate: (value: string) => THAI_ZIPCODE_REGEX.test(value),
      required: true,
    },
  ]);

  async function handleAdd() {
    if (!formOK) return;
    setLoading(true);
    const { error } = await jimmy.fetch("/auth/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            ...omit(form, ["street_address", "zip_code"]),
            street_address_line_1: form.street_address.split("\n")[0],
            street_address_line_2: form.street_address
              .split("\n")
              .slice(1)
              .join("\n"),
            zip_code: Number(form.zip_code),
          },
        ],
      }),
    });
    if (error) logError("handleAdd", error);
    onSubmit();
    await refreshProps();
    setLoading(false);
  }

  return (
    <FullscreenDialog
      open={open}
      title="เพิ่มที่อยู่"
      action={
        <Button appearance="text" loading={loading} onClick={handleAdd}>
          บันทึก
        </Button>
      }
      width={520}
      onClose={onClose}
      style={style}
      className={className}
    >
      <div className="grid grid-cols-2 gap-6">
        <AddressFields appearance="outlined" formProps={formProps} />
      </div>
    </FullscreenDialog>
  );
};

export default AddAddressDialog;
