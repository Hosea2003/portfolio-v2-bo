import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    optimizeDeps: {
      exclude: ['ai', '@ai-sdk/provider-utils', '@ai-sdk/gateway', '@ai-sdk/react'],
    },
  });
};
