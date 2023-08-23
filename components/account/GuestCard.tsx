// Imports
import UseVector from "@/components/UseVector";
import cn from "@/utils/helpers/cn";
import { useOneTapSignin } from "@/utils/helpers/useOneTapSignin";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Card,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Card inviting the user to log in.
 */
const GuestCard: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("account", { keyPrefix: "guest" });

  useOneTapSignin({ parentButtonID: "button-google-sign-in" });

  return (
    <Card
      appearance="outlined"
      direction="row"
      style={style}
      className={cn(
        `relative isolate gap-4 overflow-hidden !bg-transparent pb-4 pl-2 pr-4
        pt-2 sm:!bg-surface`,
        className,
      )}
    >
      <UseVector
        href="blob-card-left"
        className="absolute inset-0 right-auto -z-10 hidden sm:block"
      />
      <MaterialIcon icon="account_circle" size={48} className="opacity-80" />
      <div>
        <Text type="title-medium" element="h2">
          {t("title")}
        </Text>
        <Text type="body-medium" className="mt-1">
          {t("desc")}
        </Text>
        <Actions className="mt-3">
          <div
            id="button-google-sign-in"
            className={cn(`h-[38px] min-w-[3.5rem] rounded-full
              [color-scheme:light] [&:not(:has(iframe))]:animate-pulse
              [&:not(:has(iframe))]:bg-surface-variant`)}
          />
        </Actions>
      </div>
    </Card>
  );
};

export default GuestCard;
