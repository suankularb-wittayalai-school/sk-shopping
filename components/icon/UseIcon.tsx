// Imports
import UseVector from "@/components/UseVector";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";

/**
 * Uses an icon from the Icon Definitions component.
 *
 * @param icon The icon ID from the Icon Definitions component.
 */
const UseIcon: StylableFC<{
  icon: string;
  filled?: boolean;
}> = ({ icon, filled, style, className }) => (
  <UseVector
    href={`icon-${icon}${filled ? "-filled" : ""}`}
    style={style}
    className={cn(`h-6 w-6`, className)}
  />
);

export default UseIcon;
