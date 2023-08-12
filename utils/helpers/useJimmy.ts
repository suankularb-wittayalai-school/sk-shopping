// Imports
import fetchJimmy from "@/utils/helpers/fetchJimmy";
import { useSession } from "@supabase/auth-helpers-react";

export default function useJimmy() {
  const session = useSession();

  return {
    fetch: async <Data extends {} | unknown = unknown>(
      path: Parameters<typeof fetchJimmy>["0"],
      options?: Parameters<typeof fetchJimmy>["2"],
    ) => fetchJimmy<Data>(path, session, options),
    session,
  };
}
