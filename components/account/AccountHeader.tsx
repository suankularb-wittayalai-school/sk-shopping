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

/**
 * Information about the Account and some actions.
 *
 * @param user The user to display information of.
 */
const AccountHeader: StylableFC<{
  user: Pick<User, "first_name" | "last_name" | "profile">;
}> = ({ user, style, className }) => {
  const { t } = useTranslation("account", { keyPrefix: "header" });

  const refreshProps = useRefreshProps();

  function handleLogOut() {
    document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
              alt={t("avatarAlt")}
            />
          )}
        </Avatar>
        <div>
          <Text type="display-small" element="h2">
            {[user.first_name, user.last_name].join(" ")}
          </Text>
          <Text type="title-large">{t("subtitle")}</Text>
        </div>
      </div>
      <Actions align="left">
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="logout" />}
          dangerous
          onClick={handleLogOut}
        >
          {t("action.logOut")}
        </Button>
        {/* <Button appearance="outlined" icon={<MaterialIcon icon="add_link" />}>
            {t("action.connectMySK")}
          </Button> */}
      </Actions>
    </div>
  );
};

export default AccountHeader;
