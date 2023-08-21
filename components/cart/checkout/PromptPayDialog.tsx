// Imports
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Progress,
  Text,
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
 * @param createdAt The date and time the Order was created.
 * @param open If the Dialog is open and shown.
 * @param onSubmit Triggers when the submit Button is pressed.
 */
const PromptPayDialog: StylableFC<{
  src: string;
  createdAt: Date;
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
      className={cn(`flex flex-col gap-6 p-6`, className)}
    >
      <div className="grid grid-cols-[1fr,3rem] gap-3">
        <Text type="body-medium" className="grow text-on-surface-variant">
          {t("desc")}
        </Text>
        <Progress
          appearance="circular"
          alt="3-minute timer"
          value={100}
          visible
        />
      </div>
      <Image
        src={src}
        width={652}
        height={432}
        alt={t("qrAlt")}
        className="mx-auto h-auto w-full rounded-md bg-surface"
      />
    </Dialog>
  );
};

export default PromptPayDialog;

