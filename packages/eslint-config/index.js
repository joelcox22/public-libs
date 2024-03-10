import * as fs from 'fs';
import globals from 'globals';
import js from '@eslint/js';
import json from 'eslint-plugin-json';
import react from 'eslint-plugin-react';
import markdown from 'eslint-plugin-markdown';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import Debug from 'debug';

const debug = Debug('@joelbot/eslint-config');

const ignores = fs
  .readFileSync('.gitignore', 'utf-8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => !line.startsWith('#') && line !== '');

debug('calculated eslint ignore list from .gitignore:', ignores);

const config = [
  {
    ignores,
  },
  js.configs.recommended,
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react,
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    processor: json.processors['.json'],
    rules: json.configs.recommended.rules,
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.md'],
    processor: markdown.processors.markdown,
  },
  eslintPluginPrettierRecommended,
];

export default config;
