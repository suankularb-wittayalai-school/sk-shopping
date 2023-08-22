// Imports
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { ShopCompact } from "@/utils/types/shop";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC } from "react";
import Balancer from "react-wrap-balancer";

/**
 * The contents of Listing Details Section when no Listing is selected.
 * 
 * @param shop A compact Shop.
 */
const DefaultView: FC<{ shop: ShopCompact }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();
  const { t } = useTranslation("shop", { keyPrefix: "detail.default" });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-on-surface">
      {shop.logo_url && (
        <Image src={shop.logo_url} width={120} height={120} alt="" priority />
      )}
      <Text type="headline-small" className="text-center">
        <Balancer>{t("title", { shop: getLocaleString(shop.name) })}</Balancer>
      </Text>
      <Text type="body-medium" className="text-center">
        <Balancer>{t("desc")}</Balancer>
      </Text>
    </div>
  );
};

export default DefaultView;
