module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'vi'],
      localeDetection: false,
    },
    fallbackLng: 'en',
    ns: ['common', 'auth'],
    reloadOnPrerender: process.env.NODE_ENV === 'development',
};