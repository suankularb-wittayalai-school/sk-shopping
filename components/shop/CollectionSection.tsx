// Imports
import ListingCard from "@/components/shop/ListingCard";
import { Collection } from "@/utils/types/collection";
import { StylableFC } from "@/utils/types/common";
import { ListingCompact } from "@/utils/types/listing";
import { Columns, Header, Section, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import shortUUID from "short-uuid";

const CollectionSection: StylableFC<{
  collection: Collection;
  listings: ListingCompact[];
  selected?: ListingCompact;
  onCardClick: (listing: ListingCompact) => void;
}> = ({ collection, listings, selected, onCardClick, style, className }) => {
  const { t } = useTranslation("shop", { keyPrefix: "list" });

  const { fromUUID } = shortUUID();

  return (
    <Section style={style} className={className}>
      <Text
        type="title-medium"
        element={(props) => <a id={fromUUID(collection.id)} {...props} />}
        className="-mb-4 scroll-mt-[5.75rem] text-on-surface-variant"
      >
        {t("collection")}
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
};

export default CollectionSection;
