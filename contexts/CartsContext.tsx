// Imports
import useCarts from "@/utils/helpers/useCarts";
import { createContext } from "react";

/**
 * A Context that allows read and edit access to Carts.
 */
const CartsContext = createContext<ReturnType<typeof useCarts>>({
  carts: undefined,
  totalItemCount: undefined,
  addItem: () => {},
  removeItem: () => {},
  // setItemAmount: () => {},
  removeCart: () => {},
  removeAllCarts: () => {},
});

export default CartsContext;
