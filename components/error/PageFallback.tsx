// Imports
import MultiSchemeImage from "@/components/MultiSchemeImage";
import CallStackSection from "@/components/error/CallStackSection";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";
import ClientErrorDark from "@/public/images/error/client-dark.png";
import ClientErrorLight from "@/public/images/error/client-light.png";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

/**
 * The fallback for when the entire page fails to render due to an unrecoverable client-side error.
 * 
 * @param error The client-side error. Used to display the call stack.
 */
const PageFallback: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation("common", { keyPrefix: "error.client" });
  const { t: tx } = useTranslation("common");

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={ClientErrorLight}
            srcDark={ClientErrorDark}
            alt=""
          />
        }
        title={t("title")}
        verbose={t("verbose")}
        tabName={t("tabName")}
      >
        <div className="skc-body-large flex flex-col gap-2">
          <Text type="body-large" element="p">
            {t("desc")}
          </Text>
          <Text type="body-large" element="p">
            {tx("error.common.persistNotice")}
          </Text>
        </div>
      </ErrorHero>
      <CallStackSection error={error} />
    </ErrorLayout>
  );
};

export default PageFallback;
