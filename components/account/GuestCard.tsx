// Imports
import cn from "@/utils/helpers/cn";
import { useOneTapSignin } from "@/utils/helpers/useOneTapSignin";
import { StylableFC } from "@/utils/types/common";
import { Actions, Card, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import UseVector from "../UseVector";

const GuestCard: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("account");

  useOneTapSignin({ parentButtonID: "button-google-sign-in" });

  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(`relative isolate px-4 pb-4 pt-3`, className)}
    >
      <UseVector
        href="blob-card-left"
        className="absolute inset-0 right-auto -z-10"
      />
      <Text type="title-medium">เข้าสู่ระบบด้วยบัญชี MySK หรือ Google</Text>
      <Text type="body-medium" className="mt-1">
        พบกับฟีเจอร์แสนสะดวกสะบาย เช่น การบันทึกสินค้าโปรด และที่อยู่
        เมื่อคุณใช้บัญชี MySK หรือ Google เข้าสู่ระบบ SK Shopping
      </Text>
      <Actions className="mt-3">
        <div
          id="button-google-sign-in"
          className={cn(`h-[38px] min-w-[3.5rem] rounded-full [color-scheme:light]
            [&:not(:has(iframe))]:animate-pulse
            [&:not(:has(iframe))]:bg-surface-variant`)}
        />
      </Actions>
    </Card>
  );
};

export default GuestCard;
