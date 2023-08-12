// Imports
import ListingCard from "@/components/shop/ListingCard";
import cn from "@/utils/helpers/cn";
import { Collection } from "@/utils/types/collection";
import { StylableFC } from "@/utils/types/common";
import { HybridListing } from "@/utils/types/listing";
import { Columns, Header, Section, Text } from "@suankularb-components/react";
import shortUUID from "short-uuid";

const CollectionSection: StylableFC<{
  collection: Collection;
  listings: HybridListing[];
  selected?: HybridListing;
  onCardClick: (listing: HybridListing) => void;
}> = ({ collection, listings, selected, onCardClick, style, className }) => {
  const { fromUUID } = shortUUID();

  if (listings.length)
    return (
      <Section
        element={(props) => <section id={fromUUID(collection.id)} {...props} />}
        style={style}
        className={cn(`scroll-mt-[5.75rem]`, className)}
      >
        <Text type="title-medium" className="-mb-4 text-on-surface-variant">
          คอลเลคชั่น
        </Text>
        <Header>{collection.name}</Header>
        <Columns columns={2}>
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              size="large"
              listing={listing}
              selected={selected?.id === listing.id}
              onClick={() => onCardClick(listing)}
            />
          ))}
        </Columns>
      </Section>
    );
  return null;
};

export default CollectionSection;
