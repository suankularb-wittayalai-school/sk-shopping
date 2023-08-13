import { ListingCompact } from "@/utils/types/listing";
import { FC } from "react";

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

export default PriceDisplay;
