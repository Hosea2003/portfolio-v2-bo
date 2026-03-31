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

    await seedPersonalInfo(strapi);
    await seedContactInfo(strapi);
    await seedServices(strapi);
    await seedProjects(strapi);
    await seedExperiences(strapi);
    await seedSkills(strapi);
  },
};

// Helper: find an existing EN document, create if missing, then ensure FR locale exists
async function ensureSingleType(
  strapi: Core.Strapi,
  uid: string,
  enData: Record<string, unknown>,
  frData: Record<string, unknown>,
) {
  const docs = strapi.documents(uid as any);

  let en = await docs.findFirst({ locale: 'en' });
  if (!en) {
    en = await docs.create({ data: enData as any, locale: 'en', status: 'published' });
    strapi.log.info(`🌱 Seeded ${uid} (EN)`);
  }

  const fr = await docs.findFirst({ locale: 'fr' });
  if (!fr) {
    await docs.update({ documentId: en.documentId, data: frData as any, locale: 'fr', status: 'published' });
    strapi.log.info(`🌱 Seeded ${uid} (FR)`);
  }
}

async function ensureCollectionEntries(
  strapi: Core.Strapi,
  uid: string,
  entries: { en: Record<string, unknown>; fr: Record<string, unknown>; matchField: string }[],
) {
  const docs = strapi.documents(uid as any);

  for (const entry of entries) {
    const matchValue = entry.en[entry.matchField];

    // Check if EN exists
    let en = await docs.findFirst({
      filters: { [entry.matchField]: matchValue } as any,
      locale: 'en',
    });

    if (!en) {
      en = await docs.create({ data: entry.en as any, locale: 'en', status: 'published' });
    }

    // Check if FR locale exists for this document
    const fr = await docs.findFirst({
      filters: { [entry.matchField]: matchValue } as any,
      locale: 'fr',
    });

    if (!fr) {
      await docs.update({
        documentId: en.documentId,
        data: { ...entry.en, ...entry.fr } as any,
        locale: 'fr',
        status: 'published',
      });
    }
  }

  strapi.log.info(`🌱 Seeded ${uid} (EN + FR)`);
}

async function seedPersonalInfo(strapi: Core.Strapi) {
  await ensureSingleType(strapi, 'api::personal-info.personal-info', {
    name: 'RINDRA HOSEA',
    role: 'Full Stack Developer',
    subtitle: 'React • Next.js • React Native',
    bio: 'Full Stack Developer specializing in modern web and mobile applications',
    heroCtaText: 'Hire me',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/rindra', label: 'GitHub' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/rindra', label: 'LinkedIn' },
      { platform: 'twitter', url: 'https://twitter.com/rindra', label: 'Twitter' },
    ],
  }, {
    name: 'RINDRA HOSEA',
    role: 'Développeur Full Stack',
    subtitle: 'React • Next.js • React Native',
    bio: 'Développeur Full Stack spécialisé dans les applications web et mobiles modernes',
    heroCtaText: 'Engagez-moi',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/rindra', label: 'GitHub' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/rindra', label: 'LinkedIn' },
      { platform: 'twitter', url: 'https://twitter.com/rindra', label: 'Twitter' },
    ],
  });
}

async function seedContactInfo(strapi: Core.Strapi) {
  await ensureSingleType(strapi, 'api::contact-info.contact-info', {
    title: "Let's Work Together",
    subtitle: "Have a project in mind? Let's create something amazing together",
  }, {
    title: 'Travaillons Ensemble',
    subtitle: 'Vous avez un projet en tête ? Créons quelque chose d\'incroyable ensemble',
  });
}

async function seedServices(strapi: Core.Strapi) {
  await ensureCollectionEntries(strapi, 'api::service.service', [
    {
      en: { title: 'Backend Development', description: 'NestJS • Django', icon: 'server', order: 1 },
      fr: { title: 'Développement Backend', description: 'NestJS • Django' },
      matchField: 'title',
    },
    {
      en: { title: 'Frontend Development', description: 'React • Next.js', icon: 'layout', order: 2 },
      fr: { title: 'Développement Frontend', description: 'React • Next.js' },
      matchField: 'title',
    },
    {
      en: { title: 'Mobile Development', description: 'React Native', icon: 'smartphone', order: 3 },
      fr: { title: 'Développement Mobile', description: 'React Native' },
      matchField: 'title',
    },
    {
      en: { title: 'API Design', description: 'REST • GraphQL', icon: 'code', order: 4 },
      fr: { title: 'Conception d\'API', description: 'REST • GraphQL' },
      matchField: 'title',
    },
    {
      en: { title: 'Full Stack Solutions', description: 'End-to-End', icon: 'layers', order: 5 },
      fr: { title: 'Solutions Full Stack', description: 'De bout en bout' },
      matchField: 'title',
    },
  ]);
}

