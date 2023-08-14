// Imports
import CartListingOption from "@/components/cart/CartListingOption";
import ShopLogo from "@/components/landing/ShopLogo";
import cn from "@/utils/helpers/cn";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { Cart } from "@/utils/types/cart";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  MaterialIcon,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import Link from "next/link";
import shortUUID from "short-uuid";

const ShopCart: StylableFC<{ cart: Cart }> = ({ cart, style, className }) => {
  const { items, shop } = cart;

  const getLocaleString = useGetLocaleString();

  const { fromUUID } = shortUUID();

  return (
    <motion.li layout style={{ borderRadius: 28 }} className="overflow-hidden">
      <Card
        appearance="filled"
        style={style}
        className={cn(`divide-y-1 divide-outline !rounded-none`, className)}
      >
        <CardHeader
          avatar={<ShopLogo shop={shop} showBackground />}
          title={getLocaleString(shop.name)}
        />
        <List>
          {items.map((item) => (
            <CartListingOption key={item.item.id} {...item} shopID={shop.id} />
          ))}
        </List>
        <CardContent>
          <Actions className="!mt-0">
            <Button
              appearance="filled"
              icon={<MaterialIcon icon="shopping_cart_checkout" />}
              href={`/cart/checkout/${fromUUID(shop.id)}`}
              element={Link}
            >
              สั่งซื้อ
            </Button>
          </Actions>
        </CardContent>
      </Card>
    </motion.li>
  );
};

export default ShopCart;
