// Imports
import useGetLocaleString from "@/utils/helpers/useGetLocaleString";
import { Shop } from "@/utils/types/shop";
import { Text } from "@suankularb-components/react";
import Image from "next/image";
import { FC } from "react";
import Balancer from "react-wrap-balancer";

const DefaultView: FC<{ shop: Shop }> = ({ shop }) => {
  const getLocaleString = useGetLocaleString();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-on-surface">
      {shop.logo_url && (
        <Image src={shop.logo_url} width={120} height={120} alt="" priority />
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

export default DefaultView;
