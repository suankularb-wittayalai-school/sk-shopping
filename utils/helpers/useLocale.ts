// Imports
import { LangCode } from "@/utils/types/common";
import { useRouter } from "next/router";

/**
 * Gets the current locale from the router.
 * 
 * @returns The code of the current locale.
 */
export default function useLocale() {
  const { locale } = useRouter();
  return locale as LangCode;
}
