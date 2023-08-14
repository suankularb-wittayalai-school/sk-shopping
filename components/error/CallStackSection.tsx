// Imports
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

/**
 * The call stack for Page Fallback.
 *
 * @param error The error with the call stack to render.
 */
const CallStackSection: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation("common");

  return (
    <section
      aria-labelledby="header-call-stack"
      className="flex flex-col gap-1"
    >
      <Text
        type="title-medium"
        element={(props) => <h3 id="header-call-stack" {...props} />}
      >
        {t("error.client.callStack")}
      </Text>
      <Text
        type="body-small"
        element="pre"
        className="overflow-x-auto pb-2 !font-mono sm:max-h-[20rem]"
      >
        {error.stack || error.message}
      </Text>
    </section>
  );
};

export default CallStackSection;
