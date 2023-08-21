// Imports
import cn from "@/utils/helpers/cn";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { StylableFC } from "@/utils/types/common";
import { User } from "@/utils/types/user";
import {
  Actions,
  Avatar,
  Button,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";

const AccountHeader: StylableFC<{
  user: User;
}> = ({ user, style, className }) => {
  const { t } = useTranslation("account");

  const refreshProps = useRefreshProps();

  function handleLogOut() {
    document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    refreshProps();
  }

  return (
    <div style={style} className={cn(`mx-4 space-y-4 sm:mx-0`, className)}>
      <div className="flex flex-col gap-3 md:flex-row md:gap-6">
        <Avatar className="!h-[4.5rem] !w-[4.5rem]">
          {user.profile && (
            <Image
              src={user.profile}
              width={72}
              height={72}
              alt="Avatar image"
            />
          )}
        </Avatar>
        <div>
          <Text type="display-small" element="h2">
            {[user.first_name, user.last_name].join(" ")}
          </Text>
          <Text type="title-large">บัญชี Google</Text>
        </div>
      </div>
      <Actions align="left">
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="logout" />}
          dangerous
          onClick={handleLogOut}
        >
          ออกจากระบบ
        </Button>
        {/* <Button appearance="outlined" icon={<MaterialIcon icon="add_link" />}>
          เชื่อมบัญชี MySK
        </Button> */}
      </Actions>
    </div>
  );
};

export default AccountHeader;
