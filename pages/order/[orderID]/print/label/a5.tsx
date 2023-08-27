// Imports
import PrintedOrder from "@/components/order/PrintedOrder";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { Order } from "@/utils/types/order";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import shortUUID from "short-uuid";

const PrintA5LabelPage: NextPage<{ order: Order }> = ({ order }) => (
  <PrintedOrder order={order} type="label" width={148} height={210} density={-1} autoPrint />
);

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

export default PrintA5LabelPage;
