const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "th",
    locales: ["en-US", "th"],
    localePath: path.resolve("./public/static/locales"),
  },
};
