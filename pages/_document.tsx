// Imports
import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="alternate" hrefLang="th" href="/" />
        <link rel="alternate" hrefLang="en-US" href="/en-US" />
        <meta property="og:site_name" content="SK Shopping" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  );
}
