// Imports
import UseVector from "@/components/UseVector";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A paid advert spot.
 *
 * @todo This is hard-coded to be a contact link because there is no API endpoint for adverts yet.
 */
const AdvertCard: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("landing", { keyPrefix: "advert" });

  return (
    <div
      style={style}
      className={cn(
        `relative z-10 grid aspect-[5/2] place-content-center overflow-hidden
        rounded-xl border-1 border-outline-variant bg-surface text-center`,
        className,
      )}
    >
      <UseVector
        href="blob-card-full"
        className="absolute inset-0 -z-10 h-full w-full"
      />
      <Text type="title-large" className="opacity-80">
        {t("empty")}
      </Text>
    </div>
  );
};

export default AdvertCard;
