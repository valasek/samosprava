import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://samosprava.stanislavvalasek.com',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'sk',
    locales: ['sk', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
