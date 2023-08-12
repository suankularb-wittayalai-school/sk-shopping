// Imports
import PageHeader from "@/components/PageHeader";
import CollectionSection from "@/components/shop/CollectionSection";
import ListingDetailsSection from "@/components/shop/ListingDetailsSection";
import NoCollectionSection from "@/components/shop/NoCollectionSection";
import createJimmy from "@/utils/helpers/createJimmy";
import insertLocaleIntoStaticPaths from "@/utils/helpers/insertLocaleIntoStaticPaths";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { IDOnly, LangCode } from "@/utils/types/common";
import { HybridListing, Listing } from "@/utils/types/listing";
import { DetailedShop } from "@/utils/types/shop";
import { Columns, ContentLayout, Section } from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { omit } from "radash";
import { useState } from "react";
import shortUUID from "short-uuid";

const ShopPage: NextPage<{
  shop: Omit<DetailedShop, "listings"> & {
    listings: HybridListing[];
  };
}> = ({ shop }) => {
  const router = useRouter();
  const getLocaleString = useGetLocaleString();

  const { fromUUID } = shortUUID();

  const [selected, setSelected] = useState<HybridListing>();

  function handleCardClick(listing: HybridListing) {
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

  return (
    <>
      <PageHeader parentURL="/" className="inset-0 bottom-auto z-40 md:fixed">
        ร้านค้า{getLocaleString(shop.name)}
      </PageHeader>

      <ContentLayout className="md:!mt-[4.25rem]">
        <Columns columns={2} className="sm:!grid-cols-1 md:!grid-cols-2">
          <Section>
            {shop.collections.map((collection) => (
              <CollectionSection
                key={collection.id}
                collection={collection}
                listings={shop.listings.filter((listing) =>
                  listing.collections.find(
                    (mapCollection) => collection.id === mapCollection.id,
                  ),
                )}
                selected={selected}
                onCardClick={handleCardClick}
              />
            ))}
            <NoCollectionSection
              listings={shop.listings.filter(
                (listing) => listing.collections.length === 0,
              )}
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
              className="pointer-events-auto h-full"
            />
          </div>
        </Columns>

        <style jsx global>{`
          @media only screen and (min-width: 905px) {
            .skc-page-header__blobs.skc-page-header__blobs--desktop {
              position: fixed;
              top: 0;
              z-index: 20;
              pointer-events: none;
            }
          }
        `}</style>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const jimmy = await createJimmy();
  const { toUUID } = shortUUID();

  const shopID = toUUID(params!.shopID as string);
  const { data: shop } = await jimmy.fetch<DetailedShop>(`/shops/${shopID}`, {
    query: { fetch_level: "detailed", descendant_fetch_level: "detailed" },
  });

  shop!.collections = shop!.collections.sort((a, b) =>
    a.name > b.name ? 1 : -1,
  );

  shop!.listings = shop!.listings
    // Sort Listings by popularity
    .sort((a, b) => a.amount_sold - b.amount_sold)
    // Remove Listings marked as hidden
    .filter((listing) => !listing.is_hidden)
    // Transform Listing into Listing Compact but keeping Collections information
    .map((listing) => ({
      ...omit(listing, ["lifetime_stock", "amount_sold"]),
      is_sold_out: listing.lifetime_stock === 0,
    })) as unknown as Listing[];

  // Blank out Items
  shop!.items = [];

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "shop"])),
      shop,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const jimmy = await createJimmy();
  const { fromUUID } = shortUUID();

  const { data: shops } = await jimmy.fetch<IDOnly[]>("/shops", {
    query: { fetch_level: "id_only" },
  });

  return {
    paths: insertLocaleIntoStaticPaths(
      shops!.map((shop) => ({ params: { shopID: fromUUID(shop.id) } })),
    ),
    fallback: "blocking",
  };
};

export default ShopPage;
