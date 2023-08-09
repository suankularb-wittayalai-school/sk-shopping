import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader } from "@suankularb-components/react";
import Link from "next/link";

const LargeListingCard: StylableFC = () => null;
const SmallListingCard: StylableFC = () => null;
const MiniListingCard: StylableFC = () => (
  <Card
    appearance="outlined"
    direction="row"
    stateLayerEffect
    href="#"
    element={Link}
    className="overflow-hidden"
  >
    <div className="aspect-square h-[4.75rem] bg-surface-variant" />
    <CardHeader title="เสื้อสวนกุหลาบๆๆ" subtitle="฿200" className="grow" />
  </Card>
);

const ListingCard: StylableFC<{
  size: "large" | "small" | "mini";
}> = (props) => {
  const { size } = props;
  return {
    large: <LargeListingCard {...props} />,
    small: <SmallListingCard {...props} />,
    mini: <MiniListingCard {...props} />,
  }[size];
};

export default ListingCard;
