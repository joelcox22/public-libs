import * as util from '../util.js';

export const name = 'markdown';

export default function configure() {
  const settings = {
    ...util.readJson('.markdownlint.json'),
    default: true,
    MD013: false,
  };
  util.writeJson('.markdownlint.json', settings);
}
