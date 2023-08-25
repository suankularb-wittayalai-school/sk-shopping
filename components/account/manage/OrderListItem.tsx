// Imports
import ReceiptDialog from "@/components/cart/ReceiptDialog";
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
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { sift } from "radash";
import { useState } from "react";

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

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ListItem
      align="top"
      lines={3}
      style={style}
      className={cn(
        `!grid !pr-4
        md:!grid-cols-[3rem,minmax(0,1fr),minmax(0,1fr),minmax(0,1fr),5.5rem]`,
        className,
      )}
    >
      <Avatar>
        {order.buyer?.profile && (
          <Image src={order.buyer.profile} width={48} height={48} alt="" />
        )}
      </Avatar>
      <ListItemContent
        title={order.receiver_name}
        desc={sift([
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
          order.is_paid && order.is_verified
            ? `จ่าย ฿${order.total_price.toLocaleString(locale)} แล้ว`
            : `ยังไม่ได้จ่าย ฿${order.total_price.toLocaleString(locale)}`,
        ]).join(" • ")}
        className="[&>span:first-child]:truncate"
      />
      <ListItemContent
        title={<Text type="title-medium">สินค้าที่สั่งซื้อ</Text>}
        desc={order.items
          .map(({ item, amount }) => `${amount}×${item.name}`)
          .join(", ")}
        alt="สินค้าที่สั่งซื้อ"
      />
      <ListItemContent
        title={
          <Text type="title-medium">
            {
              {
                pos: "รับที่หน้าร้าน",
                school_pickup: "รับที่โรงเรียน",
                delivery: "รับที่ที่อยู่…",
              }[order.delivery_type]
            }
          </Text>
        }
        desc={
          order.delivery_type === "delivery"
            ? [
                order.street_address_line_1,
                order.street_address_line_2?.replace("\n", " "),
                order.district,
                order.province,
                order.zip_code,
              ].join(" ")
            : undefined
        }
        alt={
          {
            pos: "รับที่หน้าร้าน",
            school_pickup: "รับที่โรงเรียน",
            delivery: "รับที่ที่อยู่…",
          }[order.delivery_type]
        }
      />
      <Actions className="self-end">
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="receipt_long" />}
          onClick={() => setDialogOpen(true)}
        />
        <ReceiptDialog
          order={order}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
        <Button appearance="tonal" icon={<MaterialIcon icon="move_item" />} />
      </Actions>
    </ListItem>
  );
};

export default OrderListItem;
