// Imports
import ListingCard from "@/components/shop/ListingCard";
import { StylableFC } from "@/utils/types/common";
import { ListingCompact } from "@/utils/types/listing";
import { Columns, Header, Section } from "@suankularb-components/react";

const NoCollectionSection: StylableFC<{
  listings: ListingCompact[];
  selected?: ListingCompact;
  onCardClick: (listing: ListingCompact) => void;
}> = ({ listings, selected, onCardClick, style, className }) =>
  listings.length ? (
    <Section style={style} className={className}>
      <Header>ไม่ได้อยู่ในคอลเลคชั่น</Header>
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
  ) : null;

export default NoCollectionSection;
