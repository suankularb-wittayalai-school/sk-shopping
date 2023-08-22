/** @type {import('next').NextConfig} */

const { withPlausibleProxy } = require("next-plausible");
const { i18n } = require("./next-i18next.config");

module.exports = withPlausibleProxy()({
  reactStrictMode: true,
  i18n,
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", ""),
      "lh3.googleusercontent.com",
    ],
  },
});
