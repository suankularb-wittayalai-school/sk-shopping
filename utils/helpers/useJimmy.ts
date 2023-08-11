// Imports
import fetchJimmy from "@/utils/helpers/fetchJimmy";
import { useSession } from "@supabase/auth-helpers-react";

export default function useJimmy() {
  const session = useSession();

  return {
    fetch: async (
      path: Parameters<typeof fetchJimmy>["0"],
      options?: Parameters<typeof fetchJimmy>["2"],
    ) => fetchJimmy(path, session, options),
    session,
  };
}
