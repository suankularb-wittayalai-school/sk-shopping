// Imports
import MultiSchemeImage from "@/components/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";
import ServerErrorDark from "@/public/images/error/500-dark.png";
import ServerErrorLight from "@/public/images/error/500-light.png";
import { LangCode } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ServerErrorPage: NextPage = () => {
  const { t } = useTranslation("common", { keyPrefix: "error.500" });
  const { t: tx } = useTranslation("common");

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={ServerErrorLight}
            srcDark={ServerErrorDark}
            alt=""
          />
        }
        title={t("title")}
        code={500}
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
    </ErrorLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common"]),
});

export default ServerErrorPage;
