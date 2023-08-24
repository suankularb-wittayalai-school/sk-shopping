// Imports
import { Cart } from "@/utils/types/cart";
import { ListingOption } from "@/utils/types/listing-option";
import { Order } from "@/utils/types/order";
import { ShopCompact } from "@/utils/types/shop";
import { replace } from "radash";
import { useEffect, useState } from "react";

const CARTS_LOCAL_STORAGE_KEY = "carts";
const ORDERS_LOCAL_STORAGE_KEY = "orders";

export default function useCarts() {
  // Carts
  const [carts, setCarts] = useState<Cart[]>();
  useEffect(() => {
    const data = window.localStorage.getItem(CARTS_LOCAL_STORAGE_KEY);
    if (data) setCarts(JSON.parse(data));
    else setCarts([]);
  }, []);

  // Update localStorage to match React state
  if (typeof window !== "undefined" && carts)
    window.localStorage.setItem(CARTS_LOCAL_STORAGE_KEY, JSON.stringify(carts));

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

  function removeItem(itemID: string, shopID: string) {
    if (!carts) return;
    setCarts(
      carts
        .map((cart) =>
          shopID === cart.shop.id
            ? {
                ...cart,
                items: cart.items.filter(
                  (mapItem) => itemID !== mapItem.item.id,
                ),
              }
            : cart,
        )
        .filter(({ items }) => items.length !== 0),
    );
  }

  function setItemAmount(item: ListingOption, amount: number, shopID: string) {
    if (!carts) return;
    if (amount === 0) {
      removeItem(item.id, shopID);
      return;
    }
    setCarts(
      carts.map((cart) =>
        shopID === cart.shop.id
          ? {
              ...cart,
              items: cart.items.map((mapItem) =>
                item.id === mapItem.item.id ? { ...mapItem, amount } : mapItem,
              ),
            }
          : cart,
      ),
    );
  }

  function removeCart(shopID: string) {
    if (!carts) return;
    setCarts(carts.filter((cart) => shopID !== cart.shop.id));
  }

  function removeAllCarts() {
    setCarts([]);
  }

  // Orders
  const [orders, setOrders] = useState<Order[]>();
  useEffect(() => {
    const data = window.localStorage.getItem(ORDERS_LOCAL_STORAGE_KEY);
    if (data) setOrders(JSON.parse(data));
    else setOrders([]);
  }, []);

  // Update localStorage to match React state
  if (typeof window !== "undefined" && orders)
    window.localStorage.setItem(
      ORDERS_LOCAL_STORAGE_KEY,
      JSON.stringify(orders),
    );

  function addOrder(order: Order) {
    if (!orders) return;
    setOrders([...orders, order]);
  }

  return {
    carts,
    totalItemCount,
    addItem,
    removeItem,
    setItemAmount,
    removeCart,
    removeAllCarts,
    orders,
    addOrder,
  };
}
