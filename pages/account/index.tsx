// Imports
import PageHeader from "@/components/PageHeader";
import AccountHeader from "@/components/account/AccountHeader";
import GuestCard from "@/components/account/GuestCard";
import AppStateContext from "@/contexts/AppStateContext";
import createJimmy from "@/utils/helpers/createJimmy";
import { LangCode } from "@/utils/types/common";
import { User } from "@/utils/types/user";
import { Columns, ContentLayout } from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useContext, useEffect } from "react";

/**
 * The Account page allows the user to log in and add some information about
 * themselves.
 *
 * @param user The user to display/edit information of.
 */
const AccountPage: NextPage<{ user: User }> = ({ user }) => {
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  const { setActiveNav } = useContext(AppStateContext);
  useEffect(() => setActiveNav("account"), []);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout>
        {user ? (
          <AccountHeader user={user} />
        ) : (
          <Columns columns={4}>
            <GuestCard className="md:col-span-2 md:col-start-2" />
          </Columns>
        )}
      </ContentLayout>
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
