// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Progress, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Progress with a label showing the time left.
 *
 * @param seconds The number of seconds left.
 * @param totalSeconds The total number of seconds.
 */
const LabeledTimeProgress: StylableFC<{
  seconds: number;
  totalSeconds: number;
}> = ({ seconds, totalSeconds, style, className }) => {
  const { t } = useTranslation("checkout", { keyPrefix: "payment" });

  return (
    <div style={style} className={cn(`relative aspect-square`, className)}>
      <Progress
        appearance="circular"
        alt={t("countdownAlt")}
        value={(seconds / totalSeconds) * 100}
        visible={seconds >= 0}
      />
      {seconds >= 0 && (
        <Text
          type="overline"
          className={cn(`absolute left-0 right-0 top-1/2 m-auto block
      -translate-y-1/2 text-center text-primary
      [font-feature-settings:"tnum"on,"lnum"on]`)}
        >
          {[
            Math.floor(seconds / 60),
            seconds - Math.floor(seconds / 60) * 60, // Seconds
          ]
            .map((segment) => segment.toString().padStart(2, "0"))
            .join(":")}
        </Text>
      )}
    </div>
  );
};

export default LabeledTimeProgress;

