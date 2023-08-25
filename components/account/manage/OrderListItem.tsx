import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import {
  Actions,
  Avatar,
  Button,
  ListItem,
  ListItemContent,
  MaterialIcon,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";

/**
 * A List Item inside the Manage Orders page that displays information about an
 * Order. The status of the Order can be changed via a Select.
 *
 * @param order The Order to display and/or modify.
 */
const OrderListItem: StylableFC<{
  order: Order;
}> = ({ order, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("manage");

  return (
    <ListItem
      align="bottom"
      lines={3}
      style={style}
      className={cn(`!grid !grid-cols-[3rem,1fr,2fr,5.5rem]`, className)}
    >
      <Avatar>
        {order.buyer?.profile && (
          <Image src={order.buyer.profile} width={48} height={48} alt="" />
        )}
      </Avatar>
      <ListItemContent
        title={order.receiver_name}
        desc={[
          new Date(order.created_at).toLocaleString(locale, {
            day: "numeric",
            month: "short",
            year:
              new Date(order.created_at).getFullYear() !==
              new Date().getFullYear()
                ? "numeric"
                : undefined,
            hour: "numeric",
            minute: "numeric",
          }),
          order.is_paid
            ? `จ่าย ฿${order.total_price.toLocaleString(locale)} แล้ว`
            : `ยังไม่ได้จ่าย ฿${order.total_price.toLocaleString(locale)}`,
        ].join(" • ")}
      />
      <ListItemContent
        title={order.items
          .map(({ item, amount }) => `${amount}×${item.name}`)
          .join(", ")}
      />
      <Actions>
        <Button appearance="tonal" icon={<MaterialIcon icon="print" />} />
        <Button appearance="tonal" icon={<MaterialIcon icon="done" />} />
      </Actions>
    </ListItem>
  );
};

export default OrderListItem;

