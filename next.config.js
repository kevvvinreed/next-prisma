/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const isDev = false;

const env = {
  IS_DEV: isDev ? 'true' : 'false',
  GA_TAG: '',
  DATABASE_URL: process.env.DATABASE_URL,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
};

module.exports = {
  nextConfig,
  env,
};
