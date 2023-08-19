// Imports
import AdvertBanner from "@/components/landing/AdvertBanner";
import CollectionCard from "@/components/landing/CollectionCard";
import ShopCard from "@/components/landing/ShopCard";
import ShopLogo from "@/components/landing/ShopLogo";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { Collection } from "@/utils/types/collection";
import { LangCode } from "@/utils/types/common";
import { Shop, ShopCompact } from "@/utils/types/shop";
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
import { group } from "radash";

/**
 * The Landing page displays some paid advertisements and the list of all Shops
 * and Collections to browse through.
 *
 * @param shops All Shops.
 * @param collectionGroups All Collections grouped by Shop ID.
 */
const LandingPage: NextPage<{
  shops: ShopCompact[];
  collectionGroups: { [key: Shop["id"]]: Collection[] };
}> = ({ shops, collectionGroups }) => {
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("landing");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("appName")}</title>
      </Head>
      <AdvertBanner />
      <ContentLayout className="relative z-10 !pt-0">
        {/* Advertisements */}
        <Section>
          {/* <Columns columns={2} className="!grid-cols-1 md:!grid-cols-2">
            <AdvertCard />
            <AdvertCard />
          </Columns> */}
          <Text
            type="body-small"
            element="p"
            className="text-end text-on-surface-variant"
          >
            {t("advert.note.desc")}&nbsp;&nbsp;
            {/* <a
              href="https://forms.gle/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              {t("advert.note.link")}
            </a> */}
          </Text>
        </Section>

        {/* Shops */}
        <Section>
          <Header>{t("shops.title")}</Header>
          <Columns columns={4} element="ul">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </Columns>
        </Section>

        {/* Collections */}
        <Section>
          <Header>{t("collections.title")}</Header>
          {Object.keys(collectionGroups).map((shopID) => {
            const shop = shops.find((shop) => shopID === shop.id)!;
            return (
              <Section key={shopID}>
                <Header
                  level={3}
                  icon={
                    <ShopLogo shop={shop} showBackground className="h-7 w-7" />
                  }
                >
                  {getLocaleString(shop.name)}
                </Header>
                <Columns
                  columns={2}
                  element="ul"
                  className="!grid-cols-1 md:!grid-cols-2"
                >
                  {collectionGroups[shopID].map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      shop={shop}
                    />
                  ))}
                </Columns>
              </Section>
            );
          })}
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const jimmy = await createJimmy();

  const { data: shops, error: shopsError } = await jimmy.fetch<ShopCompact[]>(
    "/shops",
    { query: { fetch_level: "compact" } },
  );
  if (shopsError) logError("index getStaticProps (shops)", shopsError);

  const { data: collections, error: collectionsError } = await jimmy.fetch<
    Collection[]
  >("/collections");
  if (collectionsError)
    logError("index getStaticProps (collections)", collectionsError);
  const collectionGroups = group(
    collections!,
    (collection) => collection.shop.id,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "landing",
      ])),
      shops,
      collectionGroups,
    },
    revalidate: 300,
  };
};

export default LandingPage;
