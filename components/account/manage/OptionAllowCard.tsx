// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Card, Switch, Text } from "@suankularb-components/react";
import { ReactNode } from "react";

/**
 * A toggle for a delivery or payment option in Customize Shop.
 *
 * @param children Additional fields related to this option.
 * @param label The text label next to the Switch.
 * @param value If this option is enabled.
 * @param onChange Triggers when this option is toggled.
 */
const OptionAllowCard: StylableFC<{
  children?: ReactNode;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({ children, label, value, onChange, style, className }) => (
  <Card
    appearance="filled"
    style={style}
    className={cn(
      `!gap-6 !rounded-lg p-5 transition-colors`,
      value &&
        `!bg-primary-container !text-on-primary-container
        [&_.skc-text-field>span:first-child]:!bg-primary-container
        [&_.skc-text-field>span:first-child]:transition-colors`,
      className,
    )}
  >
    <div className="grid grid-cols-[3.25rem,1fr] items-center gap-4">
      <Switch value={value} onChange={onChange} />
      <Text type="title-medium">{label}</Text>
    </div>
    {children}
  </Card>
);

export default OptionAllowCard;

