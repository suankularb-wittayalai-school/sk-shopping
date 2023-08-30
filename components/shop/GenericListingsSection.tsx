// Imports
import ListingCard from "@/components/shop/ListingCard";
import { StylableFC } from "@/utils/types/common";
import { ListingCompact } from "@/utils/types/listing";
import { Columns, Header, Section } from "@suankularb-components/react";

/**
 * For a Section of Listings that are not Collections.
 * 
 * @param title The title of the Section.
 * @param listings The Listings to display.
 * @param selected The selected Listing.
 * @param onCardClick Triggers when a Listing Card is clicked.
 */
const GenericListingsSection: StylableFC<{
  title: string;
  listings: ListingCompact[];
  selected?: ListingCompact;
  onCardClick: (listing: ListingCompact) => void;
}> = ({ title, listings, selected, onCardClick, style, className }) => {
  // Don’t render if there are no Listings.
  if (listings.length === 0) return;

  return (
    <Section style={style} className={className}>
      <Header>{title}</Header>
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

export default GenericListingsSection;