async function seedProjects(strapi: Core.Strapi) {
  await ensureCollectionEntries(strapi, 'api::project.project', [
    {
      en: {
        title: 'WebapiGroup', slug: 'webapigroup', category: 'Monitoring Dashboard',
        description: 'Collaborated with WebApiGroup on their platform - API monitoring dashboard with real-time analytics and performance tracking',
        featured: true, order: 1,
      },
      fr: {
        category: 'Tableau de bord de monitoring',
        description: 'Collaboration avec WebApiGroup sur leur plateforme - tableau de bord de monitoring d\'API avec analyses en temps réel et suivi des performances',
      },
      matchField: 'slug',
    },
    {
      en: {
        title: 'Rico', slug: 'rico', category: 'Marketplace',
        description: 'Mobile application for finding and selling goods with intuitive user interface',
        featured: true, order: 2,
      },
      fr: {
        category: 'Place de marché',
        description: 'Application mobile pour trouver et vendre des biens avec une interface utilisateur intuitive',
      },
      matchField: 'slug',
    },
    {
      en: {
        title: 'SingSong', slug: 'singsong', category: 'Mobile Application',
        description: 'Mobile app available on Playstore to find camp songs with admin panel',
        featured: true, order: 3,
      },
      fr: {
        category: 'Application Mobile',
        description: 'Application mobile disponible sur le Playstore pour trouver des chants de camp avec panneau d\'administration',
      },
      matchField: 'slug',
    },
    {
      en: {
        title: 'Addiction Recovery', slug: 'addiction-recovery', category: 'Healthcare Platform',
        description: 'Mobile and web platform connecting doctors specialized in addictions with patients',
        featured: true, order: 4,
      },
      fr: {
        category: 'Plateforme de Santé',
        description: 'Plateforme mobile et web connectant les médecins spécialisés en addictions avec les patients',
      },
      matchField: 'slug',
    },
  ]);
}

async function seedExperiences(strapi: Core.Strapi) {
  await ensureCollectionEntries(strapi, 'api::experience.experience', [
    {
      en: {
        role: 'Freelance Full Stack Developer', company: 'Independent',
        startDate: '2024-08-01', isCurrent: true,
        description: 'Development of new features for mobile and web applications with React Native and Next.js. Created Rico (marketplace app), WeGroupAPI (monitoring dashboard), EasyVecto (logo transformation app), and We Paint Well',
        order: 1,
      },
      fr: {
        role: 'Développeur Full Stack Freelance',
        description: 'Développement de nouvelles fonctionnalités pour des applications mobiles et web avec React Native et Next.js. Création de Rico (application marketplace), WeGroupAPI (tableau de bord de monitoring), EasyVecto (application de transformation de logos) et We Paint Well',
      },
      matchField: 'company',
    },
    {
      en: {
        role: 'Full Stack Developer', company: 'Praktek',
        startDate: '2024-02-01', endDate: '2024-08-01', isCurrent: false,
        description: 'Development of web and mobile applications using React ecosystem. Focused on writing unit tests and ensuring code quality',
        order: 2,
      },
      fr: {
        role: 'Développeur Full Stack',
        description: 'Développement d\'applications web et mobiles avec l\'écosystème React. Concentration sur l\'écriture de tests unitaires et l\'assurance qualité du code',
      },
      matchField: 'company',
    },
    {
      en: {
        role: 'Developer Intern', company: 'Futurmap',
        startDate: '2023-09-01', endDate: '2023-12-01', isCurrent: false,
        description: "Integrated project management functionalities in the company's ERP system using Django and Angular",
        order: 3,
      },
      fr: {
        role: 'Stagiaire Développeur',
        description: 'Intégration de fonctionnalités de gestion de projet dans le système ERP de l\'entreprise en utilisant Django et Angular',
      },
      matchField: 'company',
    },
  ]);
}

async function seedSkills(strapi: Core.Strapi) {
  await ensureCollectionEntries(strapi, 'api::skill.skill', [
    { en: { name: 'Next.js', category: 'frontend' as const, order: 1 }, fr: {}, matchField: 'name' },
    { en: { name: 'React', category: 'frontend' as const, order: 2 }, fr: {}, matchField: 'name' },
    { en: { name: 'React Native', category: 'mobile' as const, order: 3 }, fr: {}, matchField: 'name' },
    { en: { name: 'NestJS', category: 'backend' as const, order: 4 }, fr: {}, matchField: 'name' },
    { en: { name: 'Supabase', category: 'database' as const, order: 5 }, fr: {}, matchField: 'name' },
    { en: { name: 'Firebase', category: 'database' as const, order: 6 }, fr: {}, matchField: 'name' },
  ]);
}
