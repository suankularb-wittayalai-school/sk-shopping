import { StylableFC } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import { ListItem } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A List Item inside the Manage Orders page that displays information about an
 * Order. The status of the Order can be changed via a Select.
 *
 * @param order The Order to display and/or modify.
 */
const OrderListItem: StylableFC<{
  order: Order;
}> = ({ order, style, className }) => {
  const { t } = useTranslation("manage");

  return (
    <ListItem align="bottom" lines={3} style={style} className={className}>
      {}
    </ListItem>
  );
};

export default OrderListItem;

