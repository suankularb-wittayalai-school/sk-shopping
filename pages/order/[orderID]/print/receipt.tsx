// Imports
import PrintedOrder from "@/components/order/PrintedOrder";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import shortUUID from "short-uuid";

/**
 * A page that displays an Order in a printable receipt format. A Receipt is to
 * be given to customers.
 *
 * For POS orders, an extra portion of the Receipt is printed for the customer
 * while the main part is for the Shop staff.
 *
 * @param order The Order to print.
 */
const PrintReceiptPage: NextPage<{ order: Order }> = ({ order }) => (
  <PrintedOrder
    order={order}
    type="receipt"
    width={105}
    height={147}
    density={-2}
    autoPrint
  />
);

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  if (locale !== "th")
    return {
      redirect: {
        destination: `/order/${params!.orderID}/print/receipt`,
        permanent: false,
      },
    };

  const jimmy = await createJimmy();
  const { toUUID } = shortUUID();

  const { data: order, error } = await jimmy.fetch<Order>(
    `/orders/${toUUID(params!.orderID as string)}`,
    { query: { descendant_fetch_level: "compact" } },
  );
  if (error) {
    logError("/order/:id getServerSideProps", error);
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

export default PrintReceiptPage;
