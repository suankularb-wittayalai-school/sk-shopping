// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon, Tab, TabsContainer } from "@suankularb-components/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import shortUUID from "short-uuid";

/**
 * The Tabs Container present in every Manage Shop page.
 *
 * @param shopID The UUID of the Shop. Used in constructing links to Manage Shop pages.
 */
const ManageShopTabs: StylableFC<{
  shopID: string;
}> = ({ shopID, style, className }) => {
  const router = useRouter();
  const { fromUUID } = shortUUID();

  const [selected, setSelected] = useState(
    router.pathname.split("/").slice(-1)[0] as
      | "customize"
      | "listings"
      | "orders"
      | "analytics",
  );

  const baseURL = `/account/manage/${fromUUID(shopID)}`;

  return (
    <TabsContainer
      appearance="primary"
      alt="View"
      style={style}
      className={cn(`!-mt-6`, className)}
    >
      <Tab
        icon={<MaterialIcon icon="imagesearch_roller" />}
        label="ร้านค้า"
        selected={selected === "customize"}
        onClick={() => setSelected("customize")}
        href={[baseURL, "customize"].join("/")}
        element={Link}
      />
      <Tab
        icon={<MaterialIcon icon="category" />}
        label="สินค้า"
        selected={selected === "listings"}
        onClick={() => setSelected("listings")}
        href={[baseURL, "listings"].join("/")}
        element={Link}
      />
      <Tab
        icon={<MaterialIcon icon="receipt" />}
        label="การสั่งซื้อ"
        selected={selected === "orders"}
        onClick={() => setSelected("orders")}
        href={[baseURL, "orders"].join("/")}
        element={Link}
      />
      <Tab
        icon={<MaterialIcon icon="trending_up" />}
        label="สถิติ"
        selected={selected === "analytics"}
        onClick={() => setSelected("analytics")}
        href={[baseURL, "analytics"].join("/")}
        element={Link}
      />
    </TabsContainer>
  );
};

export default ManageShopTabs;
