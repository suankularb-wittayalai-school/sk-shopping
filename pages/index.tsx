// Imports
import PageHeader from "@/components/PageHeader";
import { LangCode } from "@/utils/types/common";
import {
  ContentLayout,
  Header,
  Section,
  Text,
} from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const IndexPage: NextPage = () => {
  const { t } = useTranslation("home");

  return (
    <>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout>
        <Section>
          <Header>{t("welcome.title")}</Header>
          <Text type="body-medium">{t("welcome.desc")}</Text>
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, ["common", "home"])),
  },
});

export default IndexPage;

