// Imports
import PageHeader from "@/components/PageHeader";
import ShopCartCard from "@/components/cart/ShopCartCard";
import AppStateContext from "@/contexts/AppStateContext";
import CartsContext from "@/contexts/CartsContext";
import cn from "@/utils/helpers/cn";
import { LangCode } from "@/utils/types/common";
import {
  Card,
  ContentLayout,
  Section,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useContext, useEffect } from "react";

const CartPage: NextPage = () => {
  const { t: tx } = useTranslation("common");

  const { carts } = useContext(CartsContext);

  const { setActiveNav } = useContext(AppStateContext);
  useEffect(() => setActiveNav("cart"), []);
  
  const { duration, easing } = useAnimationConfig();
  
  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "รถเข็นของคุณ" })}</title>
      </Head>
      <PageHeader>รถเข็นของคุณ</PageHeader>
      <ContentLayout>
        <Card appearance="outlined" className="mx-4 px-4 py-3 sm:mx-0">
          <Text type="body-medium" element="p">
            ถ้าคุณสั่งซื้อสินค้าไปแล้วโดยที่ไม่ได้เข้าสู่ระบบ
            คุณจะสามารถดูใบเสร็จได้ที่อีเมลที่คุณกรอกไว้เมื่อสั่งซื้อ
          </Text>
        </Card>
        <Section element="ul">
          <LayoutGroup id="shop">
            <AnimatePresence>
              {carts?.length ? (
                carts.map((cart) => (
                  <ShopCartCard key={cart.shop.id} cart={cart} />
                ))
              ) : (
                <motion.div
                  layoutId="empty"
                  initial={{ opacity: 0,  scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0  }}
                  transition={transition(duration.medium2, easing.standard)}
                  className={cn(`relative isolate mx-4 box-content grid
                    h-[13rem] place-content-center overflow-hidden rounded-md
                    border-1 border-outline-variant px-4 py-3 sm:mx-0`)}
                >
                  <Text
                    type="body-medium"
                    element="p"
                    className="text-center text-on-surface-variant"
                  >
                    ยังไม่มีสินค้าในรถเข็น
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
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
