// Imports
import PageHeader from "@/components/PageHeader";
import AppStateContext from "@/contexts/AppStateContext";
import createJimmy from "@/utils/helpers/createJimmy";
import { LangCode } from "@/utils/types/common";
import { User } from "@/utils/types/user";
import { ContentLayout } from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useContext, useEffect } from "react";

/**
 * @todo
 */
const AccountPage: NextPage<{ user: User }> = ({ user }) => {
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  const { setActiveNav } = useContext(AppStateContext);
  useEffect(() => setActiveNav("account"), []);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "บัญชี" })}</title>
      </Head>
      <PageHeader>บัญชี</PageHeader>
      <ContentLayout>TODO</ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const { user } = await createJimmy(req);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
      user,
    },
  };
};

export default AccountPage;

