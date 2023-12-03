// next.config.js
const config = require("./config");
/** @type {import('next').NextConfig} */
const nextConfig = {
 env: {
 DB_URI: config.DB_URI,
 },
};
module.exports = nextConfig;
