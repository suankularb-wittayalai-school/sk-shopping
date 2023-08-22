import { LangCode, MultiLangString } from "../types/common";
import useLocale from "./useLocale";

/**
 * Index into a mulitilingual string with the current user locale.
 *
 * @param string The mulitilingual string to index into.
 * @param localeOverride Overrides the locale (default is current user locale).
 *
 * @returns The string of the requested locale.
 */
export default function useGetLocaleString() {
  const locale = useLocale();

  return (string: MultiLangString, localeOverride?: LangCode) =>
    string[localeOverride || locale] || string.th;
}
