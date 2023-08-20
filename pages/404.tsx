// Imports
import MultiSchemeImage from "@/components/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";
import NotFoundDark from "@/public/images/error/404-dark.png";
import NotFoundLight from "@/public/images/error/404-light.png";
import { LangCode } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * 404 page.
 */
const NotFoundPage: NextPage = () => {
  const { t } = useTranslation("common", { keyPrefix: "error.404" });

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={NotFoundLight}
            srcDark={NotFoundDark}
            alt=""
          />
        }
        title={t("title")}
        code={404}
        verbose={t("verbose")}
        tabName={t("tabName")}
      >
        <Text type="body-large" element="p">
          {t("desc")}
        </Text>
      </ErrorHero>
    </ErrorLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common"]),
});

export default NotFoundPage;
