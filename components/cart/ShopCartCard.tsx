// Imports
import ShopCartItem from "@/components/cart/ShopCartItem";
import ShopLogo from "@/components/landing/ShopLogo";
import cn from "@/utils/helpers/cn";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { Cart } from "@/utils/types/cart";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  CardContent,
  CardHeader,
  List,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import Link from "next/link";
import shortUUID from "short-uuid";

/**
 * A Card displaying a Cart for a Shop.
 * 
 * @param cart The Cart to display the information of.
 */
const ShopCartCard: StylableFC<{
  cart: Cart;
}> = ({ cart, style, className }) => {
  const { items, shop } = cart;

  const getLocaleString = useGetLocaleString();

  const { fromUUID } = shortUUID();
  const { duration, easing } = useAnimationConfig();

  return (
    <motion.li
      layout="position"
      layoutId={shop.id}
      initial={{ opacity: 0, scaleY: 0.8, y: "-20%" }}
      animate={{ opacity: 1, scaleY: 1, y: "0%" }}
      exit={{ opacity: 0, scaleY: 0.8, y: "-20%" }}
      transition={transition(duration.medium2, easing.standard)}
      style={style}
      className={cn(
        `overflow-hidden rounded-xl border-1 border-outline-variant
        bg-surface-variant`,
        className,
      )}
    >
      <CardHeader
        avatar={<ShopLogo shop={shop} showBackground />}
        title={getLocaleString(shop.name)}
      />
      <List divided className="!mx-0.5 rounded-md !bg-surface">
        {items.map((item) => (
          <ShopCartItem key={item.item.id} {...item} shopID={shop.id} />
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
    </motion.li>
  );
};

export default ShopCartCard;