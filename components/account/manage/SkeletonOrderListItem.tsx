// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ListItem } from "@suankularb-components/react";

/**
 * A placeholder for Order List Item when Manage Orders is loading.
 */
const SkeletonOrderListItem: StylableFC = ({ style, className }) => (
  <ListItem
    align="top"
    lines={3}
    style={style}
    className={cn(
      `!grid animate-pulse !pr-4
      md:!grid-cols-[3rem,minmax(0,1fr),minmax(0,1fr),minmax(0,1fr),5.5rem]`,
      className,
    )}
  >
    <div className="h-10 w-10 rounded-full bg-surface-variant" />
    <div className="my-0.5 space-y-1">
      <div className="h-5 w-36 rounded-xs bg-surface-variant" />
      <div className="h-4 w-48 rounded-xs bg-surface-variant" />
    </div>
    <div className="my-0.5 space-y-1">
      <div className="h-5 w-24 rounded-xs bg-surface-variant" />
      <div className="h-4 w-56 rounded-xs bg-surface-variant" />
    </div>
    <div className="my-0.5">
      <div className="h-5 w-20 rounded-xs bg-surface-variant" />
    </div>
    <div className="my-0.5 flex flex-row justify-end gap-2 self-end">
      <div className="h-10 w-10 rounded-full bg-surface-variant" />
      <div className="h-10 w-10 rounded-full bg-surface-variant" />
    </div>
  </ListItem>
);

export default SkeletonOrderListItem;
