// Imports
import PageHeader from "@/components/PageHeader";
import ShopCart from "@/components/cart/ShopCart";
import AppStateContext from "@/contexts/AppStateContext";
import CartsContext from "@/contexts/CartsContext";
import { LangCode } from "@/utils/types/common";
import { ContentLayout, Section } from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect } from "react";

const CartPage: NextPage = () => {
  const { carts } = useContext(CartsContext);
  
  const { setActiveNav } = useContext(AppStateContext);
  useEffect(() => setActiveNav("cart"), []);

  return (
    <>
      <PageHeader>รถเข็นของคุณ</PageHeader>
      <ContentLayout>
        <Section>
          {carts ? (
            carts.map((cart) => <ShopCart key={cart.shop.id} cart={cart} />)
          ) : (
            <div className="h-36 animate-pulse rounded-md bg-surface-variant" />
          )}
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, ["common", "cart"])),
  },
});

export default CartPage;
