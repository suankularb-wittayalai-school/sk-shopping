// Imports
import ShopLogo from "@/components/landing/ShopLogo";
import OutOfStockBanner from "@/components/shop/OutOfStockBanner";
import PriceDisplay from "@/components/shop/PriceDisplay";
import cn from "@/utils/helpers/cn";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { StylableFC } from "@/utils/types/common";
import { ListingCompact } from "@/utils/types/listing";
import { ShopCompact } from "@/utils/types/shop";
import {
  Card,
  CardContent,
  CardHeader,
  Text,
} from "@suankularb-components/react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import shortUUID from "short-uuid";

/**
 * Create an internal URL to a Listing in its Shop.
 *
 * @param listing The Listing to create a URL to.
 *
 * @returns A URL string.
 */
function createListingURL(listing: Pick<ListingCompact, "id" | "shop">) {
  const { fromUUID } = shortUUID();
  return `/shop/${fromUUID(listing.shop.id)}?selected=${fromUUID(listing.id)}`;
}

/**
 * A small logo and text identifying the Shop this Listing belongs to.
 *
 * @param shop A compact Shop.
 */
const ShopTag: FC<{ shop: ShopCompact }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();

  return (
    <div className="grid grid-cols-[1rem,1fr] items-start gap-1">
      <ShopLogo shop={shop} showBackground className="h-4 w-4" />
      <Text type="body-small">{getLocaleString(shop.name)}</Text>
    </div>
  );
};

/**
 * The large configuration of Listing Card.
 *
 * @see {@link ListingCard Listing Card}
 */
const LargeListingCard: StylableFC<{
  listing: ListingCompact;
  showShop?: boolean;
  selected?: boolean;
  onClick?: () => void;
}> = ({ listing, showShop, selected, onClick }) => (
  <Card
    appearance="outlined"
    stateLayerEffect
    onClick={onClick}
    href={!onClick ? createListingURL(listing) : undefined}
    element={onClick ? "button" : Link}
    className={cn(
      `items-stretch overflow-hidden transition-colors`,
      selected && `!bg-primary-container !text-on-primary-container`,
    )}
  >
    <div
      className={cn(`relative grid aspect-[4/3] w-full place-content-center
        overflow-hidden rounded-sm bg-surface-variant`)}
    >
      {listing.thumbnail_url && (
        <Image
          src={listing.thumbnail_url}
          width={326}
          height={245}
          alt=""
          className="rounded-sm"
        />
      )}
      {listing.is_sold_out && <OutOfStockBanner />}
    </div>
    <CardContent>
      <div className="flex flex-col gap-0.5">
        <Text
          type="title-large"
          element={(props) => <h3 {...props} title={listing.name} />}
          className="truncate"
        >
          {listing.name}
        </Text>
        <Text type="body-large" className="text-on-surface-variant">
          <PriceDisplay listing={listing} />
        </Text>
      </div>
      <Text type="body-medium" className="h-20 overflow-hidden text-ellipsis">
        {listing.description}
      </Text>
      {showShop && <ShopTag shop={listing.shop} />}
    </CardContent>
  </Card>
);

/**
 * The small configuration of Listing Card.
 *
 * @see {@link ListingCard Listing Card}
 */
const SmallListingCard: StylableFC<{
  listing: ListingCompact;
  selected?: boolean;
  onClick?: () => void;
}> = ({ listing, selected, onClick }) => {
  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={onClick}
      href={!onClick ? createListingURL(listing) : undefined}
      element={onClick ? "button" : Link}
      className={cn(
        `overflow-hidden`,
        selected && `!bg-primary-container !text-on-primary-container`,
      )}
    >
      <div className="relative aspect-square h-[4.75rem] bg-surface-variant">
        {listing.thumbnail_url && (
          <Image
            src={listing.thumbnail_url}
            width={76}
            height={76}
            alt=""
            className="h-full object-cover"
          />
        )}
      </div>
      <CardHeader
        title={listing.name}
        subtitle={<PriceDisplay listing={listing} />}
        className="grow overflow-hidden [&_*]:truncate"
      />
    </Card>
  );
};

/**
 * A Card representing a Listing.
 *
 * @param size The size configuration of the Card, `large` or `small`. The `large` configuration shows more information.
 * @param listing A compact Listing.
 * @param showShop If the {@link ShopTag Shop Tag} is shown. Useful for when a Listing is outside the Shop page.
 * @param selected If the Listing is selected in a list.
 * @param onClick Triggers when the Card is pressed.
 */
const ListingCard: StylableFC<{
  size: "large" | "small";
  listing: ListingCompact;
  showShop?: boolean;
  selected?: boolean;
  onClick?: () => void;
}> = (props) => {
  const { size } = props;
  return {
    large: <LargeListingCard {...props} />,
    small: <SmallListingCard {...props} />,
  }[size];
};

export default ListingCard;
