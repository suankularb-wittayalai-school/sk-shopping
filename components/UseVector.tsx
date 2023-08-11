// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";

const UseVector: StylableFC<{
  href: string;
  icon?: boolean;
}> = ({ href, icon, className, style }) => (
  <svg style={style} className={cn(icon && `h-6 w-6`, className)}>
    <use xlinkHref={`#${href}`} />
  </svg>
);

export default UseVector;
