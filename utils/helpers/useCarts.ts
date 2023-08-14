// Imports
import { Cart } from "@/utils/types/cart";
import { ListingOption } from "@/utils/types/listing-option";
import { ShopCompact } from "@/utils/types/shop";
import { replace } from "radash";
import { useEffect, useState } from "react";

const CART_LOCAL_STORAGE_KEY = "carts";

export default function useCarts() {
  const [carts, setCarts] = useState<Cart[]>();
  useEffect(() => {
    const data = window.localStorage.getItem(CART_LOCAL_STORAGE_KEY);
    if (data) setCarts(JSON.parse(data));
    else setCarts([]);
  }, []);
  if (typeof window !== "undefined" && carts) {
    console.log()
    window.localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(carts));
  }

  // `cum` means “cumulative,” duh
  const totalItemCount = carts?.reduce(
    (cum, { items }) => cum + items.length,
    0,
  );

  function addItem(item: ListingOption, amount: number, shop: ShopCompact) {
    if (!carts) return;
    const existingCart = carts.find((cart) => shop.id === cart.shop.id);
    const existingItem = existingCart?.items.find(
      (mapItem) => item.id === mapItem.item.id,
    );

    if (existingCart)
      setCarts(
        replace(
          carts,
          {
            ...existingCart,
            items: existingItem
              ? replace(
                  existingCart.items,
                  { ...existingItem, amount: existingItem.amount + amount },
                  (mapItem) => item.id === mapItem.item.id,
                )
              : [...existingCart.items, { item, amount }],
          },
          (cart) => shop.id === cart.shop.id,
        ),
      );
    else setCarts([...carts, { items: [{ item, amount }], shop }]);
  }

  function removeItem(itemID: string, shopID: string) {}

  // function setItemAmount(item: ListingOption, amount: number, shopID: string) {
  //   if (!carts) return;
  //   setCarts(
  //     carts.map((cart) =>
  //       shopID === cart.shop.id
  //         ? {
  //             ...cart,
  //             items: cart.items.map((mapItem) =>
  //               item.id === mapItem.item.id
  //                 ? { ...mapItem, item: { ...mapItem.item, amount } }
  //                 : d,
  //             ),
  //           }
  //         : cart,
  //     ),
  //   );
  // }

  function removeCart(item: ListingOption, amount: number, shopID: string) {
    if (!carts) return;
    setCarts(carts.filter((cart) => shopID !== cart.shop.id));
  }

  function removeAllCarts() {
    setCarts([]);
  }

  return {
    carts,
    totalItemCount,
    addItem,
    removeItem,
    // setItemAmount,
    removeCart,
    removeAllCarts,
  };
}
