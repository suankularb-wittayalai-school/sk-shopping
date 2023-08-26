// Imports
import PageHeader from "@/components/PageHeader";
import ManageShopTabs from "@/components/account/manage/ManageShopTabs";
import cn from "@/utils/helpers/cn";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { IDOnly, LangCode } from "@/utils/types/common";
import { ShopCompact } from "@/utils/types/shop";
import { ContentLayout } from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Script from "next/script";
import { useTranslation } from "react-i18next";
import shortUUID from "short-uuid";

/**
 * A Plausible Analytics embed for a Shop.
 *
 * @param shop The Shop to display Plausible Analytics of.
 */
const AnalyticsPage: NextPage<{ shop: ShopCompact }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("manage", { keyPrefix: "analytics" });
  const { t: tx } = useTranslation(["common", "manage"]);

  const { fromUUID } = shortUUID();

  return (
    <>
      <Head>
        <title>
          {tx("tabName", {
            tabName: t("title", {
              ns: "manage",
              shop: getLocaleString(shop.name),
            }),
          })}
        </title>
      </Head>
      <Script async src="https://plausible.io/js/embed.host.js" />
      <PageHeader parentURL={`/account/manage/${fromUUID(shop.id)}`}>
        {tx("title", { ns: "manage", shop: getLocaleString(shop.name) })}
      </PageHeader>
      <ContentLayout className="!pb-0">
        <ManageShopTabs shopID={shop.id} />
      </ContentLayout>
      <iframe
        plausible-embed
        src={[
          "https://plausible.io/share/shopping.skkornor.org",
          "?auth=7b1ku1C1byv7iRqToWC9B",
          "&period=month",
          "&goal=Sales",
          `&props=%7B%22shop%22%3A%22${encodeURIComponent(
            getLocaleString(shop.name, "en-US"),
          ).replaceAll("%20", "+")}%22%7D`,
          "&embed=true",
          "&theme=system",
          "&background=transparent",
        ].join("")}
        loading="lazy"
        className={cn(`h-[calc(100dvh-8.3125rem)] w-full !bg-transparent
          [color-scheme:light]
          [mask-image:linear-gradient(to_bottom,transparent,black_3rem)]
          sm:px-[5.5rem] lg:px-0`)}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
}) => {
  const jimmy = await createJimmy(req);
  if (!jimmy.user) return { notFound: true };

  const { data: managingShops, error: shopsError } = await jimmy.fetch<
    IDOnly[]
  >(`/shops`, {
    query: { filter: { data: { manager_ids: [jimmy.user.id] } } },
  });
  if (shopsError)
    logError(
      "/account/manage/:id/orders getServerSideProps (shops)",
      shopsError,
    );

  const { toUUID } = shortUUID();
  const shopID = toUUID(params!.shopID as string);
  const { data: shop, error: shopError } = await jimmy.fetch<ShopCompact>(
    `/shops/${shopID}`,
    { query: { fetch_level: "compact" } },
  );
  if (shopError) {
    logError("/account/manage/:id/orders getServerSideProps (shop)", shopError);
    return { notFound: true };
  }

  if (!managingShops?.find((managingShop) => shop.id === managingShop.id))
    return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
        "receipt",
      ])),
      shop,
    },
  };
};

export default AnalyticsPage;
