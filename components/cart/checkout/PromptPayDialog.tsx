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
import Image from "next/image";
import { useState } from "react";

const PromptPayDialog: StylableFC<{
  src: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}> = ({ src, open, onClose, onSubmit, style, className }) => {
  const locale = useLocale();

  const [file, setFile] = useState<File>();

  return (
    <Dialog
      open={open}
      width={320}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader desc="สแกนรหัส QR ด้านล้างเพื่อชำระเงิน เมื่อชำระแล้ว ให้แนบสลิปมาเป็นหลักฐานด้วย" />
      <DialogContent className="flex flex-col gap-6 px-6">
        <Image
          src={src}
          width={222}
          height={222}
          alt="รหัส QR พร้อมเพย์"
          className="mx-auto aspect-square w-full rounded-md bg-surface"
        />
        <TextField<File>
          appearance="outlined"
          label="แนบสลิป"
          required
          onChange={setFile}
          locale={locale}
          inputAttr={{ type: "file", accept: "image/*" }}
        />
      </DialogContent>
      <Actions align="full">
        <Button appearance="filled" onClick={() => file && onSubmit(file)}>
          บันทึกสลิป
        </Button>
      </Actions>
    </Dialog>
  );
};

export default PromptPayDialog;
