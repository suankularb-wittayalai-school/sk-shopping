// Imports
import { Collection } from "@/utils/types/collection";
import { MultiLangString } from "@/utils/types/common";
import { Listing } from "@/utils/types/listing";
import { ListingOption } from "@/utils/types/listing-option";

export type Shop = {
  id: string;
  name: MultiLangString;
  accent_color: string | null;
  background_color: string | null;
  logo_url: string | null;
  is_school_pickup_allowed: boolean;
  pickup_location: string | null;
  is_delivery_allowed: boolean;
  accept_promptpay: boolean;
  promptpay_number: string | null;
  accept_cod: boolean;
};

export type ShopCompact = Omit<
  Shop,
  | "is_school_pickup_allowed"
  | "pickup_location"
  | "is_delivery_allowed"
  | "accept_promptpay"
  | "promptpay_number"
  | "accept_cod"
>;
export type ShopDetailed = Shop & {
  listings: Listing[];
  collections: Collection[];
  items: ListingOption[];
};
