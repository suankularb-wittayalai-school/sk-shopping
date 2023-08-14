// Imports
import { Category } from "@/utils/types/category";
import { Collection } from "@/utils/types/collection";
import { ListingOption } from "@/utils/types/listing-option";
import { Shop } from "@/utils/types/shop";

export type Listing = {
  id: string;
  name: string;
  description: string;
  shop: Shop;
  thumbnail_url: string | null;
  preorder_start: string | null;
  preorder_end: string | null;
  price: number;
  discounted_price: number | null;
  lifetime_stock: number;
  amount_sold: number;
  variants: ListingOption[];
  categories: Category["name"][];
  is_hidden: boolean;
};

export type ListingCompact = Omit<
  Listing,
  | "preorder_start"
  | "preorder_end"
  | "lifetime_stock"
  | "amount_sold"
  | "variants"
  | "categories"
> & { is_sold_out: boolean };
export type ListingDetailed = Listing & { collections: Collection[] };
