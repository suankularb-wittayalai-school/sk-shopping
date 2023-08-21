// Imports
import cn from "@/utils/helpers/cn";
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { CompactOrder, Order } from "@/utils/types/order";
import { Dialog, Progress, Text } from "@suankularb-components/react";
import { differenceInSeconds } from "date-fns";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * The number of seconds allowed for the user to complete the PromptPay payment
 * before the Order is canceled.
 */
const TIMEOUT_SEC = 180;

/**
 * A Dialog shown to the user when as PromptPay Order has been successfully
 * initiated.
 *
 * @param order The Order to pay for.
 * @param open If the Dialog is open and shown.
 * @param onSubmit Triggers when the submit Button is pressed.
 */
const PromptPayDialog: StylableFC<{
  order: Order;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ order, open, onClose, onSubmit, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("checkout", { keyPrefix: "payment.promptpay" });

  const jimmy = useJimmy();

  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SEC);
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft =
        TIMEOUT_SEC -
        differenceInSeconds(new Date(), new Date(order.created_at));
      console.log(newTimeLeft);
      if (newTimeLeft <= 0) {
        onClose();
        return;
      }
      setTimeLeft(newTimeLeft);
      (async () => {
        const { data, error } = await jimmy.fetch<CompactOrder>(
          `/orders/${order.id}`,
          { query: { fetch_level: "compact" } },
        );
        if (error) logError("PromptPayDialog", error);
        else if (data.is_paid) onSubmit();
      })();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
          appearance="linear"
          alt="3-minute timer"
          value={Math.ceil((timeLeft / TIMEOUT_SEC) * 100)}
          visible
        />
      </div>
      <Image
        src={order.promptpay_qr_code_url!}
        width={652}
        height={432}
        alt={t("qrAlt")}
        className="mx-auto h-auto w-full rounded-md bg-surface"
      />
    </Dialog>
  );
};

export default PromptPayDialog;

