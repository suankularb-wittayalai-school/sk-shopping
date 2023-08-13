// Imports
import PageHeader from "@/components/PageHeader";
import CollectionSection from "@/components/shop/CollectionSection";
import ListingDetailsSection from "@/components/shop/details/ListingDetailsSection";
import NoCollectionSection from "@/components/shop/NoCollectionSection";
import AppStateContext from "@/contexts/AppStateContext";
import createJimmy from "@/utils/helpers/createJimmy";
import insertLocaleIntoStaticPaths from "@/utils/helpers/insertLocaleIntoStaticPaths";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { Collection, CollectionDetailed } from "@/utils/types/collection";
import { IDOnly, LangCode } from "@/utils/types/common";
import { ListingCompact, ListingDetailed } from "@/utils/types/listing";
import { ListingOptionDetailed } from "@/utils/types/listing-option";
import { Shop } from "@/utils/types/shop";
import { Columns, ContentLayout, Section } from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { omit } from "radash";
import { useContext, useEffect, useState } from "react";
import shortUUID from "short-uuid";

const ShopPage: NextPage<{
  shop: Shop;
  collections: { collection: Collection; listings: ListingCompact[] }[];
  orphanListings: ListingCompact[];
}> = ({ shop, collections, orphanListings }) => {
  const router = useRouter();
  const getLocaleString = useGetLocaleString();

  const { fromUUID } = shortUUID();

  const { activeNav } = useContext(AppStateContext);

  const [selected, setSelected] = useState<ListingCompact>();
  const [scrolled, setScrolled] = useState(false);

  /**
   * Set the selected Listing state and update the route to match.
   *
   * @param listing The Listing to update the state and route to.
   */
  function handleCardClick(listing: ListingCompact) {
    if (selected?.id === listing.id) {
      setSelected(undefined);
      router.push(`/shop/${fromUUID(shop.id)}`, undefined, { shallow: true });
    } else {
      setSelected(listing);
      router.push(
        `/shop/${fromUUID(shop.id)}?selected=${fromUUID(listing.id)}`,
        undefined,
        { shallow: true },
      );
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <PageHeader
        parentURL={
          {
            landing: "/",
            categories: "/category/t-shirt",
            cart: "/cart",
            favorites: "/favorites",
            account: "/account",
          }[activeNav]
        }
        className="inset-0 bottom-auto z-40 md:fixed"
      >
        ร้านค้า{getLocaleString(shop.name)}
      </PageHeader>

      <ContentLayout className="md:!mt-[4.25rem]">
        <Columns columns={2} className="sm:!grid-cols-1 md:!grid-cols-2">
          <Section>
            {collections.map(({ collection, listings }) => (
              <CollectionSection
                key={collection.id}
                collection={collection}
                listings={listings}
                selected={selected}
                onCardClick={handleCardClick}
              />
            ))}
            <NoCollectionSection
              listings={orphanListings}
              selected={selected}
              onCardClick={handleCardClick}
            />
          </Section>
        </Columns>
      </ContentLayout>

      <ContentLayout
        element="div"
        className="pointer-events-none fixed inset-0 top-[4.25rem] z-30 !hidden md:!block"
      >
        <Columns columns={2}>
          <div className="h-[calc(100dvh-8rem)] md:col-start-2">
            <ListingDetailsSection
              shop={shop}
              listing={selected}
              onClose={() => setSelected(undefined)}
              className="pointer-events-auto h-full"
            />
          </div>
        </Columns>

        {scrolled && (
          <style jsx global>{`
            @media only screen and (min-width: 905px) {
              .skc-page-header__blobs.skc-page-header__blobs--desktop {
                position: fixed;
                top: 0;
                z-index: 20;
                pointer-events: none;
              }
            }

            @media only screen and (min-width: 1440px) {
              .skc-page-header__blobs.skc-page-header__blobs--desktop {
                top: -5rem;
              }
            }
          `}</style>
        )}
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const jimmy = await createJimmy();
  const { toUUID } = shortUUID();

  const shopID = toUUID(params!.shopID as string);
  const { data, error } = await jimmy.fetch<
    Shop & {
      listings: ListingDetailed[];
      collections: CollectionDetailed[];
      items: ListingOptionDetailed[];
    }
  >(`/shops/${shopID}`, {
    query: { fetch_level: "detailed", descendant_fetch_level: "detailed" },
  });
  if (error) {
    logError("/shop/:id getStaticProps", error);
    return { notFound: true };
  }

  // Convert `ShopDetailed` into `Shop`
  const shop = omit(data, ["listings", "collections", "items"]) as Shop;

  data.listings = data.listings
    // Sort Listings by popularity
    .sort((a, b) => a.amount_sold - b.amount_sold)
    // Remove Listings marked as hidden
    .filter((listing) => !listing.is_hidden);

  const collections = data.collections
    // Sort Collections reverse alphabetically
    // FIXME: This should be sorted by creation date
    // but `created_at` isn’t fetched so that ain’t gonna happen just yet
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    // Package Collection and Listings information together
    .map((collection) => ({
      collection,
      listings: data.listings
        // Include Listings in this Collection
        .filter((listing) =>
          listing.collections.find(
            (mapCollection) => collection.id === mapCollection.id,
          ),
        )
        // Transform `ListingDetailed` into `ListingCompact`
        .map(
          (listing) =>
            ({
              // Remove keys not in `ListingCompact`
              ...omit(listing, [
                "preorder_start",
                "preorder_end",
                "lifetime_stock",
                "amount_sold",
                "variants",
                "categories",
              ]),
              // Add `is_sold_out` key to replace `lifetime_stock`
              is_sold_out: listing.lifetime_stock === 0,
            }) as ListingCompact,
        ),
    }))
    // Remove Collections with no Listings per @smartwhatt’s request
    .filter((collection) => collection.listings.length !== 0);

  // All the Listings not in a Collection aren’t included in the `collections`
  // variable, so we need this
  const orphanListings = data.listings.filter(
    (listing) => listing.collections.length === 0,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "shop"])),
      shop,
      collections,
      orphanListings,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const jimmy = await createJimmy();
  const { fromUUID } = shortUUID();

  const { data: shops, error } = await jimmy.fetch<IDOnly[]>("/shops", {
    query: { fetch_level: "id_only" },
  });
  if (error) logError("/shop/:id getStaticPaths", error);

  return {
    paths: insertLocaleIntoStaticPaths(
      shops!.map((shop) => ({ params: { shopID: fromUUID(shop.id) } })),
    ),
    fallback: "blocking",
  };
};

export default ShopPage;
