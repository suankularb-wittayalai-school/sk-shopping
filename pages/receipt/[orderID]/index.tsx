// Imports
import ReceiptDialog from "@/components/cart/ReceiptDialog";
import AppStateContext from "@/contexts/AppStateContext";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import shortUUID from "short-uuid";

/**
 * The destination of the QR code in Receipt Dialog, used by Shop staff to
 * verify Orders.
 *
 * @param order The Order to display with Receipt Dialog.
 */
const ReceiptPage: NextPage<{ order: Order }> = ({ order }) => {
  const router = useRouter();

  const { setActiveNav } = useContext(AppStateContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    setDialogOpen(true);
    setActiveNav("cart");
  }, []);

  return (
    <ReceiptDialog
      order={order}
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        router.push("/cart");
      }}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const jimmy = await createJimmy();
  const { toUUID } = shortUUID();

  const { data: order, error } = await jimmy.fetch<Order>(
    `/orders/${toUUID(params!.orderID as string)}`,
    { query: { descendant_fetch_level: "compact" } },
  );
  if (error) {
    logError("/receipt/:id getServerSideProps", error);
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "receipt",
      ])),
      order,
    },
  };
};

export default ReceiptPage;
