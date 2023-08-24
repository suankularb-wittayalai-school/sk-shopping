// Imports
import PageHeader from "@/components/PageHeader";
import AccountHeader from "@/components/account/AccountHeader";
import GuestCard from "@/components/account/GuestCard";
import AddAddressDialog from "@/components/address/AddAddressDialog";
import AddressCard from "@/components/address/AddressCard";
import ShopCard from "@/components/landing/ShopCard";
import AppStateContext from "@/contexts/AppStateContext";
import createJimmy from "@/utils/helpers/createJimmy";
import { logError } from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { ShopCompact } from "@/utils/types/shop";
import { UserDetailed } from "@/utils/types/user";
import {
  Button,
  Card,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  Text,
} from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";

/**
 * The Account page allows the user to log in and add some information about
 * themselves.
 *
 * @param user The user to display/edit information of.
 */
const AccountPage: NextPage<{
  user: UserDetailed;
  managingShops?: ShopCompact[];
}> = ({ user, managingShops }) => {
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  const { setActiveNav } = useContext(AppStateContext);
  useEffect(() => setActiveNav("account"), []);

  const [addAddressOpen, setAddAddressOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout>
        {user ? (
          <>
            <AccountHeader user={user} />
            {managingShops && (
              <Section>
                <Header>จัดการร้านค้า</Header>
                <Columns columns={4} element="ul">
                  {managingShops.map((shop) => (
                    <ShopCard key={shop.id} role="manager" shop={shop} />
                  ))}
                </Columns>
              </Section>
            )}
            <Section>
              <div className="flex flex-row gap-6">
                <Header className="grow">{t("addresses.title")}</Header>
                <Button
                  appearance="filled"
                  icon={<MaterialIcon icon="add" />}
                  onClick={() => setAddAddressOpen(true)}
                >
                  {t("addresses.action.add")}
                </Button>
                <AddAddressDialog
                  open={addAddressOpen}
                  onClose={() => setAddAddressOpen(false)}
                  onSubmit={() => setAddAddressOpen(false)}
                />
              </div>
              {user.addresses.length ? (
                <Columns columns={2}>
                  {user.addresses.map((address) => (
                    <AddressCard key={address.id} address={address} />
                  ))}
                </Columns>
              ) : (
                <Card
                  appearance="outlined"
                  className="grid h-[13.25rem] place-content-center"
                >
                  <Text
                    type="body-medium"
                    element="p"
                    className="text-center text-on-surface-variant"
                  >
                    {t("addresses.empty")}
                  </Text>
                </Card>
              )}
            </Section>
          </>
        ) : (
          <Columns columns={4}>
            <GuestCard className="mx-4 sm:col-span-2 sm:mx-0 md:col-start-2" />
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
  const jimmy = await createJimmy(req);
  const { data: user, error } = await jimmy.fetch<UserDetailed>("/auth/user", {
    query: { fetch_level: "detailed" },
  });
  if (error) logError("/account getServerSideProps", error);

  let managingShops: ShopCompact[] | null = null;
  if (jimmy.user) {
    const { data, error } = await jimmy.fetch<ShopCompact[]>(`/shops`, {
      query: { filter: { data: { manager_ids: [jimmy.user.id] } } },
    });
    if (error) logError("/cart getServerSideProps (shops)", error);
    managingShops = data;
  }
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "address",
      ])),
      user,
      managingShops,
    },
  };
};

export default AccountPage;
