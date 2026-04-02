import { mergeConfig, type UserConfig } from 'vite';

const aiPackages = ['ai', '@ai-sdk/provider-utils', '@ai-sdk/gateway', '@ai-sdk/react', 'zod/v3', 'zod/v4'];

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    optimizeDeps: {
      exclude: aiPackages,
    },
    build: {
      rollupOptions: {
        external: aiPackages,
      },
    },
  });
};
