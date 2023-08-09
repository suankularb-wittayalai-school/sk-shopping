// Imports
import AdvertBanner from "@/components/landing/AdvertBanner";
import AdvertCard from "@/components/landing/AdvertCard";
import { LangCode } from "@/utils/types/common";
import {
  Columns,
  ContentLayout,
  Section,
  Text,
} from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const LandingPage: NextPage = () => {
  const { t } = useTranslation("landing");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("appName")}</title>
      </Head>
      <AdvertBanner />
      <ContentLayout className="!pt-0">
        <Section>
          <Columns columns={2} className="!grid-cols-1 md:!grid-cols-2">
            <AdvertCard />
            <AdvertCard />
          </Columns>
          <Text
            type="body-small"
            element="p"
            className="text-end text-on-surface-variant"
          >
            พื้นที่เช่าโฆษณาสำหรับชุมนุม&nbsp;&nbsp;
            <a
              href="https://forms.gle/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              ติดต่อโฆษณา
            </a>
          </Text>
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, [
      "common",
      "landing",
    ])),
  },
});

export default LandingPage;
