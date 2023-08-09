// Imports
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import {
  AppDrawerSegment,
  AppDrawer as SKCAppDrawer,
} from "@suankularb-components/react";

/**
 * A toggle for a drawer of all apps used by Suankularb students and teachers.
 *
 * @returns A Button.
 */
const AppDrawer: StylableFC = ({ style, className }) => {
  const locale = useLocale();

  return (
    <SKCAppDrawer locale={locale} style={style} className={className}>
      <AppDrawerSegment title="">{}</AppDrawerSegment>
    </SKCAppDrawer>
  );
};

export default AppDrawer;
