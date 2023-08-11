// Imports
import { Collection } from "@/utils/types/collection";
import { MultiLangString } from "@/utils/types/common";
import { Listing } from "@/utils/types/listing";
import { ListingOption } from "@/utils/types/listing-option";

export type Shop = {
  id: string;
  name: MultiLangString;
  accent_color: string[];
  background_color: string[];
  logo_url: string[];
  is_school_pickup_allowed: boolean;
  pickup_location: string[];
  is_delivery_allowed: boolean;
  accept_promptpay: boolean;
  promptpay_number: string[];
  accept_cod: boolean;
};

export type CompactShop = Omit<
  Shop,
  | "is_school_pickup_allowed"
  | "pickup_location"
  | "is_delivery_allowed"
  | "accept_promptpay"
  | "promptpay_number"
  | "accept_cod"
>;
export type DetailedShop = Shop & {
  listings: Listing[];
  collections: Collection[];
  items: ListingOption[];
};