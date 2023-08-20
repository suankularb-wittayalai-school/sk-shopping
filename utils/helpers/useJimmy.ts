// Imports
import fetchJimmy from "@/utils/helpers/fetchJimmy";
import useUser from "@/utils/helpers/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function useJimmy() {
  const user = useUser();
  const { storage } = useSupabaseClient();

  return {
    fetch: async <Data extends {} | unknown = unknown>(
      path: Parameters<typeof fetchJimmy>["0"],
      options?: Parameters<typeof fetchJimmy>["2"],
    ) => fetchJimmy<Data>(path, user.accessToken || undefined, options),
    user,
    storage,
  };
}
