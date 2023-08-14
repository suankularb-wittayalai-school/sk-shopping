import CartsContext from "@/contexts/CartsContext";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ListingOption } from "@/utils/types/listing-option";
import {
  Actions,
  Button,
  ListItem,
  ListItemContent,
  MaterialIcon,
  SegmentedButton,
  Text,
} from "@suankularb-components/react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const CartListingOption: StylableFC<{
  item: ListingOption;
  amount: number;
  shopID: string;
}> = ({ item, amount, shopID, style, className }) => {
  const locale = useLocale();

  const { setItemAmount, removeItem } = useContext(CartsContext);
  const [value, setValue] = useState(amount);
  useEffect(() => setItemAmount(item, value, shopID), [value]);

  return (
    <ListItem
      align="center"
      lines={2}
      style={style}
      className={cn(`!grid !px-4 md:!grid-cols-6`, className)}
    >
      <div className="flex flex-row items-center gap-4 md:col-span-2">
        {item.image_urls[0] && (
          <Image
            src={item.image_urls[0]}
            width={56}
            height={56}
            alt=""
            className="aspect-[1] object-cover"
          />
        )}
        <Text type="title-medium">{item.name}</Text>
      </div>
      <ListItemContent
        title={`รวม ฿${(item.price * amount).toLocaleString(locale)}`}
        desc={`฿${item.price} ต่อหน่วย`}
        className="md:col-span-2"
      />
      <div className="flex flex-row gap-6 sm:grid sm:grid-cols-2 md:col-span-2">
        <SegmentedButton alt="จำนวน" className="!grid !grid-cols-3">
          <Button
            appearance="outlined"
            icon={
              <MaterialIcon
                icon="keyboard_arrow_down"
                className={`!transition-[font-feature-settings,transform]
                  group-hover:translate-y-0.5 group-active:translate-y-1.5`}
              />
            }
            onClick={() => setValue(value - 1)}
            className="group"
          />
          <Text type="body-large" element="div" className="block min-w-0">
            <input
              value={value}
              onChange={(event) =>
                setValue(
                  Math.min(
                    Number(event.target.value),
                    item.lifetime_stock - item.amount_sold,
                  ),
                )
              }
              className="h-full w-full min-w-0 border-1 border-l-0 border-outline bg-transparent text-center transition-[border] hover:border-y-on-surface focus:border-b-2 focus:border-b-primary focus:border-t-outline focus:outline-none"
            />
          </Text>
          <Button
            appearance="outlined"
            icon={
              <MaterialIcon
                icon="keyboard_arrow_up"
                className={`!transition-[font-feature-settings,transform]
                  group-hover:-translate-y-0.5 group-active:-translate-y-1.5`}
              />
            }
            onClick={() =>
              setValue(
                Math.min(value + 1, item.lifetime_stock - item.amount_sold),
              )
            }
            className="group"
          />
        </SegmentedButton>
        <Actions>
          <Button
            appearance="text"
            icon={<MaterialIcon icon="delete" />}
            dangerous
            onClick={() => removeItem(item.id, shopID)}
            className="[&>span]:whitespace-nowrap"
          >
            นำออก
          </Button>
        </Actions>
      </div>
    </ListItem>
  );
};

export default CartListingOption;