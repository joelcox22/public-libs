import * as util from '../util.js';

export const name = 'vscode';

export default function configure() {
  const settings = util.readJson('.vscode/settings.json');
  settings['editor.tabSize'] = 2;
  settings['editor.insertSpaces'] = true;
  const onSave = (settings['editor.codeActionsOnSave'] = settings['editor.codeActionsOnSave'] || {});
  onSave['source.fixAll.eslint'] = 'explicit';
  onSave['source.fixAll.markdownlint'] = 'explicit';
  settings['eslint.experimental.useFlatConfig'] = true;
  settings['markdownlint.focusMode'] = true;
  util.writeJson('.vscode/settings.json', settings);
  // ----------------------------------
  const extensions = util.readJson('.vscode/extensions.json');
  if (!Array.isArray(extensions.recommendations)) {
    extensions.recommendations = [];
  }
  extensions.recommendations = extensions.recommendations || [];
  const recommendedExtensions = ['dbaeumer.vscode-eslint', 'davidanson.vscode-markdownlint', 'editorconfig.editorconfig'];
  for (const ext of recommendedExtensions) {
    if (!extensions.recommendations.includes(ext)) {
      extensions.recommendations.push(ext);
    }
  }
  util.writeJson('.vscode/extensions.json', extensions);
}
