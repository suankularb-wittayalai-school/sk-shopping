// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";

/**
 * A paid advert spot.
 *
 * @todo This is hard-coded to be a contact link because there is no API endpoint for adverts yet.
 */
const AdvertCard: StylableFC = ({ style, className }) => {
  return (
    <div
      style={style}
      className={cn(
        `z-10 grid aspect-[5/2] place-content-center rounded-xl border-1
        border-outline-variant bg-surface text-center`,
        className,
      )}
    >
      <Text type="body-medium">
        <a
          href="https://forms.gle/"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          ติดต่อโฆษณา
        </a>
      </Text>
    </div>
  );
};

export default AdvertCard;
