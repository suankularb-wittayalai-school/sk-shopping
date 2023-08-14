// Imports
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
  ListItem,
  ListItemContent,
  MaterialIcon,
} from "@suankularb-components/react";

const ShopCart: StylableFC<{ cart: Cart }> = ({ cart, style, className }) => {
  const { items, shop } = cart;

  const getLocaleString = useGetLocaleString();

  return (
    <Card
      appearance="filled"
      style={style}
      className={cn(`divide-y-1 divide-outline !rounded-xl`, className)}
    >
      <CardHeader
        avatar={<ShopLogo shop={shop} showBackground />}
        title={getLocaleString(shop.name)}
      />
      <List>
        {items.map(({ item, amount }) => (
          <ListItem key={item.id} align="center" lines={1}>
            <ListItemContent title={item.name} />
            <ListItemContent title={`฿${item.price}`} />
            {amount}
          </ListItem>
        ))}
      </List>
      <CardContent>
        <Actions className="!mt-0">
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="shopping_cart_checkout" />}
          >
            สั่งซื้อ
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default ShopCart;
