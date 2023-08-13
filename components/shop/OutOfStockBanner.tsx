// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon, Text } from "@suankularb-components/react";

/**
 * A banner placed on the image if the Listing or Listing Option is out of
 * stock.
 */
const OutOfStockBanner: StylableFC = ({ style, className }) => (
  <div
    style={style}
    className={cn(
      `absolute inset-0 top-auto isolate flex flex-row items-center gap-2
      rounded-b-sm px-4 py-2 backdrop-blur-sm before:absolute before:inset-0
      before:-z-10 before:rounded-[inherit] before:bg-error-container
      before:opacity-80 before:dark:opacity-60`,
      className,
    )}
  >
    <MaterialIcon icon="error" size={20} className="text-error" />
    <Text type="label-medium" className="grow truncate text-on-error-container">
      สินค้าหมดในขณะนี้
    </Text>
  </div>
);

export default OutOfStockBanner;
