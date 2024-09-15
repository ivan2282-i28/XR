import { resolve } from 'path';

const config: UserConfig = {
  resolve: {
    alias: {
      src: resolve('./src')
    }
  }
};

export default config;