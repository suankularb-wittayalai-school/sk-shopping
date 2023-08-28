// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Columns } from "@suankularb-components/react";

/**
 * A placeholder for Order List Item when Manage Orders is loading.
 */
const SkeletonOrderListItem: StylableFC = ({ style, className }) => (
  <li style={style} className={className}>
    <Columns
      columns={3}
      className="grow animate-pulse !items-stretch px-4 py-3"
    >
      <div className="grid grid-cols-[2.5rem,1fr] gap-3">
        <div className="h-10 w-10 rounded-full bg-surface-variant" />
        <div className="my-0.5 space-y-1">
          <div className="h-5 w-36 rounded-xs bg-surface-variant" />
          <div className="h-4 w-48 rounded-xs bg-surface-variant" />
        </div>
      </div>
      <div className="my-0.5 space-y-1">
        <div className="h-5 w-24 rounded-xs bg-surface-variant" />
        <div className="h-4 w-56 rounded-xs bg-surface-variant" />
      </div>
      <div
        className={cn(`grid grid-cols-[1fr,calc(5.5rem+2px)] gap-4
          sm:col-span-2 md:col-span-1`)}
      >
        <div className="my-0.5">
          <div className="h-5 w-20 rounded-xs bg-surface-variant" />
        </div>
        <div className="my-0.5 flex flex-row justify-end gap-2 self-end">
          <div className="h-10 w-10 rounded-full bg-surface-variant" />
          <div className="h-10 w-10 rounded-full bg-surface-variant" />
        </div>
      </div>
    </Columns>
  </li>
);

export default SkeletonOrderListItem;
