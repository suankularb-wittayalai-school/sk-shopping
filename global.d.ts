declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The base URL of the SK Shopping API (referred in this codebase as
       * Jimmy).
       */
      NEXT_PUBLIC_API_URL: string;

      /**
       * The Google Client ID of this application, retrieved from Google Cloud
       * Console > APIs and Service > Credentials > OAuth 2.0 Client ID.
       */
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;

      /**
       * The URL of the Supabase project, retrieved from Settings > API >
       * Project URL.
       */
      NEXT_PUBLIC_SUPABASE_URL: string;

      /**
       * The anon key of the Supabase project, retrieved from Settings > API >
       * Project API Keys > `anon` `public`.
       */
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

      /**
       * Whether the user is allowed to see and log in with Google credentials.
       */
      NEXT_PUBLIC_ALLOW_PASTE_GOOGLE_CREDENTIAL: "true" | "false";

      /**
       * The service role of the Supabase project, retrieved from Settings >
       * API > Project API Keys > `service_role` `secret`.
       */
      SUPABASE_SERVICE_ROLE: string;
    }
  }
}
export {};
