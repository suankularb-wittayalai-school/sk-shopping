// Imports
import AdvertBanner from "@/components/landing/AdvertBanner";
import AdvertCard from "@/components/landing/AdvertCard";
import ShopCard from "@/components/landing/ShopCard";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { CompactShop } from "@/utils/types/shop";
import {
  Columns,
  ContentLayout,
  Header,
  Section,
  Text,
} from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const LandingPage: NextPage<{ shops: CompactShop[] }> = ({ shops }) => {
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
        <Section>
          <Header>ร้านค้าชุมนุม/องค์กร</Header>
          <Columns columns={4}>
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </Columns>
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const jimmy = await createJimmy();
  const { data: shops, error } = await jimmy.fetch("/shops", {
    query: { fetch_level: "compact" },
  });
  if (error) logError("index getStaticProps", error);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "landing",
      ])),
      shops,
    },
    revalidate: 300,
  };
};

export default LandingPage;
