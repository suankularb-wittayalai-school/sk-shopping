// Imports
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from "@suankularb-components/react";

const PromptPayDialog: StylableFC<{
  total: number;
  promptpayNumber: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}> = ({
  total,
  promptpayNumber,
  open,
  onClose,
  onSubmit,
  style,
  className,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="flex flex-col gap-4 p-4 pb-0">
        <div className="aspect-square bg-surface" />
        <TextField
          appearance="outlined"
          label="Slip"
          inputAttr={{ type: "file", accept: "image/*" }}
        />
      </DialogContent>
      <Actions align="full">
        <Button appearance="filled">Send receipt</Button>
      </Actions>
    </Dialog>
  );
};

export default PromptPayDialog;
