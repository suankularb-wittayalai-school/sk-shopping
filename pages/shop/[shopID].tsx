// Imports
import PageHeader from "@/components/PageHeader";
import CollectionSection from "@/components/shop/CollectionSection";
import FullscreenImageDialog from "@/components/shop/details/FullscreenImageDialog";
import ListingDetailsDialog from "@/components/shop/details/ListingDetailsDialog";
import ListingDetailsSection from "@/components/shop/details/ListingDetailsSection";
import GenericListingsSection from "@/components/shop/GenericListingsSection";
import AppStateContext from "@/contexts/AppStateContext";
import cn from "@/utils/helpers/cn";
import createJimmy from "@/utils/helpers/createJimmy";
import insertLocaleIntoStaticPaths from "@/utils/helpers/insertLocaleIntoStaticPaths";
import { logError } from "@/utils/helpers/logError";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import useJimmy from "@/utils/helpers/useJimmy";
import { Collection, CollectionDetailed } from "@/utils/types/collection";
import { IDOnly, LangCode } from "@/utils/types/common";
import { ListingCompact, ListingDetailed } from "@/utils/types/listing";
import { ListingOptionDetailed } from "@/utils/types/listing-option";
import { Shop } from "@/utils/types/shop";
import {
  Card,
  Columns,
  ContentLayout,
  Progress,
  Section,
  Text,
  useBreakpoint,
} from "@suankularb-components/react";
import { LayoutGroup } from "framer-motion";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import Head from "next/head";
import { useRouter } from "next/router";
import { omit, pick } from "radash";
import { useContext, useEffect, useState } from "react";
import { Balancer } from "react-wrap-balancer";
import shortUUID from "short-uuid";

/**
 * The Shop page allows users to browse Listings in a Shop. The Listings are
 * grouped by Collections shown on the left, and details on a selected Listing
 * are shown on the right.
 *
 * @param shop The Shop to display information about.
 * @param collections An array of objects with a Collection and Listings in that Collection.
 * @param orphanListings The Listings not in a Collection.
 */
