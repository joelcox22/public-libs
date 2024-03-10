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
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) {
      debug(`skipping symbolic link ${file}`);
      continue;
    }
    const content = fs.readFileSync(file, 'utf-8');
    const result = markdownlint.sync({
      strings: { content },
      config,
    });
    debug(file, 'lint result', result);
    const fixable = result.content.filter((x) => x.fixInfo !== null);
    const notFixable = result.content.filter((x) => x.fixInfo === null);
    for (const fix of fixable) {
      debug(file, 'line', fix.lineNumber, 'auto fixing', fix.ruleDescription);
    }
    for (const nope of notFixable) {
      console.warn('warning', file, 'line', nope.lineNumber, '-', nope.ruleDescription);
    }
    const fixed = applyFixes(content, result.content);
    fs.writeFileSync(file, fixed);
  }
}
