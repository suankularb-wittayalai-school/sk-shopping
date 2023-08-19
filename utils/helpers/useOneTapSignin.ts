// Imports
import fetchJimmy from "@/utils/helpers/fetchJimmy";
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import useLocale from "@/utils/helpers/useLocale";
import useUser from "@/utils/helpers/useUser";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * Tap into Google Sign in.
 *
 * @param options.parentContainerId The HTML ID of the One Tap’s container.
 * @param options.parentButtonId The HTML ID of the Sign in Button.
 * @param options.buttonWidth The width of the Sign in Button in pixels.
 *
 * @returns `loading`—if One Tap is loading.
 */
export const useOneTapSignin = (options?: {
  parentContainerID?: string;
  parentButtonID?: string;
  buttonWidth?: number;
}) => {
  const { parentContainerID, parentButtonID, buttonWidth } = options || {};
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const locale = useLocale();

  const jimmy = useJimmy();
  const { accessToken, status } = useUser();

  async function handleLogIn(response: CredentialResponse) {
    const { data, error } = await jimmy.fetch<{
      access_token: string;
      expires_in: number;
      id_token: string;
      scope: string;
      token_type: string;
    }>("/auth/oauth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    });
    if (error) {
      logError("useOneTapSignin", error);
      setLoading(false);
      return;
    }

    // We’re not using `jimmy.fetch` here because it is likely that
    // `useJimmy` haven’t gotten the memo about the new access token yet
    const { data: user, error: userError } = await fetchJimmy(
      "/auth/user",
      data.access_token,
    );
    if (userError) {
      logError("useOneTapSignin", userError);
      setLoading(false);
      return;
    }
    if (!user) return;

    // Set cookies for session
    document.cookie = `access_token=${
      data.access_token
    }; path=/; expires=${new Date(
      Date.now() + data.expires_in * 1000,
    ).toUTCString()}`;
    router.push("/");
    setLoading(false);
  }

  useEffect(() => {
    if (status === "loading") return;
    if (accessToken) {
      setLoading(false);
      return;
    }

    const { google } = window;
    if (!google) return;

    try {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleLogIn,
        cancel_on_tap_outside: false,
        prompt_parent_id: parentContainerID,
        itp_support: true,
      });

      // Google One Tap UI
      google.accounts.id.prompt();

      // Render the Sign in button if provided with an ID
      if (parentButtonID) {
        google.accounts.id.renderButton(
          document.getElementById(parentButtonID) as HTMLElement,
          {
            shape: "pill",
            text: "continue_with",
            width: buttonWidth,
            locale,
          },
        );
      }
    } catch (error) {
      logError("useOneTapSignin", {
        detail: error as string,
      });
    }
  }, [status]);

  return { loading };
};