const ShopPage: NextPage<{
  shop: Shop;
  collections: { collection: Collection; listings: ListingCompact[] }[];
  orphanListings: ListingCompact[];
}> = ({ shop, collections, orphanListings }) => {
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("shop");
  const { t: tx } = useTranslation("common");

  const { fromUUID, toUUID } = shortUUID();

  const router = useRouter();
  const jimmy = useJimmy();
  const plausible = usePlausible();

  const { atBreakpoint } = useBreakpoint();
  const { activeNav } = useContext(AppStateContext);

  // If the user is a manager of this Shop, fetch hidden Listings
  const [loading, setLoading] = useState(true);
  const [hiddenListings, setHiddenListings] = useState<ListingCompact[]>([]);
  useEffect(() => {
    const { user, status } = jimmy.user;
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    (async () => {
      // Fetch the Shops that the user is managing
      const { data: managingShops, error: shopsError } = await jimmy.fetch<
        IDOnly[]
      >(`/shops`, {
        query: { filter: { data: { manager_ids: [user!.id] } } },
      });
      if (shopsError) {
        logError("useIsManagerOfShop", shopsError);
        return;
      }

      // Check if the user is managing the given Shop
      if (!managingShops?.find((managingShop) => shop.id === managingShop.id))
        return;

      // Fetch hidden Listings
      const { data, error } = await jimmy.fetch<ListingCompact[]>(`/listings`, {
        query: {
          filter: { data: { shop_ids: [shop.id], is_hidden: true } },
          fetch_level: "compact",
        },
      });
      if (error) {
        logError("useEffect (hidden listings)", error);
        return;
      }
      setHiddenListings(data);
      setLoading(false);
    })();
  }, [jimmy.user.status]);

  /**
   * All the Listings in this Shop.
   */
  const listings = [
    ...collections.map((collection) => collection.listings).flat(),
    ...orphanListings,
    ...hiddenListings,
  ];
  const [selected, setSelected] = useState<ListingCompact>();

  // If a query is present, set the selected Listing to the one identified in
  // the query
  useEffect(() => {
    if (!router.query.selected) return;
    const selected = listings.find(
      (listing) => toUUID(router.query.selected as string) === listing.id,
    );
    if (!selected) return;
    plausible("View Listing", {
      props: {
        listing: selected.name,
        shop: getLocaleString(shop.name, "en-US"),
      },
    });
    setSelected(selected);
  }, [router.query.selected]);

  // Open Listing Details Dialog for mobile users
  // (Yes, we have to do this weirdness, otherwise `atBreakpoint` will always
  // be `base` for some reason thus will always open the Dialog)
  const [breakpointChecked, setBreakpointChecked] = useState<boolean>(false);
  useEffect(() => {
    if (atBreakpoint === "base" && !breakpointChecked)
      setBreakpointChecked(true);
    else if (selected && atBreakpoint === "base") setDialogOpen(true);
  }, [breakpointChecked]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /**
   * Set the selected Listing state and update the route to match.
   *
   * @param listing The Listing to update the state and route to.
   */
  function handleCardClick(listing: ListingCompact) {
    if (["base", "sm"].includes(atBreakpoint)) setDialogOpen(true);
    else if (selected?.id === listing.id) {
      setSelected(undefined);
      router.push(`/shop/${fromUUID(shop.id)}`, undefined, { shallow: true });
      return;
    }
    router.push(
      `/shop/${fromUUID(shop.id)}?selected=${fromUUID(listing.id)}`,
      undefined,
      { shallow: true },
    );
  }
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [image, setImage] = useState<string>();
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <>
      <Head>
        <title>
          {tx("tabName", {
            tabName: t("title", { shop: getLocaleString(shop.name) }),
          })}
        </title>
        <meta
          key="og-title"
          property="og:title"
          content={t("title", { shop: getLocaleString(shop.name) })}
        />
        <meta
          key="og-image"
          property="og:image"
          content={`/api/og/shop?shop=${encodeURIComponent(
            JSON.stringify(
              pick(shop, ["logo_url", "accent_color", "background_color"]),
            ),
          )}`}
        />
      </Head>

      <LayoutGroup>
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
          {t("title", { shop: getLocaleString(shop.name) })}
        </PageHeader>

        <ContentLayout className="md:!mt-[4.25rem]">
          <Columns columns={2} className="sm:!grid-cols-1 md:!grid-cols-2">
            {listings.length ? (
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
                <GenericListingsSection
                  title={t("list.noCollection")}
                  listings={orphanListings}
                  selected={selected}
                  onCardClick={handleCardClick}
                />
                <GenericListingsSection
                  title={t("list.hidden")}
                  listings={hiddenListings}
                  selected={selected}
                  onCardClick={handleCardClick}
                />
              </Section>
            ) : (
              <Card
                appearance="outlined"
                className={cn(`relative mx-4 flex h-[calc(100dvh-11rem)]
                  flex-col items-center justify-center gap-2 overflow-hidden
                  !bg-transparent p-6 sm:mx-0 sm:h-[calc(100dvh-8rem)]`)}
              >
                <Progress
                  appearance="linear"
                  visible={loading}
                  alt={t("list.empty.loading")}
                  className="absolute inset-0 bottom-auto"
                />
                <Text type="body-medium" element="p" className="text-center">
                  <Balancer>{t("list.empty.desc")}</Balancer>
                </Text>
                <Text
                  type="body-small"
                  element="p"
                  className="text-center !text-on-surface-variant"
                >
                  <Balancer>{t("list.empty.managerNote")}</Balancer>
                </Text>
              </Card>
            )}
          </Columns>
        </ContentLayout>

        <ContentLayout
          element="div"
          className={cn(`pointer-events-none fixed inset-0 top-[4.25rem] z-30
            !hidden md:!block`)}
        >
          <Columns columns={2}>
            <div className="h-[calc(100dvh-8rem)] md:col-start-2">
              <ListingDetailsSection
                shop={shop}
                listing={selected}
                setFullscreenImage={(image) => {
                  setImage(image);
                  setImageOpen(true);
                }}
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

        {selected && (
          <ListingDetailsDialog
            shop={shop}
            listing={selected}
            open={dialogOpen}
            setFullscreenImage={(image) => {
              setImage(image);
              setImageOpen(true);
            }}
            onClose={() => setDialogOpen(false)}
          />
        )}

        {image && (
          <FullscreenImageDialog
            src={image}
            width={1112}
            height={834}
            alt=""
            open={imageOpen}
            onClose={() => setImageOpen(false)}
          />
        )}
      </LayoutGroup>
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
              // Add `is_sold_out` key which is not present in
              // `ListingDetailed`
              is_sold_out: listing.lifetime_stock - listing.amount_sold === 0,
            }) as ListingCompact,
        )
        .sort((a, b) =>
          a.is_sold_out && !b.is_sold_out
            ? 1
            : !a.is_sold_out && b.is_sold_out
            ? -1
            : 0,
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
