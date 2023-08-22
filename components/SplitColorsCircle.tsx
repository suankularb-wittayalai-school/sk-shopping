// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";

/**
 * A diagonally split color circle.
 * 
 * @param colors An array of hex codes.
 */
const SplitColorsCircle: StylableFC<{
  colors: string[];
}> = ({ colors, style, className }) => (
  <div
    style={{ ...style, gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}
    className={cn(
      `grid h-4 w-4 rotate-45 overflow-hidden rounded-full`,
      className,
    )}
  >
    {colors.map((color, idx) => (
      <div key={idx} style={{ backgroundColor: color }} />
    ))}
  </div>
);

export default SplitColorsCircle;
