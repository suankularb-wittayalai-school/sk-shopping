// Imports
import { FetchReturn, Query } from "@/utils/types/fetch";
import { Session } from "@supabase/supabase-js";
import qs from "qs";
import { sift } from "radash";

/**
 * @private Use `useJimmy` or `createJimmy` instead.
 */
export default async function fetchJimmy<Data extends {} | unknown = unknown>(
  path: string,
  session: Session | null,
  options?: Partial<{ query: Query; [key: string]: any }>,
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

  /**
   * The original reponse from the API.
   */
  const response = await fetch(source, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: session ? `Bearer ${session.access_token}` : undefined,
    },
  });

  // If the response was successful with no error, return the JSON version of the
  // response
  if (response.ok) return response.json();

  // Otherwise, parse the response into an error object
  return {
    api_version: "1.0",
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
