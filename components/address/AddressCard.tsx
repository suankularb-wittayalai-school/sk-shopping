// Imports
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { Address } from "@/utils/types/address";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Card,
  CardHeader,
  MaterialIcon,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * Address Card displays an Address in a Card. It also allows the user to
 * delete the Address.
 * 
 * @param address The Address to display.
 */
const AddressCard: StylableFC<{
  address: Address;
}> = ({ address, style, className }) => {
  const { t } = useTranslation("address");

  const refreshProps = useRefreshProps();
  const jimmy = useJimmy();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { error } = await jimmy.fetch("/auth/user/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [address.id] }),
    });
    if (error) logError("handleDelete", error);
    await refreshProps();
    setLoading(false);
  }

  return (
    <Card
      appearance="filled"
      direction="row"
      style={style}
      className={className}
    >
      <CardHeader
        title={[
          address.street_address_line_1,
          address.street_address_line_2?.replace("\n", " "),
        ].join(" ")}
        subtitle={[address.district, address.province, address.zip_code].join(
          " ",
        )}
        className="grow"
      />
      <Actions className="pr-4">
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="delete" />}
          dangerous
          loading={loading}
          onClick={handleDelete}
        >
          {t("action.remove")}
        </Button>
      </Actions>
    </Card>
  );
};

export default AddressCard;
