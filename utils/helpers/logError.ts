// Types
import { FetchError } from "@/utils/types/fetch";

/**
 * Logs an error in a more human readable way.
 *
 * @param location Identifies the location of an error, like a function or page name.
 * @param error A {@link FetchError}.
 * @param clientSide If the error happened client-side.
 */
export function logError(location: string, error: Partial<FetchError>) {
  console.error(
    [
      // Header
      typeof window === "undefined"
        ? `\x1b[0m- \x1b[31merror\x1b[0m an error occurred at \x1b[33m${location}\x1b[0m`
        : `\x1b[0m[Error]`,

      // Content
      typeof window !== "undefined" && `Error occured at ${location}`,
      error.detail,
      error.source && `source: ${error.source}`,
    ]
      .filter((segment) => segment)
      .join("\n    "),
  );
}
