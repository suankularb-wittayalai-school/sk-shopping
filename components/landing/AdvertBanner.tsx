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
      className={cn(`relative -mb-[10rem] pb-[10rem]`, className)}
    >
      {/* Background image */}
      <div
        className={cn(`absolute inset-0 -z-10 bg-primary-container
          [mask-image:linear-gradient(to_top,transparent,black_21.5rem)]`)}
      />
      <ContentLayout>
        <Columns columns={2} className="!grid-cols-1 !gap-y-4 md:!grid-cols-2">
          {/* Foreground image */}
          <div className="aspect-[4/3] rounded-sm border-4 border-dashed border-inverse-primary"></div>

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
              <Balancer>สมานมิตร ‘65</Balancer>
            </Text>

            {/* Subtitle */}
            <Text type="title-large" element="p" className="mt-2">
              <Balancer>
                ทุกคนย่อมมีเรื่องราวของตัวเอง
                คุณยังจำเรื่องในอดีตของตัวเองได้ไหม?
              </Balancer>
            </Text>

            {/* Featured Listings */}
            {/* <Columns columns={2} className="mt-4">
              <ListingCard size="mini" />
              <ListingCard size="mini" />
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
