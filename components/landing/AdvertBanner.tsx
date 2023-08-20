// Imports
import AppDrawer from "@/components/AppDrawer";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

/**
 * The most prominent paid advertising spot on the Landing page. The Advert
 * Banner spans the entire width of the page and seamlessly fades out to the
 * rest of the content.
 *
 * The main difference from Advert Card is that Advert Banner can feature
 * Listings from a Collection.
 *
 * @todo This is hard-coded to be Kornor’s advert because there is no API endpoint for adverts yet.
 */
const AdvertBanner: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("landing", { keyPrefix: "advert" });

  return (
    <div
      style={style}
      className={cn(`light relative -mb-[10rem] pb-[10rem]`, className)}
    >
      {/* Background image */}
      <Image
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/adverts/banner/background.png`}
        width={1194}
        height={570}
        priority
        alt=""
        className={cn(`pointer-events-none absolute inset-0 -z-10 h-full w-full
          bg-surface-variant object-cover
          [mask-image:linear-gradient(to_top,transparent,black_21.5rem)]`)}
      />
      <ContentLayout className="text-on-surface">
        <Columns columns={2} className="!grid-cols-1 !gap-y-4 md:!grid-cols-2">
          {/* Foreground image */}
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/adverts/banner/foreground.png`}
            width={466}
            height={349.5}
            priority
            className="h-auto w-full"
            alt=""
          />

          <div className="mx-4 sm:mx-0">
            {/* App Drawer */}
            <Actions className="-mt-1 !hidden md:!flex">
              <AppDrawer />
            </Actions>

            {/* Overline */}
            <Text type="title-medium" className="md:-mt-1.5">
              คอลเลคชั่น
            </Text>

            {/* Title */}
            <Text type="display-small" element="h2" className="-mt-1">
              <Balancer>สมานมิตร ‘66</Balancer>
            </Text>

            {/* Subtitle */}
            <Text type="title-large" element="p" className="mt-2">
              <Balancer>
                ถึงแม้วันจะเปลี่ยนแปลง แต่ความทรงจำไม่เคยเปลี่ยนไป
              </Balancer>
            </Text>

            {/* Featured Listings */}
            {/* <Columns columns={2} className="mt-4">
              <ListingCard size="small" />
              <ListingCard size="small" />
            </Columns> */}

            {/* Call to action */}
            <Actions align="left" className="mt-6">
              <Button
                appearance="filled"
                href="/shop/9gWHTbYWpBHPAEziRH4S5K#qjXCTJNpeU3tpadSNtVmNP"
                element={Link}
              >
                {t("action.goToShop")}
              </Button>
            </Actions>
          </div>
        </Columns>
      </ContentLayout>
    </div>
  );
};

export default AdvertBanner;
