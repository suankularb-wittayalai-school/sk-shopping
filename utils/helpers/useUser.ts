// Imports
import fetchJimmy from "@/utils/helpers/fetchJimmy";
import { FetchError } from "@/utils/types/fetch";
import { User } from "@/utils/types/user";
import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [status, setStatus] = useState<
    "unauthenticated" | "authenticated" | "loading"
  >("loading");
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    const cookies = document.cookie;
    const accessToken = cookies
      .split(";")
      .find((cookie) => cookie.split("=")[0] === "access_token")
      ?.split("=")[1];

    // If no access token is found, the user is determined to be
    // unauthenticated
    if (!accessToken) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    // If there exists an access token, fetch the user
    (async () => {
      const { data: user, error } = await fetchJimmy<User>(
        "/auth/user",
        accessToken,
      );
      if (error) {
        setUser(null);
        setError(error);
        setStatus("unauthenticated");
        return;
      }

      setUser(user);
      setAccessToken(accessToken);
      setStatus("authenticated");
    })();
  }, []);

  return { user, accessToken, status, error };
}
