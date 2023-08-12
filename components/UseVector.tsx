// Imports
import { StylableFC } from "@/utils/types/common";

const UseVector: StylableFC<{  href: string;
}> = ({ href, style, className }) => (
  <svg style={style} className={className}>
    <use xlinkHref={`#${href}`} />
  </svg>
);

export default UseVector;
