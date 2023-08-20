// Imports
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  TextField,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useState } from "react";

/**
 * A Dialog shown to the user when as PromptPay Order has been successfully
 * initiated.
 *
 * @param src The source URL of the PromptPay QR code image.
 * @param open If the Dialog is open and shown.
 * @param onSubmit Triggers when the submit Button is pressed.
 */
const PromptPayDialog: StylableFC<{
  src: string;
  open: boolean;
  onSubmit: (file: File) => void;
}> = ({ src, open, onSubmit, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("checkout", { keyPrefix: "payment.promptpay" });

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();

  return (
    <Dialog
      open={open}
      width={320}
      onClose={() => {}}
      style={style}
      className={className}
    >
      <DialogHeader desc={t("desc")} />
      <DialogContent className="flex flex-col gap-6 px-6">
        <Image
          src={src}
          width={222}
          height={222}
          alt={t("qrAlt")}
          className="mx-auto aspect-square w-full rounded-md bg-surface"
        />
        <TextField<File>
          appearance="outlined"
          label={t("attachSlip")}
          required
          onChange={setFile}
          locale={locale}
          inputAttr={{ type: "file", accept: "image/*" }}
        />
      </DialogContent>
      <Actions align="full">
        <Button
          appearance="filled"
          loading={loading}
          onClick={() => {
            if (!file) return;
            setLoading(true);
            onSubmit(file);
          }}
        >
          {t("action.save")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default PromptPayDialog;
