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
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import Link from "next/link";
import shortUUID from "short-uuid";

const ShopCart: StylableFC<{ cart: Cart }> = ({ cart, style, className }) => {
  const { items, shop } = cart;

  const getLocaleString = useGetLocaleString();

  const { fromUUID } = shortUUID();
  const { duration, easing } = useAnimationConfig();
  const layoutTransition = transition(duration.medium2, easing.standard);

  return (
    <motion.li
      layout
      transition={layoutTransition}
      style={{ borderRadius: 28 }}
      className="overflow-hidden"
    >
      <Card
        appearance="filled"
        style={style}
        className={cn(`divide-y-1 divide-outline !rounded-none`, className)}
      >
        <motion.div layout="position" transition={layoutTransition}>
          <CardHeader
            avatar={<ShopLogo shop={shop} showBackground />}
            title={getLocaleString(shop.name)}
          />
        </motion.div>
        <motion.div layout="position" transition={layoutTransition}>
          <List>
            {items.map((item) => (
              <CartListingOption
                key={item.item.id}
                {...item}
                shopID={shop.id}
              />
            ))}
          </List>
        </motion.div>
        <motion.div layout="position" transition={layoutTransition}>
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
        </motion.div>
      </Card>
    </motion.li>
  );
};

export default ShopCart;
