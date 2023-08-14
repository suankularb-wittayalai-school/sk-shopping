import { ListingOption } from "@/utils/types/listing-option";
import { ShopCompact } from "@/utils/types/shop";

export type Cart = {
  items: {
    item: ListingOption;
    amount: number;
  }[];
  shop: ShopCompact;
};
