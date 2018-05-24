const withSass = require("@zeit/next-sass");
const withCss = require("@zeit/next-css");
const withTypescript = require("@zeit/next-typescript");

module.exports = withSass(withCss(withTypescript()));