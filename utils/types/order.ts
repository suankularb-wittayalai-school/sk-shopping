// Imports
import { ListingOption } from "@/utils/types/listing-option";
import { User } from "@/utils/types/user";

export type OrderItem = {
  id: string;
  item: ListingOption;
  amount: number;
};

export type OrderStatus = "not_shipped_out" | "pending" | "delivered";
export type DeliveryType = "school_pickup" | "delivery";
export type PaymentMethod = "cod" | "promptpay";

export type Order = {
  id: string;
  is_paid: boolean;
  shipment_status: OrderStatus;
  total_price: number;
  delivery_type: DeliveryType;
  items: OrderItem[];
  street_address_line_1: string | null;
  street_address_line_2: string | null;
  zip_code: string | null;
  province: string | null;
  district: string | null;
  pickup_location: string[] | null;
  buyer: User | null;
  receiver_name: string;
};

export type CompactOrder = Omit<
  Order,
  | "items"
  | "street_address_line_1"
  | "street_address_line_2"
  | "zip_code"
  | "province"
  | "district"
  | "pickup_location"
  | "buyer"
>;
