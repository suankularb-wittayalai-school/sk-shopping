// Imports
import { Collection } from "@/utils/types/collection";
import { Listing } from "@/utils/types/listing";
import { Shop } from "@/utils/types/shop";

export type ListingOption = {
  id: string;
  name: String;
  variant_name: string | null;
  price: number;
  discounted_price: number | null;
  lifetime_stock: number;
  amount_sold: number;
  preorder_start: string | null;
  preorder_end: string | null;
  colors: string[];
  image_urls: string[];
};

export type ListingOptionCompact = Omit<
  ListingOption,
  "preorder_start" | "preorder_end" | "images_url"
>;
export type ListingOptionDetailed = ListingOption & {
  shop: Shop;
  listing: Listing;
  collections: Collection[];
};
