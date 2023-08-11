// Imports
import { Address } from "@/utils/types/address";

export type User = {
  id: string,
  username: string,
  email: String,
  profile: string | null,
  first_name: string | null,
  last_name: string | null,
  created_at: string | null,
  addresses: Address[],
}