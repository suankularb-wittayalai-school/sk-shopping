// Imports
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { StylableFC } from "@/utils/types/common";
import { ListingCompact } from "@/utils/types/listing";
import { CompactShop } from "@/utils/types/shop";
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

function createListingURL(listing: Pick<ListingCompact, "id" | "shop">) {
  const { fromUUID } = shortUUID();
  return `/shop/${fromUUID(listing.shop.id)}?selected=${fromUUID(listing.id)}`;
}

const PriceDisplay: FC<{
  listing: Pick<ListingCompact, "price" | "discounted_price">;
}> = ({ listing }) => (
  <>
    {listing.discounted_price && <s className="opacity-80">฿{listing.price}</s>}{" "}
    <span
      className={
        listing.discounted_price ? "font-bold text-tertiary" : undefined
      }
    >
      ฿{listing.discounted_price || listing.price}
    </span>
  </>
);

const ShopTag: FC<{ shop: CompactShop }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();

  return (
    <div className="grid grid-cols-[1rem,1fr] items-start gap-1">
      <div className="bg-surface-variant">
        {shop.logo_url && (
          <Image src={shop.logo_url} width={16} height={16} alt="" />
        )}
      </div>
      <Text type="body-small">{getLocaleString(shop.name)}</Text>
    </div>
  );
};

const LargeListingCard: StylableFC<{
  listing: ListingCompact;
  showShop?: boolean;
}> = ({ listing, showShop }) => (
  <Card
    appearance="outlined"
    stateLayerEffect
    href={createListingURL(listing)}
    element={Link}
    className="overflow-hidden"
  >
    <div className="aspect-[4/3] rounded-sm bg-surface-variant">
      {listing.thumbnail_url && <Image src={listing.thumbnail_url} alt="" />}
    </div>
    <CardContent>
      <div className="flex flex-col gap-0.5">
        <Text type="title-large" element="h3">
          {listing.name}
        </Text>
        <Text type="body-large" className="text-on-surface-variant">
          <PriceDisplay listing={listing} />
        </Text>
      </div>
      <Text type="body-medium">{listing.description}</Text>
      {showShop && <ShopTag shop={listing.shop} />}
    </CardContent>
  </Card>
);

const SmallListingCard: StylableFC<{
  listing: ListingCompact;
  showShop?: boolean;
}> = ({ listing, showShop }) => null;

const MiniListingCard: StylableFC<{
  listing: ListingCompact;
}> = ({ listing }) => {
  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      href={createListingURL(listing)}
      element={Link}
      className="overflow-hidden"
    >
      <div className="aspect-square h-[4.75rem] bg-surface-variant">
        {listing.thumbnail_url && <Image src={listing.thumbnail_url} alt="" />}
      </div>
      <CardHeader
        title={listing.name}
        subtitle={<PriceDisplay listing={listing} />}
        className="grow"
      />
    </Card>
  );
};

const ListingCard: StylableFC<{
  size: "large" | "small" | "mini";
  listing: ListingCompact;
  showShop?: boolean;
}> = (props) => {
  const { size } = props;
  return {
    large: <LargeListingCard {...props} />,
    small: <SmallListingCard {...props} />,
    mini: <MiniListingCard {...props} />,
  }[size];
};

export default ListingCard;
