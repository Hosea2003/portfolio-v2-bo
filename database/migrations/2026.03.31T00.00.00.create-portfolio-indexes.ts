import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add indexes for commonly queried fields
  const projectsExists = await knex.schema.hasTable('projects');
  if (projectsExists) {
    await knex.schema.alterTable('projects', (table) => {
      table.index('order');
      table.index('featured');
    });
  }

  const experiencesExists = await knex.schema.hasTable('experiences');
  if (experiencesExists) {
    await knex.schema.alterTable('experiences', (table) => {
      table.index('order');
    });
  }

  const servicesExists = await knex.schema.hasTable('services');
  if (servicesExists) {
    await knex.schema.alterTable('services', (table) => {
      table.index('order');
    });
  }

  const skillsExists = await knex.schema.hasTable('skills');
  if (skillsExists) {
    await knex.schema.alterTable('skills', (table) => {
      table.index('order');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const projectsExists = await knex.schema.hasTable('projects');
  if (projectsExists) {
    await knex.schema.alterTable('projects', (table) => {
      table.dropIndex('order');
      table.dropIndex('featured');
    });
  }

  const experiencesExists = await knex.schema.hasTable('experiences');
  if (experiencesExists) {
    await knex.schema.alterTable('experiences', (table) => {
      table.dropIndex('order');
    });
  }

  const servicesExists = await knex.schema.hasTable('services');
  if (servicesExists) {
    await knex.schema.alterTable('services', (table) => {
      table.dropIndex('order');
    });
  }

  const skillsExists = await knex.schema.hasTable('skills');
  if (skillsExists) {
    await knex.schema.alterTable('skills', (table) => {
      table.dropIndex('order');
    });
  }
}
