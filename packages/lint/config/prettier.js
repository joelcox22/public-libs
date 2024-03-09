import * as util from '../util.js';

export default function configure() {
  const config = {
    ...util.readJson('.prettierrc'),
    editorconfig: true,
    singleQuote: true,
    semi: true,
  };
  util.writeJson('.prettierrc', config);
}
