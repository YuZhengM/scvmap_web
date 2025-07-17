// eslint-disable-next-line import/no-unresolved
import { Config } from 'plotly.js';

const config: Partial<Config> = {
  toImageButtonOptions: {
    format: 'svg', // one of png, svg, jpeg, webp
    filename: 'custom_image',
    scale: 1
  }
};

export default config;
