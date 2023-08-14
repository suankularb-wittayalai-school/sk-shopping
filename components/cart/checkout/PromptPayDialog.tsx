import { StylableFC } from "@/utils/types/common";

const PromptPayDialog: StylableFC<{
  total: number;
  promptpayNumber: string;
  onClose: () => void;
  onSubmit: (file: File) => void;
}> = ({ total, promptpayNumber, onClose, onSubmit, style, className }) => {
  return null;
};

export default PromptPayDialog;
