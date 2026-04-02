import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Ensure French locale exists in the database
    const localeService = strapi.plugin('i18n').service('locales');
    const existingLocales = await localeService.find();
    const hasFr = existingLocales.some((l: { code: string }) => l.code === 'fr');
    if (!hasFr) {
      await localeService.create({ code: 'fr', name: 'French (fr)' });
      strapi.log.info('🌍 French locale created');
    }
  },
};
