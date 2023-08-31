// Imports
import PageHeader from "@/components/PageHeader";
import UseIcon from "@/components/icon/UseIcon";
import ListingCard from "@/components/shop/ListingCard";
import AppStateContext from "@/contexts/AppStateContext";
import cn from "@/utils/helpers/cn";
import createJimmy from "@/utils/helpers/createJimmy";
import insertLocaleIntoStaticPaths from "@/utils/helpers/insertLocaleIntoStaticPaths";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { Category } from "@/utils/types/category";
import { LangCode } from "@/utils/types/common";
import { ListingCompact } from "@/utils/types/listing";
import {
  Card,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  Tab,
  TabsContainer,
  Text,
} from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { dash } from "radash";
import { useContext, useEffect, useState } from "react";

/**
 * The Category page displays Listings in a Category.
 */
const CategoryPage: NextPage<{
  categories: Category[];
  selectedCategory: Category;
  listings: ListingCompact[];
}> = ({ categories, selectedCategory, listings }) => {
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("categories");
  const { t: tx } = useTranslation("common");

  const { setActiveNav } = useContext(AppStateContext);
  useEffect(() => setActiveNav("categories"), []);

  const [selectedTab, setSelectedTab] = useState(selectedCategory.id);

  return (
    <>
      <Head>
        <title>
          {tx("tabName", { tabName: getLocaleString(selectedCategory.name) })}
        </title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout
        className={cn(`[&_.skc-tabs-container]:!-mt-4
          [&_.skc-tabs-container]:!overflow-x-auto`)}
      >
        <TabsContainer
          appearance="secondary"
          alt="รายการประเภท"
          className="!mx-0 !w-fit"
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              icon={
                {
                  "9fc62b37-4e36-43b0-9751-5f1bdc324b70": (
                    <UseIcon
                      icon="t-shirt"
                      filled={selectedTab === category.id}
                    />
                  ),
                  "ff488cb3-bf1d-422e-9820-00d2085562b9": (
                    <MaterialIcon icon="join" />
                  ),
                  "e5ec863b-11b6-45cd-883f-899de8a59a3b": (
                    <UseIcon icon="hat" filled={selectedTab === category.id} />
                  ),
                  "550e00a1-773d-4ec2-b265-dc67b3cb1bfd": (
                    <MaterialIcon icon="shopping_bag" />
                  ),
                  "fd324ec2-d6d5-4657-9d39-43eab2734462": (
                    <MaterialIcon icon="design_services" />
                  ),
                  "15d9ee24-4877-4aa8-80d8-7c9d04281c7b": (
                    <MaterialIcon icon="format_list_bulleted" />
                  ),
                  "71ae9310-1e0f-4825-8a9f-daaff12f8b92": (
                    <MaterialIcon icon="box" />
                  ),
                }[category.id]
              }
              label={getLocaleString(category.name)}
              selected={selectedTab === category.id}
              onClick={() => setSelectedTab(category.id)}
              href={`/category/${dash(category.name["en-US"]!)}`}
              element={Link}
              className="!w-fit whitespace-nowrap px-4"
            />
          ))}
        </TabsContainer>
        <Section>
          <Header className="sr-only">
            {getLocaleString(selectedCategory.name)}
          </Header>
          {listings.length ? (
            <Columns columns={4}>
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  size="large"
                  listing={listing}
                  showShop
                />
              ))}
            </Columns>
          ) : (
            <Card
              appearance="outlined"
              className="grid h-56 place-content-center p-6 !text-center"
            >
              <Text type="body-medium">{t("empty")}</Text>
            </Card>
          )}
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const jimmy = await createJimmy();

  const categoryName = params!.categoryName as string;

  const { data: categories, error: categoriesError } = await jimmy.fetch<
    Category[]
  >("/categories");
  if (categoriesError)
    logError("/category/:name getStaticProps (categories)", categoriesError);

  const selectedCategory = categories!.find(
    (category) => categoryName === dash(category.name["en-US"]!),
  );
  if (!selectedCategory) return { notFound: true };

  const { data: listings, error: listingsError } = await jimmy.fetch<
    ListingCompact[]
  >("/listings", {
    query: {
      fetch_level: "compact",
      descendant_fetch_level: "compact",
      filter: {
        data: { category_ids: [selectedCategory.id], is_hidden: "false" },
      },
    },
  });
  if (listingsError)
    logError("/category/:name getStaticProps (listings)", listingsError);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "categories",
        "shop",
      ])),
      categories,
      selectedCategory,
      listings: listings!.sort((a, b) =>
        a.is_sold_out && !b.is_sold_out
          ? 1
          : !a.is_sold_out && b.is_sold_out
          ? -1
          : 0,
      ),
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const jimmy = await createJimmy();
  const { data: categories } = await jimmy.fetch<Category[]>("/categories");

  return {
    paths: insertLocaleIntoStaticPaths(
      categories!.map((category) => ({
        params: { categoryName: dash(category.name["en-US"]!) },
      })),
    ),
    fallback: "blocking",
  };
};

export default CategoryPage;

