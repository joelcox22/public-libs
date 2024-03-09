import * as glob from 'glob';
import markdownlint from 'markdownlint';
import { applyFixes } from 'markdownlint-rule-helpers';
import * as util from '../util.js';
import * as fs from 'fs';

const debug = util.debug('linter-markdown');

export default function lint(fix) {
  if (!fix) return;
  const files = glob.sync('**/*.md', { ignore: ['**/node_modules/**'] });
  const config = util.readJson('.markdownlint.json');
  debug('loaded markdownlint config from .markdownlint.json:', config);
  debug('files to lint:', files);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const result = markdownlint.sync({
      strings: { content },
      config,
    });
    const fixed = applyFixes(content, result.content);
    fs.writeFileSync(file, fixed);
  }
}
