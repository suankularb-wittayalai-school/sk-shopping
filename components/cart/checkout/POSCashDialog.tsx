// Imports
import LabeledTimeProgress from "@/components/cart/checkout/LabeledTimeProgress";
import cn from "@/utils/helpers/cn";
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import { StylableFC } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import {
  Actions,
  Button,
  Dialog,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { differenceInSeconds } from "date-fns";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

/**
 * The number of seconds allowed for the Order to be marked as paid by the
 * cashier before the Order is canceled.
 */
const TIMEOUT_SEC = 180;

const POSCashDialog: StylableFC<{
  order: Pick<Order, "id" | "created_at">;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ order, open, onClose, onSubmit, style, className }) => {
  const { t } = useTranslation("checkout", { keyPrefix: "payment.posCash" });

  const jimmy = useJimmy();

  // Every 1 second, reduce `timeLeft` by 1
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SEC);
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate how much time is left until the order is canceled
      // (Using Date to prevent interval freeze caused by tabbing out)
      const newTimeLeft =
        TIMEOUT_SEC -
        differenceInSeconds(new Date(), new Date(order.created_at));

      // If the window to pay has passed, close the Dialog
      if (newTimeLeft <= 0) {
        onClose();
        return;
      }

      // Otherwise, set the new time left value and check if the order is paid
      setTimeLeft(newTimeLeft);
    }, 1000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const { error } = await jimmy.fetch(`/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { is_paid: true, is_verified: true } }),
    });
    if (error) {
      logError("POSCashDialog", error);
      setLoading(false);
      return;
    }
    setLoading(false);
    onSubmit();
  }

  return (
    <Dialog
      open={open}
      width={380}
      onClose={onClose}
      style={style}
      className={cn(`flex flex-col gap-6 p-6`, className)}
    >
      <div className="grid grid-cols-[1fr,3rem] gap-3">
        <Text type="body-medium" className="grow text-on-surface-variant">
          {t("desc")}
        </Text>
        <LabeledTimeProgress seconds={timeLeft} totalSeconds={TIMEOUT_SEC} />
      </div>
      <Actions align="full" className="!p-0">
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="close" />}
          dangerous
        >
          {t("action.cancel")}
        </Button>
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="done" />}
          loading={loading}
          onClick={handleSubmit}
        >
          {t("action.markAsPaid")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default POSCashDialog;
