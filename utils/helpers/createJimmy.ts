// Imports
import fetchJimmy from "@/utils/helpers/fetchJimmy";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createJimmy(
  req?: NextApiRequest,
  res?: NextApiResponse,
) {
  let session: Session | null = null;

  if (req && res) {
    const supabase = createPagesServerClient({
      req,
      res,
    });
    const { data } = await supabase.auth.getSession();
    session = data.session;
  }

  return {
    fetch: async <Data extends {} | unknown = unknown>(
      path: Parameters<typeof fetchJimmy>["0"],
      options?: Parameters<typeof fetchJimmy>["2"],
    ) => fetchJimmy<Data>(path, session, options),
    session,
  };
}
