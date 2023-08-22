// Imports
import ListingCard from "@/components/shop/ListingCard";
import { StylableFC } from "@/utils/types/common";
import { ListingCompact } from "@/utils/types/listing";
import { Columns, Header, Section } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

const NoCollectionSection: StylableFC<{
  listings: ListingCompact[];
  selected?: ListingCompact;
  onCardClick: (listing: ListingCompact) => void;
}> = ({ listings, selected, onCardClick, style, className }) => {
  const { t } = useTranslation("shop", { keyPrefix: "list" });

  if (listings.length === 0) return;
  return (
    <Section style={style} className={className}>
      <Header>{t("noCollection")}</Header>
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

export default NoCollectionSection;
