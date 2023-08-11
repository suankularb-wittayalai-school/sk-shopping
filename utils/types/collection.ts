// Imports
import { Listing } from "@/utils/types/listing";
import { ListingOption } from "@/utils/types/listing-option";
import { Shop } from "@/utils/types/shop";

export type Collection = {
  id: string;
  name: string;
  description: string;
  foreground_url: string | null;
  background_url: string | null;
  shop: Shop;
};

export type CollectionCompact = Omit<Collection, "shop">;
export type CollectionDetailed = Collection & {
  items: ListingOption[];
  listings: Listing[];
};
