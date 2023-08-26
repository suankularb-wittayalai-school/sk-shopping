// Imports
import ReceiptDialog from "@/components/cart/ReceiptDialog";
import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Order, OrderStatus } from "@/utils/types/order";
import {
  Actions,
  Avatar,
  Button,
  Columns,
  ListItemContent,
  MaterialIcon,
  Menu,
  MenuItem,
  Snackbar,
  Text,
  transition,
  useAnimationConfig
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { sift } from "radash";
import { useContext, useState } from "react";

/**
 * A List Item inside the Manage Orders page that displays information about an
 * Order. The status of the Order can be changed via a Select.
 *
 * Note: `jimmy` is passed to Order List Item instead of being created right in
 * the component because otherwise `useUser` would fetch `/auth/users` for
 * every single Order List Item in the page (which there are 100) so that’s no
 * good, is it!
 *
 * @param order The Order to display and/or modify.
 * @param setStatus The function to change the Order Status view.
 * @param jimmy A Jimmy instance.
 */
const OrderListItem: StylableFC<{
  order: Order;
  onStatusChange: () => void;
  setStatus: (status: OrderStatus) => void;
  jimmy: ReturnType<typeof useJimmy>;
}> = ({ order, onStatusChange, setStatus, jimmy, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("manage");

  const { setSnackbar } = useContext(SnackbarContext);

  const { duration, easing } = useAnimationConfig();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Push the change to the Status of this Order to the database.
   * 
   * @param status The Status to change to.
   */
  async function handleChangeStatus(status: OrderStatus) {
    setMenuOpen(false);
    if (status === order.shipment_status) return;
    const { error } = await jimmy.fetch(`/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { shipment_status: status } }),
    });
    if (error) {
      logError("handleChangeStatus", error);
      return;
    }
    onStatusChange();
    setSnackbar(
      <Snackbar
        action={
          <Button appearance="text" onClick={() => setStatus(status)}>
            ไปที่สถานะใหม่
          </Button>
        }
        stacked
      >
        ย้ายการสั่งซื้อของ {order.receiver_name} แล้ว
      </Snackbar>,
    );
  }

  return (
    <motion.li
      layoutId={order.id}
      transition={transition(duration.medium2, easing.standard)}
    >
      <Columns columns={3} className="grow !items-stretch px-4 py-3">
        <div className="grid grid-cols-[3rem,1fr] gap-1">
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
                ? `จ่าย ${order.total_price.toLocaleString(locale, {
                    style: "currency",
                    currency: "THB",
                    maximumFractionDigits: 0,
                  })} แล้ว`
                : `ยังไม่ได้จ่าย ${order.total_price.toLocaleString(locale, {
                    style: "currency",
                    currency: "THB",
                    maximumFractionDigits: 0,
                  })}`,
            ]).join(" • ")}
            className="[&>span:first-child]:truncate"
          />
        </div>
        <ListItemContent
          title={<Text type="title-medium">สินค้าที่สั่งซื้อ</Text>}
          desc={order.items
            .map(({ item, amount }) => `${amount}×${item.name}`)
            .join(", ")}
          alt="สินค้าที่สั่งซื้อ"
        />
        <div
          className={cn(`grid grid-cols-[1fr,calc(5.5rem+2px)] gap-4
            sm:col-span-2 md:col-span-1`)}
        >
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
            <div className="relative">
              <Button
                appearance="tonal"
                icon={<MaterialIcon icon="move_down" />}
                onClick={() => setMenuOpen(true)}
              />
              <Menu open={menuOpen} onBlur={() => setMenuOpen(false)}>
                <Text type="title-medium" className="py-2 pl-4 pr-6">
                  ย้ายการสั่งซื้อไป…
                </Text>
                <MenuItem onClick={() => handleChangeStatus("canceled")}>
                  ยกเลิกไปแล้ว
                </MenuItem>
                <MenuItem onClick={() => handleChangeStatus("not_shipped_out")}>
                  ยังไม่ได้จัดส่ง
                </MenuItem>
                <MenuItem onClick={() => handleChangeStatus("pending")}>
                  กำลังส่ง/พร้อมรับ
                </MenuItem>
                <MenuItem onClick={() => handleChangeStatus("delivered")}>
                  รับสินค้าแล้ว
                </MenuItem>
              </Menu>
            </div>
          </Actions>
        </div>
      </Columns>
    </motion.li>
  );
};

export default OrderListItem;
