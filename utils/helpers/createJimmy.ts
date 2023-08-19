// Imports
import fetchJimmy from "@/utils/helpers/fetchJimmy";
import { logError } from "@/utils/helpers/logError";
import { User } from "@/utils/types/user";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createJimmy(
  req?: NextApiRequest,
  res?: NextApiResponse,
) {
  const accessToken = req?.cookies["access_token"];
  let user: User | null = null;
  let sbStorage: SupabaseClient["storage"] | null = null;

  if (req && res) {
    const { storage } = createPagesServerClient({ req, res });
    sbStorage = storage;
  }

  if (accessToken) {
    const { data, error } = await fetchJimmy<User>("/auth/user", accessToken);
    if (error) logError("createJimmy (user)", error);
    else user = data;
  }

  return {
    fetch: async <Data extends {} | unknown = unknown>(
      path: Parameters<typeof fetchJimmy>["0"],
      options?: Parameters<typeof fetchJimmy>["2"],
    ) => fetchJimmy<Data>(path, accessToken, options),
    user,
    storage: sbStorage,
  };
}
