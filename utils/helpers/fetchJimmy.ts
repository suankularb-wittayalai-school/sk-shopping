// Imports
import { FetchReturn, Query } from "@/utils/types/fetch";
import qs from "qs";
import { sift } from "radash";

/**
 * @private Use `useJimmy` or `createJimmy` instead.
 */
export default async function fetchJimmy<Data extends {} | unknown = unknown>(
  path: string,
  accessToken?: string,
  options?: Partial<RequestInit & { query: Query }>,
): Promise<FetchReturn<Data>> {
  /**
   * The path to make the fetch request to.
   */
  const source = sift([
    process.env.NEXT_PUBLIC_API_URL,
    path,
    options?.query && "?",
    qs.stringify(options?.query, { encode: false }),
  ]).join("");

  console.log(JSON.stringify(options?.query));

  /**
   * The original reponse from the API.
   */
  const response = await fetch(source, {
    ...options,
    headers: {
      ...options?.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (process.env.NODE_ENV === "development")
    console.log(
      typeof window !== "undefined"
        ? `[Fetch] ${options?.method || "GET"} to ${source}`
        : `\x1b[0m- \x1b[35mevent\x1b[0m [${
            options?.method || "GET"
          }] ${source}`,
    );

  // If the response was successful with no error, return the JSON version of the
  // response
  if (response.ok) return response.json();

  // Otherwise, parse the response into an error object
  return {
    api_version: "0.1.0",
    data: null,
    error: {
      code: response.status,
      detail: await response.text(),
      error_type: "APIError",
      source,
    },
    meta: null,
  };
}

