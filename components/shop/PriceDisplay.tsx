// Imports
import useLocale from "@/utils/helpers/useLocale";
import { ListingCompact } from "@/utils/types/listing";
import { FC } from "react";

const PriceDisplay: FC<{
  listing: Pick<ListingCompact, "price" | "discounted_price">;
}> = ({ listing }) => {
  const locale = useLocale();

  return (
    <>
      {listing.discounted_price && (
        <s className="opacity-80">
          {listing.price.toLocaleString(locale, {
            style: "currency",
            currency: "THB",
            maximumFractionDigits: 0,
          })}
        </s>
      )}{" "}
      <span
        className={
          listing.discounted_price ? "font-bold text-tertiary" : undefined
        }
      >
        {(listing.discounted_price || listing.price).toLocaleString(locale, {
          style: "currency",
          currency: "THB",
          maximumFractionDigits: 0,
        })}
      </span>
    </>
  );
};

export default PriceDisplay;
