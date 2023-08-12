// Imports
import { LangCode } from "@/utils/types/common";
import { GetStaticPathsResult } from "next";

/**
 * Make sure all paths generated in `getStaticPaths` include all locales.
 *
 * @param paths The paths to insert locales to. Can use the `params` system or be the paths itself.
 *
 * @returns An array ready to be put into the `paths` property in `getStaticPaths`.
 */
export default function insertLocaleIntoStaticPaths(
  paths: GetStaticPathsResult["paths"],
): GetStaticPathsResult["paths"] {
  const locales: LangCode[] = ["th", "en-US"];
  return paths
    .map((path) => {
      if (typeof path === "string")
        return [path, ...locales.map((locale) => ["/", locale, path].join(""))];
      return locales.map((locale) => ({ ...path, locale }));
    })
    .flat();
}
