// Imports
import cn from "@/utils/helpers/cn";
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { StylableFC } from "@/utils/types/common";
import { HybridListing } from "@/utils/types/listing";
import { Shop } from "@/utils/types/shop";
import { Text } from "@suankularb-components/react";
import Image from "next/image";
import { FC } from "react";
import Balancer from "react-wrap-balancer";

const DefaultView: FC<{ shop: Shop }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      {shop.logo_url && (
        <Image src={shop.logo_url} width={120} height={120} alt="" />
      )}
      <Text type="headline-small" className="text-center">
        <Balancer>ยินดีต้อนรับสู่ร้านค้า{getLocaleString(shop.name)}</Balancer>
      </Text>
      <Text type="body-medium" className="text-center">
        <Balancer>เลือกสินค้าจากรายการด้านซ้ายเพื่อดูรายละเอียด</Balancer>
      </Text>
    </div>
  );
};

const ListingView: FC<{ listing: HybridListing }> = () => null;

const ListingDetailsSection: StylableFC<{
  shop: Shop;
  listing?: HybridListing;
}> = ({ shop, listing, style, className }) => {
  return (
    <div
      style={{
        backgroundColor: `#${shop.background_color}`,
        backgroundImage:
          // Left 40%, right 0%, accent color
          `linear-gradient(
          to bottom,
          #${shop.accent_color}66,
          transparent
        )`,
        ...style,
      }}
      className={cn(`rounded-xl`, className)}
    >
      {listing ? (
        <ListingView listing={listing} />
      ) : (
        <DefaultView shop={shop} />
      )}
    </div>
  );
};

export default ListingDetailsSection;
