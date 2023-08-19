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
  created_at: string;
  ref_id: string;
  is_paid: boolean;
  is_verified: boolean;
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
  payment_method: PaymentMethod;
  payment_slip_url: string | null;
  promptpay_qr_code_url: string | null;
  qr_code_file: string;
  contact_email: string;
  contact_phone_number: string | null;
};

export type CompactOrder = Pick<
  Order,
  | "id"
  | "receiver_name"
  | "is_paid"
  | "is_verified"
  | "shipment_status"
  | "total_price"
  | "delivery_type"
  | "payment_method"
>;
